import { NextRequest, NextResponse } from 'next/server'

// Email configuration - in production, use environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@hiddentreasuresnetwork.org'
const FROM_NAME = process.env.FROM_NAME || 'Hidden Treasures Network'

interface EmailRequest {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

async function sendWithSendGrid(email: EmailRequest) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: email.to }] }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      reply_to: email.replyTo ? { email: email.replyTo } : undefined,
      subject: email.subject,
      content: [
        { type: 'text/plain', value: email.text || email.html.replace(/<[^>]*>/g, '') },
        { type: 'text/html', value: email.html },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SendGrid error: ${error}`)
  }

  return { success: true }
}

async function sendWithResend(email: EmailRequest) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      reply_to: email.replyTo,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend error: ${error}`)
  }

  return await response.json()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html, text, replyTo, template, data } = body

    // Validate required fields
    if (!to || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject' },
        { status: 400 }
      )
    }

    // Generate HTML from template if provided
    let emailHtml = html
    if (template && data) {
      emailHtml = generateEmailFromTemplate(template, data, html)
    }

    if (!emailHtml) {
      return NextResponse.json(
        { error: 'Missing email content: provide html or template with data' },
        { status: 400 }
      )
    }

    const emailRequest: EmailRequest = {
      to,
      subject,
      html: emailHtml,
      text,
      replyTo,
    }

    // Try SendGrid first, then Resend as fallback
    let result
    if (SENDGRID_API_KEY) {
      result = await sendWithSendGrid(emailRequest)
    } else if (process.env.RESEND_API_KEY) {
      result = await sendWithResend(emailRequest)
    } else {
      // Development mode - log email instead of sending
      console.log('📧 Email would be sent (no email service configured):')
      console.log('  To:', to)
      console.log('  Subject:', subject)
      console.log('  Content:', emailHtml.substring(0, 200) + '...')

      return NextResponse.json({
        success: true,
        message: 'Email logged (development mode - no email service configured)',
        dev: true,
      })
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}

function generateEmailFromTemplate(template: string, data: Record<string, any>, fallbackHtml?: string): string {
  const baseStyles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
      .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
      .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
      .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; }
    </style>
  `

  const footer = `
    <div class="footer">
      <p>Hidden Treasures Network</p>
      <p>A program of Infinity Aero Club Tampa Bay, Inc.</p>
      <p>501(c)(3) Nonprofit Organization</p>
      <p><a href="https://hiddentreasuresnetwork.org">hiddentreasuresnetwork.org</a></p>
    </div>
  `

  switch (template) {
    case 'contact':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Message</h1>
            </div>
            <div class="content">
              <p><strong>From:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Organization:</strong> ${data.organization || 'Not specified'}</p>
              <p><strong>Role:</strong> ${data.role}</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
              <p><strong>Message:</strong></p>
              <div class="highlight">
                <p>${data.message}</p>
              </div>
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `

    case 'contact-confirmation':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Reaching Out!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.name},</p>
              <p>Thank you for contacting Hidden Treasures Network. We've received your message and will get back to you within 1-2 business days.</p>
              <p>Here's a copy of your message:</p>
              <div class="highlight">
                <p>${data.message}</p>
              </div>
              <p style="margin-top: 20px;">In the meantime, feel free to explore our platform and learn more about our mission to empower underserved youth through aviation and STEM education.</p>
              <p style="text-align: center; margin-top: 30px;">
                <a href="https://hiddentreasuresnetwork.org" class="button">Visit Our Website</a>
              </p>
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `

    case 'donation-receipt':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Donation!</h1>
            </div>
            <div class="content">
              <p>Dear ${data.donorName},</p>
              <p>Thank you for your generous ${data.isMonthly ? 'monthly ' : ''}donation to Hidden Treasures Network. Your support helps us empower underserved youth worldwide through aviation, STEM, and entrepreneurship education.</p>

              <div class="highlight">
                <p><strong>Donation Details:</strong></p>
                <p>Amount: $${(data.amount / 100).toFixed(2)} ${data.isMonthly ? '(Monthly)' : ''}</p>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <p>Transaction ID: ${data.transactionId}</p>
              </div>

              <p style="margin-top: 20px;"><strong>Tax Deduction Information:</strong></p>
              <p>Infinity Aero Club Tampa Bay, Inc. is a 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law. Our EIN is available upon request.</p>
              <p>No goods or services were provided in exchange for this contribution.</p>

              <p style="margin-top: 20px;">With your support, we are one step closer to our goal of impacting one million lives by 2030.</p>

              <p>With gratitude,<br/>The Hidden Treasures Network Team</p>
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `

    case 'welcome':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Hidden Treasures Network!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.name},</p>
              <p>Welcome to Hidden Treasures Network! We're thrilled to have you join our global community dedicated to empowering underserved youth through aviation, STEM, and entrepreneurship education.</p>

              <p><strong>Your role:</strong> ${data.role}</p>

              <p>Here's what you can do next:</p>
              <ul>
                <li>Complete your profile to connect with mentors and opportunities</li>
                <li>Explore our resource library for educational materials</li>
                <li>Check out upcoming events in your area</li>
                <li>Start earning badges and XP through our gamification system</li>
              </ul>

              <p style="text-align: center; margin-top: 30px;">
                <a href="https://hiddentreasuresnetwork.org/dashboard" class="button">Go to Dashboard</a>
              </p>

              <p style="margin-top: 30px;">If you have any questions, don't hesitate to reach out to our team.</p>

              <p>Welcome aboard!<br/>The Hidden Treasures Network Team</p>
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `

    default:
      return fallbackHtml || ''
  }
}
