import { Booking } from '../types';

/**
 * Checks if two time ranges overlap on the same date
 */
export function hasTimeOverlap(
  booking1: { date: string; startTime: string; endTime: string },
  booking2: { date: string; startTime: string; endTime: string }
): boolean {
  // Different dates never overlap
  if (booking1.date !== booking2.date) {
    return false;
  }

  const start1 = timeToMinutes(booking1.startTime);
  const end1 = timeToMinutes(booking1.endTime);
  const start2 = timeToMinutes(booking2.startTime);
  const end2 = timeToMinutes(booking2.endTime);

  // Check for overlap: booking1 starts before booking2 ends AND booking1 ends after booking2 starts
  return start1 < end2 && end1 > start2;
}

/**
 * Converts HH:MM time string to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Checks if a new booking conflicts with existing bookings for a specific room
 */
export function hasBookingConflict(
  newBooking: { roomId: string; date: string; startTime: string; endTime: string },
  existingBookings: Booking[],
  excludeBookingId?: string
): boolean {
  const roomBookings = existingBookings.filter(
    (booking) => 
      booking.roomId === newBooking.roomId && 
      booking.id !== excludeBookingId
  );

  return roomBookings.some((booking) => hasTimeOverlap(newBooking, booking));
}

/**
 * Validates that start time is before end time
 */
export function isValidTimeRange(startTime: string, endTime: string): boolean {
  return timeToMinutes(startTime) < timeToMinutes(endTime);
}

/**
 * Formats time for display (removes leading zeros for hours if desired)
 */
export function formatTime(time: string): string {
  return time;
}

/**
 * Generates time slots for a day (e.g., 08:00 - 18:00 in 30-minute increments)
 */
export function generateTimeSlots(
  startHour: number = 8,
  endHour: number = 18,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  // Add the final end time
  slots.push(`${String(endHour).padStart(2, '0')}:00`);
  return slots;
}
