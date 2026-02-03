import React from 'react';
import type { Room } from '../types';

interface RoomListProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  selectedRoomId?: string;
}

export const RoomList: React.FC<RoomListProps> = ({ rooms, onSelectRoom, selectedRoomId }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Meeting Rooms</h2>
      <div style={styles.roomGrid}>
        {rooms.map((room) => (
          <div
            key={room.id}
            style={{
              ...styles.roomCard,
              ...(selectedRoomId === room.id ? styles.selectedCard : {}),
            }}
            onClick={() => onSelectRoom(room)}
          >
            <h3 style={styles.roomName}>{room.name}</h3>
            <p style={styles.capacity}>
              <span style={styles.capacityIcon}>👥</span>
              Capacity: {room.capacity} people
            </p>
            <button
              style={styles.selectButton}
              onClick={(e) => {
                e.stopPropagation();
                onSelectRoom(room);
              }}
            >
              View Schedule
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1f2937',
  },
  roomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  roomCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '2px solid transparent',
  },
  selectedCard: {
    borderColor: '#3b82f6',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  roomName: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1f2937',
  },
  capacity: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
  },
  capacityIcon: {
    marginRight: '8px',
  },
  selectButton: {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default RoomList;
