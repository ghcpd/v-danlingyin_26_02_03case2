import React, { useState } from 'react';
import { Room, BookingFormData } from '../types';
import { Booking } from '../types';
import { hasBookingConflict, isValidTimeRange, generateTimeSlots } from '../utils/bookingUtils';

interface BookingFormProps {
  rooms: Room[];
  bookings: Booking[];
  selectedRoomId?: string;
  onSubmit: (booking: BookingFormData) => void;
  onCancel: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  rooms,
  bookings,
  selectedRoomId,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    roomId: selectedRoomId || rooms[0]?.id || '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const timeSlots = generateTimeSlots(8, 18, 30);

  const handleChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user makes changes
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.roomId) {
      newErrors.roomId = 'Please select a room';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!isValidTimeRange(formData.startTime, formData.endTime)) {
      newErrors.time = 'End time must be after start time';
    }

    if (hasBookingConflict(formData, bookings)) {
      newErrors.conflict = 'This time slot conflicts with an existing booking';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const selectedRoom = rooms.find((r) => r.id === formData.roomId);

  return (
    <div className="booking-form">
      <div className="form-header">
        <h2>Create New Booking</h2>
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Meeting Title *</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Team Standup"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="room">Meeting Room *</label>
          <select
            id="room"
            value={formData.roomId}
            onChange={(e) => handleChange('roomId', e.target.value)}
            className={errors.roomId ? 'error' : ''}
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} (Capacity: {room.capacity})
              </option>
            ))}
          </select>
          {errors.roomId && <span className="error-message">{errors.roomId}</span>}
          {selectedRoom && (
            <p className="help-text">Selected room capacity: {selectedRoom.capacity} people</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">Start Time *</label>
            <select
              id="startTime"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              className={errors.time ? 'error' : ''}
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time *</label>
            <select
              id="endTime"
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              className={errors.time ? 'error' : ''}
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
        {errors.time && <span className="error-message">{errors.time}</span>}

        {errors.conflict && (
          <div className="conflict-warning">
            <strong>⚠️ Booking Conflict</strong>
            <p>{errors.conflict}</p>
            <p>Please choose a different time slot or room.</p>
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create Booking
          </button>
        </div>
      </form>
    </div>
  );
};
