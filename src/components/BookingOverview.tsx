import React, { useState, useMemo } from 'react';
import { Room, Booking } from '../types';

interface BookingOverviewProps {
  rooms: Room[];
  bookings: Booking[];
  onBack: () => void;
}

type GroupingMode = 'room' | 'date';

export const BookingOverview: React.FC<BookingOverviewProps> = ({
  rooms,
  bookings,
  onBack,
}) => {
  const [groupBy, setGroupBy] = useState<GroupingMode>('room');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const getRoomName = (roomId: string): string => {
    return rooms.find((r) => r.id === roomId)?.name || 'Unknown Room';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (selectedFilter === 'all') return sortedBookings;
    if (groupBy === 'room') {
      return sortedBookings.filter((b) => b.roomId === selectedFilter);
    } else {
      return sortedBookings.filter((b) => b.date === selectedFilter);
    }
  }, [sortedBookings, selectedFilter, groupBy]);

  const groupedBookings = useMemo(() => {
    const groups = new Map<string, Booking[]>();

    filteredBookings.forEach((booking) => {
      const key = groupBy === 'room' ? booking.roomId : booking.date;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(booking);
    });

    return groups;
  }, [filteredBookings, groupBy]);

  const filterOptions = useMemo(() => {
    if (groupBy === 'room') {
      return rooms.map((room) => ({ value: room.id, label: room.name }));
    } else {
      const uniqueDates = Array.from(new Set(bookings.map((b) => b.date))).sort();
      return uniqueDates.map((date) => ({ value: date, label: formatDate(date) }));
    }
  }, [groupBy, rooms, bookings]);

  return (
    <div className="booking-overview">
      <div className="overview-header">
        <button onClick={onBack} className="btn-secondary">← Back</button>
        <h2>Booking Overview</h2>
        <div className="overview-controls">
          <select
            value={groupBy}
            onChange={(e) => {
              setGroupBy(e.target.value as GroupingMode);
              setSelectedFilter('all');
            }}
            className="group-selector"
          >
            <option value="room">Group by Room</option>
            <option value="date">Group by Date</option>
          </select>

          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="filter-selector"
          >
            <option value="all">All {groupBy === 'room' ? 'Rooms' : 'Dates'}</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overview-stats">
        <div className="stat-card">
          <span className="stat-value">{filteredBookings.length}</span>
          <span className="stat-label">Total Bookings</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{groupedBookings.size}</span>
          <span className="stat-label">
            {groupBy === 'room' ? 'Rooms with Bookings' : 'Days with Bookings'}
          </span>
        </div>
      </div>

      {groupedBookings.size === 0 ? (
        <div className="no-bookings">
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="grouped-bookings">
          {Array.from(groupedBookings.entries()).map(([groupKey, groupBookings]) => {
            const groupTitle = groupBy === 'room' 
              ? getRoomName(groupKey)
              : formatDate(groupKey);

            return (
              <div key={groupKey} className="booking-group">
                <h3 className="group-title">
                  {groupTitle}
                  <span className="booking-count-badge">
                    {groupBookings.length} booking{groupBookings.length !== 1 ? 's' : ''}
                  </span>
                </h3>
                <div className="booking-list">
                  {groupBookings.map((booking) => (
                    <div key={booking.id} className="booking-item">
                      <div className="booking-item-header">
                        <strong>{booking.title}</strong>
                        <span className="booking-time">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                      <div className="booking-item-details">
                        {groupBy === 'room' ? (
                          <span>📅 {formatDate(booking.date)}</span>
                        ) : (
                          <span>🏢 {getRoomName(booking.roomId)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
