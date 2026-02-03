import React, { useState, useCallback } from 'react';
import { Room, Booking, ViewMode, BookingFormData } from './types';
import { mockRooms, mockBookings } from './mockData';
import { RoomList } from './components/RoomList';
import { BookingCalendar } from './components/BookingCalendar';
import { BookingForm } from './components/BookingForm';
import { BookingOverview } from './components/BookingOverview';
import './App.css';

function App() {
  const [rooms] = useState<Room[]>(mockRooms);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [currentView, setCurrentView] = useState<ViewMode>('rooms');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const handleSelectRoom = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
    setCurrentView('calendar');
  }, []);

  const handleCreateBooking = useCallback(() => {
    setCurrentView('form');
  }, []);

  const handleSubmitBooking = useCallback((formData: BookingFormData) => {
    const newBooking: Booking = {
      id: Date.now().toString(),
      ...formData,
    };
    
    setBookings((prev) => [...prev, newBooking]);
    
    // Return to calendar view after creating booking
    if (selectedRoomId) {
      setCurrentView('calendar');
    } else {
      setCurrentView('rooms');
    }
  }, [selectedRoomId]);

  const handleCancelForm = useCallback(() => {
    if (selectedRoomId) {
      setCurrentView('calendar');
    } else {
      setCurrentView('rooms');
    }
  }, [selectedRoomId]);

  const handleBackToRooms = useCallback(() => {
    setSelectedRoomId(null);
    setCurrentView('rooms');
  }, []);

  const handleShowOverview = useCallback(() => {
    setCurrentView('overview');
  }, []);

  const selectedRoom = selectedRoomId 
    ? rooms.find((r) => r.id === selectedRoomId) 
    : null;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Team Meeting Room Booking</h1>
        <nav className="app-nav">
          <button
            onClick={() => setCurrentView('rooms')}
            className={currentView === 'rooms' ? 'active' : ''}
          >
            Rooms
          </button>
          <button
            onClick={handleShowOverview}
            className={currentView === 'overview' ? 'active' : ''}
          >
            Overview
          </button>
          <button
            onClick={handleCreateBooking}
            className="btn-primary-nav"
          >
            + New Booking
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'rooms' && (
          <RoomList
            rooms={rooms}
            bookings={bookings}
            onSelectRoom={handleSelectRoom}
          />
        )}

        {currentView === 'calendar' && selectedRoom && (
          <BookingCalendar
            room={selectedRoom}
            bookings={bookings}
            onCreateBooking={handleCreateBooking}
            onBack={handleBackToRooms}
          />
        )}

        {currentView === 'form' && (
          <BookingForm
            rooms={rooms}
            bookings={bookings}
            selectedRoomId={selectedRoomId || undefined}
            onSubmit={handleSubmitBooking}
            onCancel={handleCancelForm}
          />
        )}

        {currentView === 'overview' && (
          <BookingOverview
            rooms={rooms}
            bookings={bookings}
            onBack={handleBackToRooms}
          />
        )}
      </main>
    </div>
  );
}

export default App;
