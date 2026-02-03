import React, { useMemo } from 'react';
import type { Room, Booking } from '../types';
import { generateTimeSlots } from '../data/mockData';
import { getAvailableSlots, formatTimeDisplay } from '../utils/bookingUtils';

interface TimeSlotViewProps {
  room: Room;
  date: string;
  bookings: Booking[];
  onSlotClick: (startTime: string) => void;
  onDateChange: (date: string) => void;
}

export const TimeSlotView: React.FC<TimeSlotViewProps> = ({
  room,
  date,
  bookings,
  onSlotClick,
  onDateChange,
}) => {
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const slotsWithAvailability = useMemo(() => {
    return getAvailableSlots(room.id, date, bookings, timeSlots);
  }, [room.id, date, bookings, timeSlots]);

  // Group consecutive booked slots by booking
  const renderSlots = useMemo(() => {
    const result: Array<{
      slot: string;
      isAvailable: boolean;
      booking?: Booking;
      isStart?: boolean;
      spanCount?: number;
    }> = [];

    let i = 0;
    while (i < slotsWithAvailability.length) {
      const current = slotsWithAvailability[i];

      if (current.booking) {
        // Find how many consecutive slots this booking covers
        let spanCount = 1;
        const bookingId = current.booking.id;
        while (
          i + spanCount < slotsWithAvailability.length &&
          slotsWithAvailability[i + spanCount].booking?.id === bookingId
        ) {
          spanCount++;
        }

        result.push({
          ...current,
          isStart: true,
          spanCount,
        });

        // Skip the rest of the slots for this booking
        i += spanCount;
      } else {
        result.push(current);
        i++;
      }
    }

    return result;
  }, [slotsWithAvailability]);

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{room.name}</h2>
          <p style={styles.subtitle}>Capacity: {room.capacity} people</p>
        </div>
        <div style={styles.dateSelector}>
          <label style={styles.dateLabel}>Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            style={styles.dateInput}
          />
        </div>
      </div>

      <p style={styles.dateDisplay}>{formatDate(date)}</p>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendBox, backgroundColor: '#dcfce7' }} />
          <span>Available</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendBox, backgroundColor: '#fee2e2' }} />
          <span>Booked</span>
        </div>
      </div>

      <div style={styles.slotsContainer}>
        {renderSlots.map((slot, index) => (
          <div
            key={`${slot.slot}-${index}`}
            style={{
              ...styles.slot,
              ...(slot.isAvailable ? styles.availableSlot : styles.bookedSlot),
              ...(slot.spanCount ? { gridRow: `span ${slot.spanCount}` } : {}),
            }}
            onClick={() => slot.isAvailable && onSlotClick(slot.slot)}
          >
            <div style={styles.slotTime}>{formatTimeDisplay(slot.slot)}</div>
            {slot.booking && (
              <div style={styles.bookingInfo}>
                <span style={styles.bookingTitle}>{slot.booking.title}</span>
                <span style={styles.bookingTime}>
                  {formatTimeDisplay(slot.booking.startTime)} -{' '}
                  {formatTimeDisplay(slot.booking.endTime)}
                </span>
              </div>
            )}
            {slot.isAvailable && (
              <span style={styles.availableText}>Click to book</span>
            )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  dateSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dateLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  dateInput: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },
  dateDisplay: {
    fontSize: '16px',
    color: '#4b5563',
    marginBottom: '20px',
  },
  legend: {
    display: 'flex',
    gap: '24px',
    marginBottom: '20px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6b7280',
  },
  legendBox: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
  },
  slotsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '4px',
    maxWidth: '600px',
  },
  slot: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.1s',
  },
  availableSlot: {
    backgroundColor: '#dcfce7',
    border: '1px solid #86efac',
  },
  bookedSlot: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    cursor: 'not-allowed',
  },
  slotTime: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    minWidth: '90px',
  },
  bookingInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '16px',
  },
  bookingTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#991b1b',
  },
  bookingTime: {
    fontSize: '12px',
    color: '#b91c1c',
  },
  availableText: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: '#166534',
  },
};

export default TimeSlotView;
