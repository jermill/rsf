import { supabase } from './supabase';
import { logError } from './sentry';

/**
 * Email service configuration and utilities
 * 
 * This module provides email functionality using Supabase Edge Functions
 * You'll need to set up Edge Functions for actual email sending
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  variables?: Record<string, any>;
  htmlContent?: string;
  textContent?: string;
}

/**
 * Send an email via Supabase Edge Function
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: options,
    });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    logError(error as Error, { context: 'sendEmail', options });
    return false;
  }
};

/**
 * Email Templates
 */
export const EmailTemplates = {
  // Welcome email when user signs up
  welcome: (name: string, email: string) => ({
    subject: 'Welcome to RSF Fitness! 🎉',
    template: 'welcome',
    variables: {
      name,
      email,
      dashboardUrl: `${window.location.origin}/dashboard`,
    },
  }),

  // Booking confirmation
  bookingConfirmation: (
    name: string,
    serviceName: string,
    date: string,
    time: string
  ) => ({
    subject: `Booking Confirmed: ${serviceName}`,
    template: 'booking-confirmation',
    variables: {
      name,
      serviceName,
      date,
      time,
      cancelUrl: `${window.location.origin}/bookings`,
    },
  }),

  // Booking reminder (24 hours before)
  bookingReminder: (
    name: string,
    serviceName: string,
    date: string,
    time: string
  ) => ({
    subject: `Reminder: ${serviceName} Tomorrow`,
    template: 'booking-reminder',
    variables: {
      name,
      serviceName,
      date,
      time,
      rescheduleUrl: `${window.location.origin}/bookings`,
    },
  }),

  // Meal plan assigned
  mealPlanAssigned: (name: string, planName: string) => ({
    subject: `New Meal Plan: ${planName}`,
    template: 'meal-plan-assigned',
    variables: {
      name,
      planName,
      viewUrl: `${window.location.origin}/dashboard`,
    },
  }),

  // Goal milestone reached
  goalMilestone: (name: string, goalName: string, progress: number) => ({
    subject: `Congratulations! Goal Milestone Reached 🎯`,
    template: 'goal-milestone',
    variables: {
      name,
      goalName,
      progress,
      dashboardUrl: `${window.location.origin}/dashboard`,
    },
  }),

  // Payment receipt
  paymentReceipt: (
    name: string,
    amount: number,
    planName: string,
    invoiceId: string
  ) => ({
    subject: `Payment Receipt - ${planName}`,
    template: 'payment-receipt',
    variables: {
      name,
      amount,
      planName,
      invoiceId,
      date: new Date().toLocaleDateString(),
      invoiceUrl: `${window.location.origin}/invoices/${invoiceId}`,
    },
  }),

  // Password reset
  passwordReset: (email: string, resetLink: string) => ({
    subject: 'Reset Your Password',
    template: 'password-reset',
    variables: {
      email,
      resetLink,
      expiresIn: '1 hour',
    },
  }),

  // Coach message notification
  coachMessage: (name: string, coachName: string, message: string) => ({
    subject: `New Message from ${coachName}`,
    template: 'coach-message',
    variables: {
      name,
      coachName,
      messagePreview: message.substring(0, 100),
      messagesUrl: `${window.location.origin}/messages`,
    },
  }),
};

/**
 * Queue email for sending (stores in database, sends via cron job)
 */
export const queueEmail = async (
  userId: string,
  emailOptions: EmailOptions
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('email_queue').insert({
      user_id: userId,
      to_email: Array.isArray(emailOptions.to) 
        ? emailOptions.to 
        : [emailOptions.to],
      subject: emailOptions.subject,
      template: emailOptions.template,
      variables: emailOptions.variables,
      html_content: emailOptions.htmlContent,
      text_content: emailOptions.textContent,
      status: 'pending',
      scheduled_at: new Date().toISOString(),
    });

    if (error) throw error;
    return true;
  } catch (error) {
    logError(error as Error, { context: 'queueEmail', userId, emailOptions });
    return false;
  }
};

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (
  email: string,
  firstName: string
): Promise<boolean> => {
  const template = EmailTemplates.welcome(firstName, email);
  return sendEmail({
    to: email,
    ...template,
  });
};

/**
 * Send booking confirmation email
 */
export const sendBookingConfirmationEmail = async (
  email: string,
  name: string,
  booking: { service_name: string; date: string; time: string }
): Promise<boolean> => {
  const template = EmailTemplates.bookingConfirmation(
    name,
    booking.service_name,
    booking.date,
    booking.time
  );
  return sendEmail({
    to: email,
    ...template,
  });
};

/**
 * Send booking reminder email (call this 24 hours before appointment)
 */
export const sendBookingReminderEmail = async (
  email: string,
  name: string,
  booking: { service_name: string; date: string; time: string }
): Promise<boolean> => {
  const template = EmailTemplates.bookingReminder(
    name,
    booking.service_name,
    booking.date,
    booking.time
  );
  return sendEmail({
    to: email,
    ...template,
  });
};

