import React, { useState, useMemo } from 'react';
import type { Room, Booking, BookingFormData } from '../types';
import { generateTimeSlots } from '../data/mockData';
import { findConflictingBooking, isValidTimeRange, formatTimeDisplay } from '../utils/bookingUtils';

interface BookingFormProps {
  rooms: Room[];
  bookings: Booking[];
  onSubmit: (booking: BookingFormData) => void;
  onCancel: () => void;
  initialRoomId?: string;
  initialDate?: string;
  initialStartTime?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  rooms,
  bookings,
  onSubmit,
  onCancel,
  initialRoomId = '',
  initialDate = '',
  initialStartTime = '',
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    roomId: initialRoomId || (rooms[0]?.id ?? ''),
    title: '',
    date: initialDate || new Date().toISOString().split('T')[0],
    startTime: initialStartTime || '09:00',
    endTime: initialStartTime
      ? incrementTime(initialStartTime, 60)
      : '10:00',
  });

  const [error, setError] = useState<string>('');

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Generate end time options (must be after start time)
  const endTimeOptions = useMemo(() => {
    const startIndex = timeSlots.indexOf(formData.startTime);
    if (startIndex === -1) return timeSlots.slice(1);
    return timeSlots.slice(startIndex + 1).concat(['18:00']);
  }, [formData.startTime, timeSlots]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // If start time changed, adjust end time if needed
      if (name === 'startTime') {
        const startIndex = timeSlots.indexOf(value);
        const endIndex = timeSlots.indexOf(prev.endTime);
        if (endIndex <= startIndex) {
          updated.endTime = incrementTime(value, 60);
        }
      }

      return updated;
    });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate title
    if (!formData.title.trim()) {
      setError('Please enter a meeting title.');
      return;
    }

    // Validate time range
    if (!isValidTimeRange(formData.startTime, formData.endTime)) {
      setError('End time must be after start time.');
      return;
    }

    // Check for conflicts
    const conflict = findConflictingBooking(formData, bookings);
    if (conflict) {
      setError(
        `Time conflict: "${conflict.title}" is already booked from ${formatTimeDisplay(
          conflict.startTime
        )} to ${formatTimeDisplay(conflict.endTime)}.`
      );
      return;
    }

    onSubmit(formData);
  };

  const selectedRoom = rooms.find((r) => r.id === formData.roomId);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Book a Meeting Room</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Room Selection */}
        <div style={styles.field}>
          <label style={styles.label}>Room</label>
          <select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            style={styles.select}
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} (Capacity: {room.capacity})
              </option>
            ))}
          </select>
          {selectedRoom && (
            <p style={styles.hint}>
              Selected: {selectedRoom.name} — fits {selectedRoom.capacity} people
            </p>
          )}
        </div>

        {/* Meeting Title */}
        <div style={styles.field}>
          <label style={styles.label}>Meeting Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter meeting title"
            style={styles.input}
            maxLength={100}
          />
        </div>

        {/* Date */}
        <div style={styles.field}>
          <label style={styles.label}>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Time Selection */}
        <div style={styles.timeRow}>
          <div style={styles.timeField}>
            <label style={styles.label}>Start Time</label>
            <select
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              style={styles.select}
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {formatTimeDisplay(time)}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.timeField}>
            <label style={styles.label}>End Time</label>
            <select
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              style={styles.select}
            >
              {endTimeOptions.map((time) => (
                <option key={time} value={time}>
                  {formatTimeDisplay(time)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.error}>
            <span style={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={styles.buttons}>
          <button type="button" onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" style={styles.submitButton}>
            Create Booking
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper to increment time by minutes
function incrementTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${Math.min(newHours, 18).toString().padStart(2, '0')}:${newMins
    .toString()
    .padStart(2, '0')}`;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '500px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },
  select: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    backgroundColor: '#ffffff',
  },
  hint: {
    fontSize: '12px',
    color: '#6b7280',
  },
  timeRow: {
    display: 'flex',
    gap: '16px',
  },
  timeField: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  errorIcon: {
    fontSize: '16px',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  cancelButton: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  submitButton: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default BookingForm;
