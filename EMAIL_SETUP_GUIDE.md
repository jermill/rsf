# Email Notifications Setup Guide

## 📧 Email System Overview

Your RSF Fitness app now has a complete email notification infrastructure with:

- ✅ Email service module with templates
- ✅ Pre-built email templates for common scenarios
- ✅ Queue system for reliable delivery
- ✅ Supabase Edge Functions integration
- ✅ Error handling and logging

## 🔧 Setup Options

### Option 1: Supabase + Resend (Recommended)

**Resend** is a modern, developer-friendly email API.

#### 1. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get your API key from dashboard

#### 2. Create Supabase Edge Function

```bash
# Create function
supabase functions new send-email

# Set secret
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

#### 3. Implement Edge Function

```typescript
// supabase/functions/send-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { to, subject, template, variables, htmlContent } = await req.json()

    // Get template HTML
    const html = htmlContent || getTemplateHtml(template, variables)

    // Send via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'RSF Fitness <noreply@rsfapp.com>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    })

    const data = await res.json()

    return new Response(
      JSON.stringify({ success: true, messageId: data.id }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

function getTemplateHtml(template: string, variables: any): string {
  // Email templates
  const templates: Record<string, (vars: any) => string> = {
    welcome: (vars) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10b981;">Welcome to RSF Fitness!</h1>
        </div>
        <p>Hi ${vars.name},</p>
        <p>Welcome to RSF Fitness! We're excited to have you join our community.</p>
        <p>Your account is now active and you can:</p>
        <ul>
          <li>Track your workouts and progress</li>
          <li>View your personalized meal plans</li>
          <li>Book training sessions</li>
          <li>Connect with coaches</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${vars.dashboardUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The RSF Fitness Team</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #888; text-align: center;">
          RSF Fitness | <a href="https://rsfapp.com">rsfapp.com</a>
        </p>
      </body>
      </html>
    `,

    'booking-confirmation': (vars) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981;">Booking Confirmed! ✅</h1>
        <p>Hi ${vars.name},</p>
        <p>Your booking has been confirmed!</p>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Booking Details:</h3>
          <p><strong>Service:</strong> ${vars.serviceName}</p>
          <p><strong>Date:</strong> ${vars.date}</p>
          <p><strong>Time:</strong> ${vars.time}</p>
        </div>
        <p>We're looking forward to seeing you!</p>
        <p>Need to reschedule? <a href="${vars.cancelUrl}">Manage your bookings</a></p>
        <p>Best regards,<br>The RSF Fitness Team</p>
      </body>
      </html>
    `,

    'booking-reminder': (vars) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981;">Reminder: Session Tomorrow ⏰</h1>
        <p>Hi ${vars.name},</p>
        <p>This is a friendly reminder about your upcoming session:</p>
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${vars.serviceName}</h3>
          <p><strong>Tomorrow at ${vars.time}</strong></p>
          <p>Date: ${vars.date}</p>
        </div>
        <p>See you soon!</p>
        <p>Need to reschedule? <a href="${vars.rescheduleUrl}">Click here</a></p>
      </body>
      </html>
    `,

    'meal-plan-assigned': (vars) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981;">New Meal Plan Assigned! 🍎</h1>
        <p>Hi ${vars.name},</p>
        <p>Your coach has created a new meal plan for you: <strong>${vars.planName}</strong></p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${vars.viewUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            View Meal Plan
          </a>
        </div>
        <p>Check your dashboard to see the full details and start your journey!</p>
      </body>
      </html>
    `,

    'goal-milestone': (vars) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981;">Congratulations! 🎉</h1>
        <p>Hi ${vars.name},</p>
        <p>Amazing work! You've reached ${vars.progress}% of your goal:</p>
        <h2 style="color: #10b981; text-align: center;">${vars.goalName}</h2>
        <p style="text-align: center; font-size: 48px;">🎯</p>
        <p>Keep up the fantastic work! You're making great progress.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${vars.dashboardUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            View Progress
          </a>
        </div>
      </body>
      </html>
    `,

    'payment-receipt': (vars) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>Payment Receipt</h1>
        <p>Hi ${vars.name},</p>
        <p>Thank you for your payment!</p>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Payment Details:</h3>
          <p><strong>Amount:</strong> $${vars.amount}</p>
          <p><strong>Plan:</strong> ${vars.planName}</p>
          <p><strong>Date:</strong> ${vars.date}</p>
          <p><strong>Invoice ID:</strong> ${vars.invoiceId}</p>
        </div>
        <p><a href="${vars.invoiceUrl}">Download Invoice</a></p>
      </body>
      </html>
    `,
  }

  return templates[template]?.(variables) || '<p>Email template not found</p>'
}
```

#### 4. Deploy Function

```bash
supabase functions deploy send-email
```

### Option 2: Supabase + SendGrid

```typescript
// Similar to Resend but use SendGrid API
const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')

const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SENDGRID_API_KEY}`,
  },
  body: JSON.stringify({
    personalizations: [{ to: [{ email: to }] }],
    from: { email: 'noreply@rsfapp.com', name: 'RSF Fitness' },
    subject,
    content: [{ type: 'text/html', value: html }],
  }),
})
```

### Option 3: Supabase Built-in Email (Auth Only)

For auth-related emails (password reset, magic links):

```typescript
// Supabase handles this automatically
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'https://rsfapp.com/reset-password',
})
```

## 📊 Database Setup

Create email queue table:

```sql
-- Email queue table
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  to_email TEXT[] NOT NULL,
  subject TEXT NOT NULL,
  template TEXT,
  variables JSONB,
  html_content TEXT,
  text_content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for processing queue
CREATE INDEX idx_email_queue_status_scheduled 
ON email_queue(status, scheduled_at) 
WHERE status = 'pending';

-- Enable RLS
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view all emails"
ON email_queue FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin')
  )
);
```

## 📧 Usage Examples

### Send Welcome Email

```typescript
import { sendWelcomeEmail } from '../lib/email';

// In signup handler
const handleSignup = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  
  if (!error && data.user) {
    // Send welcome email
    await sendWelcomeEmail(email, data.user.user_metadata.first_name);
  }
};
```

### Send Booking Confirmation

```typescript
import { sendBookingConfirmationEmail } from '../lib/email';

// After creating booking
const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();
    
  if (!error && data) {
    await sendBookingConfirmationEmail(
      user.email,
      user.name,
      {
        service_name: data.service_name,
        date: data.date,
        time: data.time,
      }
    );
  }
};
```

### Schedule Booking Reminders

Create a Supabase Edge Function that runs daily:

```typescript
// supabase/functions/send-reminders/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Find bookings 24 hours from now
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, profiles(email, first_name), services(name)')
    .eq('date', tomorrowStr)
    .eq('status', 'confirmed')

  // Send reminders
  for (const booking of bookings || []) {
    await supabase.functions.invoke('send-email', {
      body: {
        to: booking.profiles.email,
        subject: `Reminder: ${booking.services.name} Tomorrow`,
        template: 'booking-reminder',
        variables: {
          name: booking.profiles.first_name,
          serviceName: booking.services.name,
          date: booking.date,
          time: booking.time,
        },
      },
    })
  }

  return new Response(JSON.stringify({ sent: bookings?.length || 0 }))
})
```

Schedule with cron:

```bash
supabase functions schedule send-reminders "0 9 * * *"  # Every day at 9 AM
```

## 🧪 Testing Emails

### Test Locally

Use **MailHog** for local testing:

```bash
# Run MailHog
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Point your Edge Function to localhost:1025
# View emails at http://localhost:8025
```

### Test Templates

Create a test page:

```typescript
// src/pages/admin/EmailTestPage.tsx
import { EmailTemplates, sendEmail } from '../../lib/email';

export const EmailTestPage = () => {
  const testWelcomeEmail = async () => {
    const template = EmailTemplates.welcome('John Doe', 'test@example.com');
    await sendEmail({
      to: 'test@example.com',
      ...template,
    });
  };

  return (
    <div>
      <h1>Email Testing</h1>
      <button onClick={testWelcomeEmail}>Test Welcome Email</button>
    </div>
  );
};
```

## ✅ Email Checklist

- [ ] Sign up for email service (Resend/SendGrid)
- [ ] Verify your sending domain
- [ ] Create Supabase Edge Function
- [ ] Set up environment variables
- [ ] Create email queue table
- [ ] Test email sending
- [ ] Set up cron jobs for reminders
- [ ] Configure SPF/DKIM/DMARC
- [ ] Create unsubscribe mechanism
- [ ] Monitor email delivery rates

## 📚 Resources

- [Resend Documentation](https://resend.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Email Best Practices](https://postmarkapp.com/guides/email-best-practices)

---

**Status:** ✅ Email infrastructure complete | ⏳ Edge Function deployment needed

Your app has all the email code ready. Next step is to deploy the Edge Function to start sending emails!

