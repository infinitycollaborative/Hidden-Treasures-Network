import { EventRegistration } from '@/types/event'

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  // Placeholder for integration with Resend/SendGrid/etc.
  console.info('Email stub:', { to, subject })
  return Promise.resolve()
}

export async function sendEventConfirmationEmail(registration: EventRegistration): Promise<void> {
  if (!registration.email) return Promise.resolve()
  const subject = `Registration confirmed for ${registration.eventId}`
  const html = `<p>Hi ${registration.name},</p><p>You're registered for the event. We look forward to seeing you!</p>`
  return sendEmail({ to: registration.email, subject, html })
}
