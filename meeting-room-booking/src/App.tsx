import { useState, useCallback } from 'react';
import type { Room, Booking, ViewType, BookingFormData } from './types';
import { mockRooms, mockBookings, generateId } from './data/mockData';
import {
  Navigation,
  RoomList,
  TimeSlotView,
  BookingForm,
  BookingOverview,
} from './components';

function App() {
  // State management
  const [rooms] = useState<Room[]>(mockRooms);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [currentView, setCurrentView] = useState<ViewType>('rooms');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [bookingFormContext, setBookingFormContext] = useState<{
    roomId?: string;
    date?: string;
    startTime?: string;
  }>({});

  // Navigation handler
  const handleNavigate = useCallback((view: ViewType) => {
    setCurrentView(view);
    // Reset form context when navigating away from form
    if (view !== 'booking-form') {
      setBookingFormContext({});
    }
  }, []);

  // Room selection handler
  const handleSelectRoom = useCallback((room: Room) => {
    setSelectedRoom(room);
    setCurrentView('calendar');
  }, []);

  // Time slot click handler (from calendar view)
  const handleSlotClick = useCallback(
    (startTime: string) => {
      if (selectedRoom) {
        setBookingFormContext({
          roomId: selectedRoom.id,
          date: selectedDate,
          startTime,
        });
        setCurrentView('booking-form');
      }
    },
    [selectedRoom, selectedDate]
  );

  // Date change handler
  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  // Booking creation handler
  const handleCreateBooking = useCallback((formData: BookingFormData) => {
    const newBooking: Booking = {
      id: generateId(),
      roomId: formData.roomId,
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    setBookings((prev) => [...prev, newBooking]);
    setBookingFormContext({});
    setCurrentView('overview');
  }, []);

  // Booking deletion handler
  const handleDeleteBooking = useCallback((bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  }, []);

  // Cancel booking form
  const handleCancelBooking = useCallback(() => {
    setBookingFormContext({});
    if (selectedRoom) {
      setCurrentView('calendar');
    } else {
      setCurrentView('rooms');
    }
  }, [selectedRoom]);

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'rooms':
        return (
          <RoomList
            rooms={rooms}
            onSelectRoom={handleSelectRoom}
            selectedRoomId={selectedRoom?.id}
          />
        );

      case 'calendar':
        if (!selectedRoom) {
          // If no room selected, show room list first
          return (
            <div style={styles.noRoomSelected}>
              <p style={styles.noRoomText}>Please select a room first</p>
              <button
                style={styles.selectRoomButton}
                onClick={() => setCurrentView('rooms')}
              >
                Go to Rooms
              </button>
            </div>
          );
        }
        return (
          <TimeSlotView
            room={selectedRoom}
            date={selectedDate}
            bookings={bookings}
            onSlotClick={handleSlotClick}
            onDateChange={handleDateChange}
          />
        );

      case 'booking-form':
        return (
          <BookingForm
            rooms={rooms}
            bookings={bookings}
            onSubmit={handleCreateBooking}
            onCancel={handleCancelBooking}
            initialRoomId={bookingFormContext.roomId}
            initialDate={bookingFormContext.date}
            initialStartTime={bookingFormContext.startTime}
          />
        );

      case 'overview':
        return (
          <BookingOverview
            rooms={rooms}
            bookings={bookings}
            onDeleteBooking={handleDeleteBooking}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.app}>
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
      <main style={styles.main}>
        <div style={styles.content}>{renderView()}</div>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  main: {
    padding: '24px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    minHeight: '400px',
  },
  noRoomSelected: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
  noRoomText: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '16px',
  },
  selectRoomButton: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default App;
