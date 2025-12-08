"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Loader2 } from "lucide-react"
import { addEmailSubscriber } from "@/lib/db-email"

interface EmailCaptureProps {
  source?: string
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  className?: string
}

export function EmailCapture({
  source = "unknown",
  title = "Stay in the Loop",
  description = "Join our newsletter to stay updated on new opportunities, tour stops, and scholarships.",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  className = "",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      await addEmailSubscriber(email, source)
      setStatus("success")
      setMessage("Thanks for subscribing! Check your email for confirmation.")
      setEmail("")
    } catch (error: any) {
      setStatus("error")
      setMessage(error.message || "Something went wrong. Please try again.")
    }
  }

  if (status === "success") {
    return (
      <div className={`text-center ${className}`}>
        <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
          <CheckCircle className="h-6 w-6" />
          <p className="font-semibold">You're subscribed!</p>
        </div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {title && <h3 className="text-2xl md:text-3xl font-bold mb-3">{title}</h3>}
      {description && <p className="text-base md:text-lg mb-6">{description}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="flex-1"
          required
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </form>

      {status === "error" && (
        <p className="text-sm text-red-600 mt-2 text-center">{message}</p>
      )}

      <p className="text-xs text-gray-500 mt-3 text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  )
}
