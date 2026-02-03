import type { Room, Booking } from '../types';

// Mock rooms data
export const mockRooms: Room[] = [
  { id: 'room-1', name: 'Conference Room A', capacity: 10 },
  { id: 'room-2', name: 'Meeting Room B', capacity: 6 },
  { id: 'room-3', name: 'Boardroom C', capacity: 20 },
  { id: 'room-4', name: 'Huddle Space D', capacity: 4 },
];

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    roomId: 'room-1',
    title: 'Project Kickoff',
    date: '2026-02-03',
    startTime: '09:00',
    endTime: '10:00',
  },
  {
    id: 'booking-2',
    roomId: 'room-1',
    title: 'Team Standup',
    date: '2026-02-03',
    startTime: '14:00',
    endTime: '14:30',
  },
  {
    id: 'booking-3',
    roomId: 'room-2',
    title: 'Client Call',
    date: '2026-02-03',
    startTime: '11:00',
    endTime: '12:00',
  },
  {
    id: 'booking-4',
    roomId: 'room-3',
    title: 'Board Meeting',
    date: '2026-02-04',
    startTime: '10:00',
    endTime: '12:00',
  },
];

// Generate time slots for a day (8 AM to 6 PM, 30-minute intervals)
export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 8; hour < 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

// Generate unique ID
export const generateId = (): string => {
  return `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
