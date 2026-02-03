import type { Booking } from '../types';

/**
 * Checks if two time ranges overlap.
 * Times are in HH:MM format (24-hour).
 * 
 * Overlap occurs when:
 * - One booking starts before the other ends AND ends after the other starts
 */
export const doTimesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const start1Min = toMinutes(start1);
  const end1Min = toMinutes(end1);
  const start2Min = toMinutes(start2);
  const end2Min = toMinutes(end2);

  // Check for overlap: NOT (end1 <= start2 OR end2 <= start1)
  return !(end1Min <= start2Min || end2Min <= start1Min);
};

/**
 * Checks if a new booking conflicts with existing bookings for the same room and date.
 * Returns the conflicting booking if found, otherwise null.
 */
export const findConflictingBooking = (
  newBooking: { roomId: string; date: string; startTime: string; endTime: string },
  existingBookings: Booking[],
  excludeBookingId?: string
): Booking | null => {
  const roomBookingsForDate = existingBookings.filter(
    (b) =>
      b.roomId === newBooking.roomId &&
      b.date === newBooking.date &&
      b.id !== excludeBookingId
  );

  for (const booking of roomBookingsForDate) {
    if (doTimesOverlap(newBooking.startTime, newBooking.endTime, booking.startTime, booking.endTime)) {
      return booking;
    }
  }

  return null;
};

/**
 * Validates that end time is after start time.
 */
export const isValidTimeRange = (startTime: string, endTime: string): boolean => {
  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return toMinutes(endTime) > toMinutes(startTime);
};

/**
 * Gets all bookings for a specific room on a specific date.
 */
export const getBookingsForRoomAndDate = (
  roomId: string,
  date: string,
  bookings: Booking[]
): Booking[] => {
  return bookings.filter((b) => b.roomId === roomId && b.date === date);
};

/**
 * Gets all bookings for a specific date across all rooms.
 */
export const getBookingsForDate = (date: string, bookings: Booking[]): Booking[] => {
  return bookings.filter((b) => b.date === date);
};

/**
 * Formats time for display (e.g., "09:00" -> "9:00 AM").
 */
export const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Gets available time slots for a room on a specific date.
 */
export const getAvailableSlots = (
  roomId: string,
  date: string,
  bookings: Booking[],
  allTimeSlots: string[]
): { slot: string; isAvailable: boolean; booking?: Booking }[] => {
  const roomBookings = getBookingsForRoomAndDate(roomId, date, bookings);

  return allTimeSlots.map((slot) => {
    const slotEnd = getNextSlot(slot);
    const conflictingBooking = roomBookings.find((b) =>
      doTimesOverlap(slot, slotEnd, b.startTime, b.endTime)
    );

    return {
      slot,
      isAvailable: !conflictingBooking,
      booking: conflictingBooking,
    };
  });
};

/**
 * Gets the next 30-minute time slot.
 */
const getNextSlot = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + 30;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
};
