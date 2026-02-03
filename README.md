# Team Meeting Room Booking Application

A complete React + TypeScript web application for managing meeting room bookings with conflict prevention and comprehensive UI.

## Features

### ✅ Complete Implementation
- **Meeting room list** - View all available rooms with capacity and booking counts
- **Booking calendar/time-slot view** - Visual time grid showing available and booked slots
- **Booking creation form** - Create new bookings with validation and conflict detection
- **Booking overview** - View all bookings grouped by room or date

### 🎯 Core Functionality
- **Conflict Prevention**: Real-time validation prevents overlapping bookings
- **Visual Time Slots**: Easy-to-scan interface showing availability at a glance
- **Flexible Viewing**: Switch between room-centric and date-centric views
- **Type Safety**: Fully typed with TypeScript for data integrity

## Tech Stack

- **React 18+** with TypeScript
- **Vite** for fast development and building
- **React Hooks** (useState, useMemo, useCallback) for state management
- **CSS** for styling (no external UI libraries)
- **In-memory data** (no backend required)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── types.ts                    # TypeScript type definitions
├── mockData.ts                 # Initial room and booking data
├── utils/
│   └── bookingUtils.ts        # Booking conflict logic
├── components/
│   ├── RoomList.tsx           # Meeting room list view
│   ├── BookingCalendar.tsx    # Time-slot calendar view
│   ├── BookingForm.tsx        # Booking creation form
│   └── BookingOverview.tsx    # Booking overview by room/date
├── App.tsx                    # Main application component
├── App.css                    # Application styles
└── main.tsx                   # Application entry point
```

## Data Models

### Room
```typescript
interface Room {
  id: string;
  name: string;
  capacity: number;
}
```

### Booking
```typescript
interface Booking {
  id: string;
  roomId: string;
  title: string;
  date: string;      // YYYY-MM-DD format
  startTime: string; // HH:MM format (24-hour)
  endTime: string;   // HH:MM format (24-hour)
}
```

## Booking Conflict Handling

The application implements robust conflict prevention:

### 1. **Validation Logic** (`src/utils/bookingUtils.ts`)
- `hasTimeOverlap()`: Checks if two time ranges overlap on the same date
- `hasBookingConflict()`: Validates new booking against all existing bookings for a room
- `isValidTimeRange()`: Ensures end time is after start time

### 2. **UI Prevention** (`src/components/BookingForm.tsx`)
- Real-time validation on form submission
- Clear error messages when conflicts are detected
- Users cannot submit conflicting bookings
- Visual warning displayed with conflict details

### 3. **Algorithm**
Two bookings conflict if they are for the same room, same date, and their time ranges overlap:
```
Overlap exists when: start1 < end2 AND end1 > start2
```

## User Flows

### 1. **Browse Rooms**
- View all meeting rooms on the home screen
- See room capacity and total bookings
- Click a room to view its calendar

### 2. **View Calendar**
- Select from next 7 days
- See time slots from 8:00 AM to 6:00 PM in 30-minute increments
- Available slots shown in green, booked slots in red
- Booking details displayed directly in the time grid

### 3. **Create Booking**
- Click "New Booking" from navigation or calendar
- Fill in meeting title, select room, date, and time
- Form validates:
  - Required fields
  - End time after start time
  - No conflicts with existing bookings
- Conflict warning displayed if booking overlaps
- Successfully created booking appears immediately in calendar

### 4. **View Overview**
- Access from navigation menu
- Group bookings by room or by date
- Filter to specific room or date
- See statistics (total bookings, active rooms/dates)
- Scan all bookings in organized groups

## Key Implementation Details

### State Management
- Central state in `App.tsx` using `useState`
- Props passed down to child components
- Callbacks for user actions (create booking, navigate)
- No external state management library needed

### Type Safety
- All components fully typed
- Type definitions in `src/types.ts`
- TypeScript strict mode enabled
- No `any` types used

### Styling Approach
- Custom CSS with BEM-like naming
- Responsive grid layouts
- Color-coded time slots (green=available, red=booked)
- Hover effects and transitions for better UX
- Desktop-optimized (as per spec)

## Business Rules Enforced

✅ A room cannot have overlapping bookings  
✅ Time slots are within a single day  
✅ Bookings are created manually via form  
✅ No backend or user accounts required  
✅ Desktop web interface  

## Future Enhancements (Not in Spec)

The following are NOT implemented as they were not in the specification:
- Edit/delete bookings
- Recurring bookings
- Email notifications
- User authentication
- Backend persistence
- Mobile responsive design
- Search/filter functionality beyond overview

## Development Notes

- Mock data is loaded on app initialization
- Bookings are stored in component state (lost on refresh)
- Time slots default to 8 AM - 6 PM business hours
- Dates shown are next 7 days from current date
- All times use 24-hour format (HH:MM)

## Browser Support

Modern browsers with ES2020+ support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
