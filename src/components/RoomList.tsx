import React from 'react';
import { Room, Booking } from '../types';

interface RoomListProps {
  rooms: Room[];
  bookings: Booking[];
  onSelectRoom: (roomId: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ rooms, bookings, onSelectRoom }) => {
  const getBookingCountForRoom = (roomId: string): number => {
    return bookings.filter((booking) => booking.roomId === roomId).length;
  };

  return (
    <div className="room-list">
      <h2>Meeting Rooms</h2>
      <p className="subtitle">Select a room to view its booking calendar</p>
      <div className="room-grid">
        {rooms.map((room) => {
          const bookingCount = getBookingCountForRoom(room.id);
          return (
            <div
              key={room.id}
              className="room-card"
              onClick={() => onSelectRoom(room.id)}
            >
              <h3>{room.name}</h3>
              <div className="room-details">
                <span className="capacity">👥 Capacity: {room.capacity}</span>
                <span className="booking-count">
                  📅 {bookingCount} booking{bookingCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
