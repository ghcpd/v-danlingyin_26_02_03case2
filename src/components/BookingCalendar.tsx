import React, { useMemo, useState } from 'react';
import { Room, Booking } from '../types';
import { generateTimeSlots, timeToMinutes } from '../utils/bookingUtils';

interface BookingCalendarProps {
  room: Room;
  bookings: Booking[];
  onCreateBooking: () => void;
  onBack: () => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  room,
  bookings,
  onCreateBooking,
  onBack,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const timeSlots = useMemo(() => generateTimeSlots(8, 18, 30), []);

  const dayBookings = useMemo(() => {
    return bookings.filter(
      (booking) => booking.roomId === room.id && booking.date === selectedDate
    ).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [bookings, room.id, selectedDate]);

  const isTimeSlotBooked = (slotTime: string): Booking | null => {
    const slotMinutes = timeToMinutes(slotTime);
    
    for (const booking of dayBookings) {
      const startMinutes = timeToMinutes(booking.startTime);
      const endMinutes = timeToMinutes(booking.endTime);
      
      if (slotMinutes >= startMinutes && slotMinutes < endMinutes) {
        return booking;
      }
    }
    
    return null;
  };

  const getNextDays = (count: number): string[] => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="booking-calendar">
      <div className="calendar-header">
        <button onClick={onBack} className="btn-secondary">← Back to Rooms</button>
        <div>
          <h2>{room.name}</h2>
          <p className="subtitle">Capacity: {room.capacity} people</p>
        </div>
        <button onClick={onCreateBooking} className="btn-primary">+ New Booking</button>
      </div>

      <div className="date-selector">
        {getNextDays(7).map((date) => (
          <button
            key={date}
            className={`date-button ${date === selectedDate ? 'active' : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            {formatDate(date)}
          </button>
        ))}
      </div>

      <div className="time-grid">
        <div className="time-grid-header">
          <div className="time-column-header">Time</div>
          <div className="status-column-header">Status</div>
        </div>

        {timeSlots.slice(0, -1).map((slot, index) => {
          const nextSlot = timeSlots[index + 1];
          const booking = isTimeSlotBooked(slot);
          const isStart = booking && booking.startTime === slot;

          return (
            <div
              key={slot}
              className={`time-slot ${booking ? 'booked' : 'available'}`}
            >
              <div className="time-label">
                {slot} - {nextSlot}
              </div>
              <div className="slot-content">
                {isStart && booking ? (
                  <div className="booking-info">
                    <strong>{booking.title}</strong>
                    <span className="booking-time">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                ) : booking ? (
                  <div className="booking-continuation">↑</div>
                ) : (
                  <span className="available-label">Available</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {dayBookings.length > 0 && (
        <div className="bookings-summary">
          <h3>Bookings for {formatDate(selectedDate)}</h3>
          <ul>
            {dayBookings.map((booking) => (
              <li key={booking.id}>
                <strong>{booking.title}</strong> - {booking.startTime} to {booking.endTime}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
