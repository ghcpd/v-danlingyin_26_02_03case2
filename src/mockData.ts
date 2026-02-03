import { Room, Booking } from './types';

export const mockRooms: Room[] = [
  { id: '1', name: 'Conference Room A', capacity: 10 },
  { id: '2', name: 'Conference Room B', capacity: 6 },
  { id: '3', name: 'Meeting Room 1', capacity: 4 },
  { id: '4', name: 'Board Room', capacity: 12 },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    roomId: '1',
    title: 'Team Standup',
    date: '2026-02-03',
    startTime: '09:00',
    endTime: '10:00',
  },
  {
    id: '2',
    roomId: '1',
    title: 'Sprint Planning',
    date: '2026-02-03',
    startTime: '14:00',
    endTime: '16:00',
  },
  {
    id: '3',
    roomId: '2',
    title: 'Client Meeting',
    date: '2026-02-03',
    startTime: '10:00',
    endTime: '11:30',
  },
  {
    id: '4',
    roomId: '3',
    title: '1-on-1 Review',
    date: '2026-02-04',
    startTime: '13:00',
    endTime: '14:00',
  },
];
