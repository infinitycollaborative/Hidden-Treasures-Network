'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, DollarSign } from 'lucide-react'
import type { DonationType } from '@/types/donation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface DonationFormProps {
  preselectedAmount?: number
  preselectedTier?: string
  showTierSelection?: boolean
}

const PRESET_AMOUNTS = [25, 50, 100, 250, 500, 1000]

function CheckoutForm({
  amount,
  donationType,
  tierName,
}: {
  amount: number
  donationType: DonationType
  tierName?: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate/success`,
        },
      })

      if (error) {
        setErrorMessage(error.message || 'An error occurred')
        setIsProcessing(false)
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Amount:</span>
          <span className="text-2xl font-bold text-aviation-navy">
            ${(amount / 100).toFixed(2)}
          </span>
        </div>
        {tierName && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tier:</span>
            <Badge variant="secondary">{tierName}</Badge>
          </div>
        )}
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">Type:</span>
          <Badge variant={donationType === 'monthly' ? 'default' : 'outline'}>
            {donationType === 'monthly' ? 'Monthly' : 'One-Time'}
          </Badge>
        </div>
      </div>

      <div>
        <Label htmlFor="payment-element">Payment Details</Label>
        <div className="mt-2">
          <PaymentElement id="payment-element" />
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{errorMessage}</div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy"
        size="lg"
      >
        {isProcessing ? 'Processing...' : `Donate $${(amount / 100).toFixed(2)}`}
      </Button>

      <p className="text-xs text-center text-gray-500">
        Your donation is secure and encrypted. You will receive a tax receipt via email.
      </p>
    </form>
  )
}

export default function DonationForm({
  preselectedAmount,
  preselectedTier,
  showTierSelection = false,
}: DonationFormProps) {
  const [donationType, setDonationType] = useState<DonationType>('one-time')
  const [customAmount, setCustomAmount] = useState<string>('')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(
    preselectedAmount ? preselectedAmount * 100 : null
  )
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isCreatingIntent, setIsCreatingIntent] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount * 100)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(Math.round(numValue * 100))
    } else {
      setSelectedAmount(null)
    }
  }

  const handleCreatePaymentIntent = async () => {
    if (!selectedAmount || selectedAmount < 100) {
      alert('Please enter an amount of at least $1.00')
      return
    }

    if (!email) {
      alert('Please enter your email address')
      return
    }

    setIsCreatingIntent(true)

    try {
      const response = await fetch('/api/donations/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedAmount,
          donationType,
          sponsorTier: preselectedTier,
          email,
          name: name || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setClientSecret(data.clientSecret)
      } else {
        alert(data.error || 'Failed to create payment intent')
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsCreatingIntent(false)
    }
  }

  if (clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm
          amount={selectedAmount!}
          donationType={donationType}
          tierName={preselectedTier}
        />
      </Elements>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-aviation-gold" />
          Make a Donation
        </CardTitle>
        <CardDescription>
          Support the Hidden Treasures Network and empower the next generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Donation Type Toggle */}
        <div>
          <Label>Donation Type</Label>
          <div className="mt-2">
            <Tabs value={donationType} onValueChange={(v) => setDonationType(v as DonationType)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="one-time">One-Time</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Preset Amounts */}
        <div>
          <Label>Select Amount</Label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {PRESET_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                type="button"
                variant={selectedAmount === amount * 100 ? 'default' : 'outline'}
                onClick={() => handleAmountSelect(amount)}
                className={
                  selectedAmount === amount * 100
                    ? 'bg-aviation-navy hover:bg-aviation-navy/90'
                    : ''
                }
              >
                ${amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <Label htmlFor="custom-amount">Custom Amount</Label>
          <div className="relative mt-2">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="custom-amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Donor Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Required for tax receipt and confirmation
            </p>
          </div>

          <div>
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleCreatePaymentIntent}
          disabled={!selectedAmount || !email || isCreatingIntent}
          className="w-full bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy"
          size="lg"
        >
          {isCreatingIntent ? 'Processing...' : 'Continue to Payment'}
        </Button>

        <p className="text-xs text-center text-gray-500">
          Hidden Treasures Network is operated by Infinity Aero Club Tampa Bay, Inc., a 501(c)(3)
          nonprofit. Your donation is tax-deductible.
        </p>
      </CardContent>
    </Card>
  )
}
