// Data models for Meeting Room Booking application

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface Booking {
  id: string;
  roomId: string;
  title: string;
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:MM (24-hour)
  endTime: string; // Format: HH:MM (24-hour)
}

// Time slot representation for the calendar view
export interface TimeSlot {
  time: string; // Format: HH:MM
  isBooked: boolean;
  booking?: Booking;
}

// Form data for creating a new booking
export interface BookingFormData {
  roomId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}

// Navigation views
export type ViewType = 'rooms' | 'calendar' | 'booking-form' | 'overview';
