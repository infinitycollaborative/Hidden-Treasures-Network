/**
 * Database helpers for Secure Messaging
 */

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc,
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot,
  arrayUnion,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { MessageThread, Message } from '@/types/message'

const THREADS_COLLECTION = 'messageThreads'
const MESSAGES_COLLECTION = 'messages'

/**
 * Get all threads for a user
 */
export async function getThreadsForUser(userId: string): Promise<MessageThread[]> {
  if (!db) return []
  try {
    const q = query(
      collection(db, THREADS_COLLECTION),
      where('participantIds', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const threads: MessageThread[] = []
    
    snapshot.forEach(doc => {
      threads.push({ id: doc.id, ...doc.data() } as MessageThread)
    })

    return threads
  } catch (error) {
    console.error('Error fetching threads:', error)
    throw new Error('Failed to fetch message threads')
  }
}

/**
 * Create a new message thread between two participants
 */
export async function createThread(
  participantIds: string[],
  relatedSessionId?: string
): Promise<string> {
  if (!db) throw new Error('Firebase not configured')
  try {
    if (participantIds.length !== 2) {
      throw new Error('Threads must have exactly 2 participants')
    }

    // Check if thread already exists between these participants
    const existingThread = await findThreadBetweenUsers(participantIds[0], participantIds[1])
    if (existingThread) {
      return existingThread.id
    }

    const threadData = {
      participantIds,
      relatedSessionId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, THREADS_COLLECTION), threadData)
    return docRef.id
  } catch (error) {
    console.error('Error creating thread:', error)
    throw new Error('Failed to create message thread')
  }
}

/**
 * Find existing thread between two users
 */
export async function findThreadBetweenUsers(
  userId1: string,
  userId2: string
): Promise<MessageThread | null> {
  if (!db) return null
  try {
    const q = query(
      collection(db, THREADS_COLLECTION),
      where('participantIds', 'array-contains', userId1)
    )

    const snapshot = await getDocs(q)
    
    for (const doc of snapshot.docs) {
      const thread = { id: doc.id, ...doc.data() } as MessageThread
      if (thread.participantIds.includes(userId2)) {
        return thread
      }
    }
    
    return null
  } catch (error) {
    console.error('Error finding thread:', error)
    return null
  }
}

/**
 * Get all messages for a thread
 */
export async function getMessagesForThread(threadId: string): Promise<Message[]> {
  if (!db) return []
  try {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where('threadId', '==', threadId),
      orderBy('createdAt', 'asc')
    )

    const snapshot = await getDocs(q)
    const messages: Message[] = []
    
    snapshot.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() } as Message)
    })

    return messages
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw new Error('Failed to fetch messages')
  }
}

/**
 * Send a message in a thread
 */
export async function sendMessage(
  threadId: string,
  senderId: string,
  body: string
): Promise<string> {
  if (!db) throw new Error('Firebase not configured')
  try {
    // Create the message
    const messageData = {
      threadId,
      senderId,
      body,
      readBy: [senderId],
      createdAt: serverTimestamp()
    }

    const messageRef = await addDoc(collection(db, MESSAGES_COLLECTION), messageData)

    // Update thread with last message info
    const threadRef = doc(db, THREADS_COLLECTION, threadId)
    await updateDoc(threadRef, {
      lastMessagePreview: body.substring(0, 100),
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return messageRef.id
  } catch (error) {
    console.error('Error sending message:', error)
    throw new Error('Failed to send message')
  }
}

/**
 * Mark a thread as read by a user
 */
export async function markThreadRead(threadId: string, userId: string): Promise<void> {
  if (!db) return
  try {
    // Get all unread messages in this thread for this user
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where('threadId', '==', threadId)
    )

    const snapshot = await getDocs(q)
    
    const updates = snapshot.docs
      .filter(doc => {
        const message = doc.data() as Message
        return !message.readBy.includes(userId)
      })
      .map(doc => 
        updateDoc(doc.ref, {
          readBy: arrayUnion(userId)
        })
      )

    await Promise.all(updates)
  } catch (error) {
    console.error('Error marking thread as read:', error)
    throw new Error('Failed to mark thread as read')
  }
}

/**
 * Get thread by ID
 */
export async function getThreadById(threadId: string): Promise<MessageThread | null> {
  if (!db) return null
  try {
    const docRef = doc(db, THREADS_COLLECTION, threadId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as MessageThread
    }
    
    return null
  } catch (error) {
    console.error('Error fetching thread:', error)
    return null
  }
}

/**
 * Subscribe to thread updates (real-time)
 */
export function subscribeToThread(
  threadId: string,
  callback: (thread: MessageThread | null) => void
) {
  if (!db) {
    callback(null)
    return () => {}
  }
  const threadRef = doc(db, THREADS_COLLECTION, threadId)
  
  return onSnapshot(threadRef, 
    (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as MessageThread)
      } else {
        callback(null)
      }
    },
    (error) => {
      console.error('Error subscribing to thread:', error)
      callback(null)
    }
  )
}

/**
 * Subscribe to messages in a thread (real-time)
 */
export function subscribeToMessages(
  threadId: string,
  callback: (messages: Message[]) => void
) {
  if (!db) {
    callback([])
    return () => {}
  }
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    where('threadId', '==', threadId),
    orderBy('createdAt', 'asc')
  )
  
  return onSnapshot(q,
    (snapshot) => {
      const messages: Message[] = []
      snapshot.forEach(doc => {
        messages.push({ id: doc.id, ...doc.data() } as Message)
      })
      callback(messages)
    },
    (error) => {
      console.error('Error subscribing to messages:', error)
      callback([])
    }
  )
}

/**
 * Get unread message count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    // Get all threads for user
    const threads = await getThreadsForUser(userId)
    
    let unreadCount = 0
    
    for (const thread of threads) {
      const messages = await getMessagesForThread(thread.id)
      const unread = messages.filter(m => 
        m.senderId !== userId && !m.readBy.includes(userId)
      )
      unreadCount += unread.length
    }
    
    return unreadCount
  } catch (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
}
