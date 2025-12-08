import { EventRegistration } from '@/types/event'

export async function sendEventConfirmationEmail(_registration: EventRegistration): Promise<void> {
  // Placeholder for integration with email provider (Resend/SendGrid/etc.)
  return Promise.resolve()
}
