import React, { useState, useMemo } from 'react';
import type { Room, Booking } from '../types';
import { formatTimeDisplay, getBookingsForDate } from '../utils/bookingUtils';

interface BookingOverviewProps {
  rooms: Room[];
  bookings: Booking[];
  onDeleteBooking: (bookingId: string) => void;
}

type ViewMode = 'by-date' | 'by-room';

export const BookingOverview: React.FC<BookingOverviewProps> = ({
  rooms,
  bookings,
  onDeleteBooking,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('by-date');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id ?? '');

  const filteredBookings = useMemo(() => {
    if (viewMode === 'by-date') {
      return getBookingsForDate(selectedDate, bookings);
    } else {
      return bookings.filter((b) => b.roomId === selectedRoomId);
    }
  }, [viewMode, selectedDate, selectedRoomId, bookings]);

  const getRoomName = (roomId: string): string => {
    return rooms.find((r) => r.id === roomId)?.name ?? 'Unknown Room';
  };

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Sort bookings by date and time
  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [filteredBookings]);

  // Group by room when viewing by date
  const bookingsByRoom = useMemo(() => {
    if (viewMode !== 'by-date') return {};
    return sortedBookings.reduce((acc, booking) => {
      if (!acc[booking.roomId]) {
        acc[booking.roomId] = [];
      }
      acc[booking.roomId].push(booking);
      return acc;
    }, {} as Record<string, Booking[]>);
  }, [sortedBookings, viewMode]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Booking Overview</h2>

      {/* View Mode Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(viewMode === 'by-date' ? styles.activeTab : {}),
          }}
          onClick={() => setViewMode('by-date')}
        >
          📅 By Date
        </button>
        <button
          style={{
            ...styles.tab,
            ...(viewMode === 'by-room' ? styles.activeTab : {}),
          }}
          onClick={() => setViewMode('by-room')}
        >
          🏢 By Room
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {viewMode === 'by-date' ? (
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={styles.filterInput}
            />
          </div>
        ) : (
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Select Room:</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              style={styles.filterSelect}
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Bookings Display */}
      {sortedBookings.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>📭</span>
          <p style={styles.emptyText}>No bookings found</p>
          <p style={styles.emptyHint}>
            {viewMode === 'by-date'
              ? `No meetings scheduled for ${formatDate(selectedDate)}`
              : `No meetings scheduled for ${getRoomName(selectedRoomId)}`}
          </p>
        </div>
      ) : viewMode === 'by-date' ? (
        // Group by room when viewing by date
        <div style={styles.bookingsContainer}>
          {Object.entries(bookingsByRoom).map(([roomId, roomBookings]) => (
            <div key={roomId} style={styles.roomSection}>
              <h3 style={styles.roomSectionTitle}>{getRoomName(roomId)}</h3>
              <div style={styles.bookingsList}>
                {roomBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    showDate={false}
                    onDelete={() => onDeleteBooking(booking.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List all bookings when viewing by room
        <div style={styles.bookingsList}>
          {sortedBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              showDate={true}
              onDelete={() => onDeleteBooking(booking.id)}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      <div style={styles.summary}>
        <p style={styles.summaryText}>
          Total bookings: <strong>{sortedBookings.length}</strong>
        </p>
      </div>
    </div>
  );
};

interface BookingCardProps {
  booking: Booking;
  showDate: boolean;
  onDelete: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  showDate,
  onDelete,
}) => {
  return (
    <div style={cardStyles.card}>
      <div style={cardStyles.content}>
        <h4 style={cardStyles.title}>{booking.title}</h4>
        <div style={cardStyles.details}>
          <span style={cardStyles.time}>
            🕐 {formatTimeDisplay(booking.startTime)} -{' '}
            {formatTimeDisplay(booking.endTime)}
          </span>
          {showDate && (
            <span style={cardStyles.date}>
              📅{' '}
              {new Date(booking.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>
      <button style={cardStyles.deleteButton} onClick={onDelete} title="Delete booking">
        🗑️
      </button>
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
    color: '#1f2937',
    marginBottom: '20px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 20px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    color: '#ffffff',
  },
  filters: {
    marginBottom: '24px',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  filterInput: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    minWidth: '200px',
  },
  bookingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  roomSection: {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '16px',
  },
  roomSectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
  },
  bookingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 20px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  emptyHint: {
    fontSize: '14px',
    color: '#6b7280',
  },
  summary: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
  },
  summaryText: {
    fontSize: '14px',
    color: '#6b7280',
  },
};

const cardStyles: { [key: string]: React.CSSProperties } = {
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px',
  },
  details: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: '#6b7280',
  },
  time: {},
  date: {},
  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    opacity: 0.6,
    transition: 'opacity 0.2s',
  },
};

export default BookingOverview;
