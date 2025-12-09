import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { awardXP, awardBadge } from './db-gamification'
import type {
  District,
  School,
  Classroom,
  ClassroomRoster,
  CurriculumModule,
  ModuleAssignment,
  StudentProgress,
  ParentalConsent,
  EnrollmentStatus,
  ProgressStatus,
  ConsentStatus,
} from '@/types'

// ============================================
// DISTRICT FUNCTIONS
// ============================================

/**
 * Create a new school district
 */
export async function createDistrict(
  district: Omit<District, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const districtRef = doc(collection(db, 'districts'))
    const newDistrict: District = {
      ...district,
      id: districtRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(districtRef, newDistrict)
    return districtRef.id
  } catch (error) {
    console.error('Error creating district:', error)
    throw error
  }
}

/**
 * Get district by ID
 */
export async function getDistrict(districtId: string): Promise<District | null> {
  try {
    const districtDoc = await getDoc(doc(db, 'districts', districtId))
    return districtDoc.exists() ? (districtDoc.data() as District) : null
  } catch (error) {
    console.error('Error getting district:', error)
    return null
  }
}

/**
 * Get all active districts
 */
export async function getActiveDistricts(): Promise<District[]> {
  try {
    const q = query(collection(db, 'districts'), where('isActive', '==', true), orderBy('name'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as District)
  } catch (error) {
    console.error('Error getting active districts:', error)
    return []
  }
}

// ============================================
// SCHOOL FUNCTIONS
// ============================================

/**
 * Create a new school
 */
export async function createSchool(
  school: Omit<School, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const schoolRef = doc(collection(db, 'schools'))
    const newSchool: School = {
      ...school,
      id: schoolRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(schoolRef, newSchool)

    // Update district school count if applicable
    if (school.districtId) {
      await updateDoc(doc(db, 'districts', school.districtId), {
        schoolCount: increment(1),
      })
    }

    return schoolRef.id
  } catch (error) {
    console.error('Error creating school:', error)
    throw error
  }
}

/**
 * Get school by ID
 */
export async function getSchool(schoolId: string): Promise<School | null> {
  try {
    const schoolDoc = await getDoc(doc(db, 'schools', schoolId))
    return schoolDoc.exists() ? (schoolDoc.data() as School) : null
  } catch (error) {
    console.error('Error getting school:', error)
    return null
  }
}

/**
 * Get schools by district
 */
export async function getSchoolsByDistrict(districtId: string): Promise<School[]> {
  try {
    const q = query(
      collection(db, 'schools'),
      where('districtId', '==', districtId),
      where('isActive', '==', true),
      orderBy('name')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as School)
  } catch (error) {
    console.error('Error getting schools by district:', error)
    return []
  }
}

/**
 * Get all active schools
 */
export async function getActiveSchools(): Promise<School[]> {
  try {
    const q = query(
      collection(db, 'schools'),
      where('status', '==', 'active'),
      orderBy('name')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as School)
  } catch (error) {
    console.error('Error getting active schools:', error)
    return []
  }
}

// ============================================
// CLASSROOM FUNCTIONS
// ============================================

/**
 * Generate a unique 6-character join code
 */
export async function generateUniqueJoinCode(): Promise<string> {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing characters
  let code: string
  let isUnique = false
  let attempts = 0
  const maxAttempts = 10

  while (!isUnique && attempts < maxAttempts) {
    // Generate 6-character code
    code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')

    // Check if code already exists
    const q = query(collection(db, 'classrooms'), where('joinCode', '==', code), limit(1))
    const snapshot = await getDocs(q)
    isUnique = snapshot.empty

    attempts++
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique join code after maximum attempts')
  }

  return code!
}

/**
 * Create a new classroom
 */
export async function createClassroom(
  classroom: Omit<Classroom, 'id' | 'joinCode' | 'createdAt' | 'updatedAt'>
): Promise<{ id: string; joinCode: string }> {
  try {
    const classroomRef = doc(collection(db, 'classrooms'))
    const joinCode = await generateUniqueJoinCode()

    const newClassroom: Classroom = {
      ...classroom,
      id: classroomRef.id,
      joinCode,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    await setDoc(classroomRef, newClassroom)

    // Update school classroom count
    await updateDoc(doc(db, 'schools', classroom.schoolId), {
      classroomCount: increment(1),
    })

    return { id: classroomRef.id, joinCode }
  } catch (error) {
    console.error('Error creating classroom:', error)
    throw error
  }
}

/**
 * Get classroom by ID
 */
export async function getClassroom(classroomId: string): Promise<Classroom | null> {
  try {
    const classroomDoc = await getDoc(doc(db, 'classrooms', classroomId))
    return classroomDoc.exists() ? (classroomDoc.data() as Classroom) : null
  } catch (error) {
    console.error('Error getting classroom:', error)
    return null
  }
}

/**
 * Get classroom by join code
 */
export async function getClassroomByJoinCode(joinCode: string): Promise<Classroom | null> {
  try {
    const q = query(collection(db, 'classrooms'), where('joinCode', '==', joinCode), limit(1))
    const snapshot = await getDocs(q)
    return snapshot.empty ? null : (snapshot.docs[0].data() as Classroom)
  } catch (error) {
    console.error('Error getting classroom by join code:', error)
    return null
  }
}

/**
 * Get classrooms by teacher
 */
export async function getClassroomsByTeacher(teacherId: string): Promise<Classroom[]> {
  try {
    const q = query(
      collection(db, 'classrooms'),
      where('teacherId', '==', teacherId),
      where('status', 'in', ['active', 'draft']),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as Classroom)
  } catch (error) {
    console.error('Error getting classrooms by teacher:', error)
    return []
  }
}

/**
 * Get classrooms by school
 */
export async function getClassroomsBySchool(schoolId: string): Promise<Classroom[]> {
  try {
    const q = query(
      collection(db, 'classrooms'),
      where('schoolId', '==', schoolId),
      where('status', '==', 'active'),
      orderBy('name')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as Classroom)
  } catch (error) {
    console.error('Error getting classrooms by school:', error)
    return []
  }
}

/**
 * Regenerate classroom join code
 */
export async function regenerateJoinCode(classroomId: string): Promise<string> {
  try {
    const newJoinCode = await generateUniqueJoinCode()
    await updateDoc(doc(db, 'classrooms', classroomId), {
      joinCode: newJoinCode,
      updatedAt: Timestamp.now(),
    })
    return newJoinCode
  } catch (error) {
    console.error('Error regenerating join code:', error)
    throw error
  }
}

// ============================================
// CLASSROOM ROSTER FUNCTIONS
// ============================================

/**
 * Enroll student in classroom
 */
export async function enrollStudent(
  classroomId: string,
  studentId: string,
  studentName: string,
  parentalConsentGiven: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if already enrolled
    const q = query(
      collection(db, 'classroomRoster'),
      where('classroomId', '==', classroomId),
      where('studentId', '==', studentId),
      limit(1)
    )
    const existing = await getDocs(q)
    if (!existing.empty) {
      return { success: false, error: 'Student already enrolled' }
    }

    // Get classroom to check capacity
    const classroom = await getClassroom(classroomId)
    if (!classroom) {
      return { success: false, error: 'Classroom not found' }
    }

    if (classroom.maxStudents && classroom.studentIds.length >= classroom.maxStudents) {
      return { success: false, error: 'Classroom is full' }
    }

    // Check if parental consent required
    const school = await getSchool(classroom.schoolId)
    if (school?.settings.requireParentalConsent && !parentalConsentGiven) {
      return { success: false, error: 'Parental consent required' }
    }

    // Create roster entry
    const rosterRef = doc(collection(db, 'classroomRoster'))
    const roster: ClassroomRoster = {
      id: rosterRef.id,
      classroomId,
      studentId,
      studentName,
      enrollmentStatus: 'active',
      enrolledAt: Timestamp.now(),
      parentalConsentGiven,
      modulesCompleted: [],
      totalXPEarned: 0,
      attendancePercentage: 100,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(rosterRef, roster)

    // Add student to classroom
    await updateDoc(doc(db, 'classrooms', classroomId), {
      studentIds: arrayUnion(studentId),
      updatedAt: Timestamp.now(),
    })

    return { success: true }
  } catch (error) {
    console.error('Error enrolling student:', error)
    return { success: false, error: 'Failed to enroll student' }
  }
}

/**
 * Get classroom roster
 */
export async function getClassroomRoster(classroomId: string): Promise<ClassroomRoster[]> {
  try {
    const q = query(
      collection(db, 'classroomRoster'),
      where('classroomId', '==', classroomId),
      where('enrollmentStatus', '==', 'active'),
      orderBy('studentName')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as ClassroomRoster)
  } catch (error) {
    console.error('Error getting classroom roster:', error)
    return []
  }
}

/**
 * Update enrollment status
 */
export async function updateEnrollmentStatus(
  rosterId: string,
  status: EnrollmentStatus
): Promise<void> {
  try {
    const updates: any = {
      enrollmentStatus: status,
      updatedAt: Timestamp.now(),
    }

    if (status === 'dropped') {
      updates.droppedAt = Timestamp.now()
    } else if (status === 'completed') {
      updates.completedAt = Timestamp.now()
    }

    await updateDoc(doc(db, 'classroomRoster', rosterId), updates)
  } catch (error) {
    console.error('Error updating enrollment status:', error)
    throw error
  }
}

// ============================================
// CURRICULUM MODULE FUNCTIONS
// ============================================

/**
 * Create curriculum module
 */
export async function createCurriculumModule(
  module: Omit<CurriculumModule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const moduleRef = doc(collection(db, 'curriculumModules'))
    const newModule: CurriculumModule = {
      ...module,
      id: moduleRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(moduleRef, newModule)
    return moduleRef.id
  } catch (error) {
    console.error('Error creating curriculum module:', error)
    throw error
  }
}

/**
 * Get published modules
 */
export async function getPublishedModules(): Promise<CurriculumModule[]> {
  try {
    const q = query(
      collection(db, 'curriculumModules'),
      where('status', '==', 'published'),
      orderBy('title')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as CurriculumModule)
  } catch (error) {
    console.error('Error getting published modules:', error)
    return []
  }
}

/**
 * Get module by ID
 */
export async function getCurriculumModule(moduleId: string): Promise<CurriculumModule | null> {
  try {
    const moduleDoc = await getDoc(doc(db, 'curriculumModules', moduleId))
    return moduleDoc.exists() ? (moduleDoc.data() as CurriculumModule) : null
  } catch (error) {
    console.error('Error getting curriculum module:', error)
    return null
  }
}

// ============================================
// MODULE ASSIGNMENT FUNCTIONS
// ============================================

/**
 * Assign module to classroom
 */
export async function assignModuleToClassroom(
  assignment: Omit<ModuleAssignment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const assignmentRef = doc(collection(db, 'moduleAssignments'))
    const newAssignment: ModuleAssignment = {
      ...assignment,
      id: assignmentRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(assignmentRef, newAssignment)

    // Add module to classroom
    await updateDoc(doc(db, 'classrooms', assignment.classroomId), {
      moduleIds: arrayUnion(assignment.moduleId),
      updatedAt: Timestamp.now(),
    })

    return assignmentRef.id
  } catch (error) {
    console.error('Error assigning module to classroom:', error)
    throw error
  }
}

/**
 * Get assignments for classroom
 */
export async function getClassroomAssignments(classroomId: string): Promise<ModuleAssignment[]> {
  try {
    const q = query(
      collection(db, 'moduleAssignments'),
      where('classroomId', '==', classroomId),
      orderBy('assignedAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as ModuleAssignment)
  } catch (error) {
    console.error('Error getting classroom assignments:', error)
    return []
  }
}

// ============================================
// STUDENT PROGRESS FUNCTIONS
// ============================================

/**
 * Start module progress
 */
export async function startModuleProgress(
  studentId: string,
  classroomId: string,
  moduleId: string,
  assignmentId?: string
): Promise<string> {
  try {
    const progressRef = doc(collection(db, 'studentProgress'))
    const progress: StudentProgress = {
      id: progressRef.id,
      studentId,
      classroomId,
      moduleId,
      assignmentId,
      status: 'in_progress',
      progressPercentage: 0,
      startedAt: Timestamp.now(),
      attemptNumber: 1,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(progressRef, progress)
    return progressRef.id
  } catch (error) {
    console.error('Error starting module progress:', error)
    throw error
  }
}

/**
 * Update module progress
 */
export async function updateModuleProgress(
  progressId: string,
  updates: Partial<StudentProgress>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'studentProgress', progressId), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating module progress:', error)
    throw error
  }
}

/**
 * Complete module with gamification integration
 */
export async function completeModule(
  progressId: string,
  score: number,
  feedback?: string
): Promise<{ success: boolean; xpAwarded?: number; badgesAwarded?: string[] }> {
  try {
    // Get progress record
    const progressDoc = await getDoc(doc(db, 'studentProgress', progressId))
    if (!progressDoc.exists()) {
      return { success: false }
    }

    const progress = progressDoc.data() as StudentProgress

    // Get module details
    const module = await getCurriculumModule(progress.moduleId)
    if (!module) {
      return { success: false }
    }

    // Get classroom settings
    const classroom = await getClassroom(progress.classroomId)
    if (!classroom) {
      return { success: false }
    }

    // Check if passing
    const isPassing = !module.passingScore || score >= module.passingScore

    if (!isPassing) {
      // Update progress with failing status
      await updateModuleProgress(progressId, {
        status: 'graded',
        score,
        feedback,
        gradedAt: Timestamp.now(),
      })
      return { success: true, xpAwarded: 0 }
    }

    // Calculate XP with classroom multiplier
    const xpMultiplier = classroom.settings.xpMultiplier || 1.0
    const xpToAward = Math.floor(module.xpReward * xpMultiplier)

    // Award XP (Phase 13 integration)
    if (classroom.settings.enableGamification && xpToAward > 0) {
      await awardXP(
        progress.studentId,
        xpToAward,
        'programs',
        `Completed module: ${module.title}`,
        module.id
      )
    }

    // Award badge if applicable
    const badgesAwarded: string[] = []
    if (classroom.settings.enableGamification && module.badgeReward) {
      const badgeResult = await awardBadge(
        progress.studentId,
        module.badgeReward,
        `Completed module: ${module.title}`
      )
      if (badgeResult.success) {
        badgesAwarded.push(module.badgeReward)
      }
    }

    // Update progress
    await updateModuleProgress(progressId, {
      status: 'completed',
      score,
      feedback,
      xpAwarded: xpToAward,
      badgesAwarded,
      gradedAt: Timestamp.now(),
      completedAt: Timestamp.now(),
      progressPercentage: 100,
    })

    // Update roster
    const rosterQuery = query(
      collection(db, 'classroomRoster'),
      where('classroomId', '==', progress.classroomId),
      where('studentId', '==', progress.studentId),
      limit(1)
    )
    const rosterSnapshot = await getDocs(rosterQuery)
    if (!rosterSnapshot.empty) {
      const rosterDoc = rosterSnapshot.docs[0]
      await updateDoc(rosterDoc.ref, {
        modulesCompleted: arrayUnion(progress.moduleId),
        totalXPEarned: increment(xpToAward),
        updatedAt: Timestamp.now(),
      })
    }

    return { success: true, xpAwarded: xpToAward, badgesAwarded }
  } catch (error) {
    console.error('Error completing module:', error)
    return { success: false }
  }
}

/**
 * Get student progress in classroom
 */
export async function getStudentProgress(
  studentId: string,
  classroomId: string
): Promise<StudentProgress[]> {
  try {
    const q = query(
      collection(db, 'studentProgress'),
      where('studentId', '==', studentId),
      where('classroomId', '==', classroomId),
      orderBy('updatedAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as StudentProgress)
  } catch (error) {
    console.error('Error getting student progress:', error)
    return []
  }
}

// ============================================
// PARENTAL CONSENT FUNCTIONS (FERPA)
// ============================================

/**
 * Request parental consent
 */
export async function requestParentalConsent(
  consent: Omit<ParentalConsent, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const consentRef = doc(collection(db, 'parentalConsent'))
    const newConsent: ParentalConsent = {
      ...consent,
      id: consentRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(consentRef, newConsent)

    // TODO: Send email to parent/guardian with consent form link

    return consentRef.id
  } catch (error) {
    console.error('Error requesting parental consent:', error)
    throw error
  }
}

/**
 * Update consent status
 */
export async function updateConsentStatus(
  consentId: string,
  status: ConsentStatus,
  ipAddress?: string
): Promise<void> {
  try {
    const updates: any = {
      consentStatus: status,
      updatedAt: Timestamp.now(),
    }

    if (status === 'granted') {
      updates.consentDate = Timestamp.now()
      updates.ipAddress = ipAddress
    }

    await updateDoc(doc(db, 'parentalConsent', consentId), updates)
  } catch (error) {
    console.error('Error updating consent status:', error)
    throw error
  }
}

/**
 * Get consent for student
 */
export async function getStudentConsent(studentId: string): Promise<ParentalConsent | null> {
  try {
    const q = query(
      collection(db, 'parentalConsent'),
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc'),
      limit(1)
    )
    const snapshot = await getDocs(q)
    return snapshot.empty ? null : (snapshot.docs[0].data() as ParentalConsent)
  } catch (error) {
    console.error('Error getting student consent:', error)
    return null
  }
}

/**
 * Check if student has valid consent for classroom
 */
export async function hasValidConsent(
  studentId: string,
  classroomId: string
): Promise<boolean> {
  try {
    const consent = await getStudentConsent(studentId)
    if (!consent) return false

    return (
      consent.consentStatus === 'granted' &&
      consent.classroomIds.includes(classroomId) &&
      (!consent.expirationDate || consent.expirationDate.toMillis() > Date.now())
    )
  } catch (error) {
    console.error('Error checking valid consent:', error)
    return false
  }
}
