export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface Booking {
  id: string;
  roomId: string;
  title: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format (24-hour)
  endTime: string; // HH:MM format (24-hour)
}

export type ViewMode = 'rooms' | 'calendar' | 'form' | 'overview';

export interface BookingFormData {
  roomId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}
