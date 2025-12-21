import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getFirebaseDb } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import type { CreatePaymentIntentRequest, CreatePaymentIntentResponse } from '@/types/donation'

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentIntentRequest = await request.json()
    const { amount, donorId, sponsorTier, donationType, email, name } = body

    // Validate amount (minimum $1)
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least $1.00' },
        { status: 400 }
      )
    }

    // Validate donation type
    if (!donationType || !['one-time', 'monthly'].includes(donationType)) {
      return NextResponse.json(
        { error: 'Invalid donation type' },
        { status: 400 }
      )
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        donorId: donorId || 'anonymous',
        sponsorTier: sponsorTier || '',
        donationType,
        email: email || '',
        name: name || '',
      },
    })

    // Store donation record in Firestore if db is configured
    const db = getFirebaseDb()
    if (db) {
      const donationData = {
        userId: donorId || null,
        amount,
        currency: 'usd',
        type: donationType,
        sponsorTier: sponsorTier || null,
        status: 'pending',
        paymentIntentId: paymentIntent.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        metadata: {
          email: email || '',
          name: name || '',
        },
      }

      await addDoc(collection(db, 'donations'), donationData)
    }

    const response: CreatePaymentIntentResponse = {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
