import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
})

// Platform fee percentage (e.g., 3% = 0.03)
const PLATFORM_FEE_PERCENTAGE = 0.03

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'usd', metadata = {} } = body

    // Validate amount
    if (!amount || amount < 50) {
      // Minimum $0.50
      return NextResponse.json(
        { error: 'Amount must be at least $0.50' },
        { status: 400 }
      )
    }

    // Calculate platform fee
    const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE)
    const netAmount = amount - platformFee

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        platformFee: platformFee.toString(),
        netAmount: netAmount.toString(),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      platformFee,
      netAmount,
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
