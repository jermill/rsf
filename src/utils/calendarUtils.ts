/**
 * Calendar Integration Utilities
 * Generates calendar links for Google Calendar, Apple Calendar (iCal), and Outlook
 */

interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
}

/**
 * Format date for calendar URLs (YYYYMMDDTHHmmss)
 */
const formatDateForCalendar = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

/**
 * Parse booking date and time into a Date object
 * @param dateString - e.g., "Wednesday, November 20, 2025"
 * @param timeString - e.g., "10:00 AM"
 * @returns Date object
 */
export const parseBookingDateTime = (dateString: string, timeString: string): Date => {
  // Parse the date string
  const date = new Date(dateString);
  
  // Parse the time string
  const timeMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!timeMatch) {
    console.error('Invalid time format:', timeString);
    return date;
  }
  
  let hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  const period = timeMatch[3].toUpperCase();
  
  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  date.setHours(hours, minutes, 0, 0);
  
  return date;
};

/**
 * Generate Google Calendar URL
 */
export const generateGoogleCalendarUrl = (event: CalendarEvent): string => {
  const startDate = formatDateForCalendar(event.startTime);
  const endDate = formatDateForCalendar(event.endTime);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${startDate}/${endDate}`,
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generate iCal/Apple Calendar file content (.ics)
 */
export const generateICalFile = (event: CalendarEvent): string => {
  const startDate = formatDateForCalendar(event.startTime);
  const endDate = formatDateForCalendar(event.endTime);
  const now = formatDateForCalendar(new Date());
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ready Set Fit//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@readysetfit.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Session starts in 30 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  
  return icsContent;
};

/**
 * Download iCal file
 */
export const downloadICalFile = (event: CalendarEvent, filename: string = 'session.ics'): void => {
  const icsContent = generateICalFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Generate Outlook.com Calendar URL
 */
export const generateOutlookCalendarUrl = (event: CalendarEvent): string => {
  const startDate = event.startTime.toISOString();
  const endDate = event.endTime.toISOString();
  
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: startDate,
    enddt: endDate,
  });
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

/**
 * Open calendar selection modal (returns calendar URL or triggers download)
 */
export const addToCalendar = (
  event: CalendarEvent,
  provider: 'google' | 'apple' | 'outlook' = 'google'
): void => {
  switch (provider) {
    case 'google':
      window.open(generateGoogleCalendarUrl(event), '_blank');
      break;
    case 'apple':
      downloadICalFile(event);
      break;
    case 'outlook':
      window.open(generateOutlookCalendarUrl(event), '_blank');
      break;
    default:
      console.error('Unknown calendar provider:', provider);
  }
};

/**
 * Create calendar event from booking details
 */
export const createCalendarEventFromBooking = (booking: {
  date: string;
  time: string;
  service: string;
  price: number;
  trainer: string;
  location: 'in-person' | 'online';
  duration?: number;
}): CalendarEvent => {
  const startTime = parseBookingDateTime(booking.date, booking.time);
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + (booking.duration || 60)); // Default 60 min
  
  const locationText = booking.location === 'online' 
    ? 'Online Session (Link will be provided)' 
    : 'Ready Set Fit Gym';
  
  const description = [
    `Session with ${booking.trainer}`,
    `Service: ${booking.service}`,
    `Price: $${booking.price}`,
    '',
    booking.location === 'online'
      ? 'You will receive a video call link before the session.'
      : 'Please arrive 5-10 minutes early.',
    '',
    'If you need to reschedule or cancel, please contact us at least 24 hours in advance.',
  ].join('\n');
  
  return {
    title: `${booking.service} Session`,
    description,
    location: locationText,
    startTime,
    endTime,
  };
};

