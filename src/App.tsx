import React, { FormEvent, useMemo, useState } from 'react';
import { Booking, Room } from './types';

const ROOMS: Room[] = [
  { id: 'atlas', name: 'Atlas', capacity: 6 },
  { id: 'nova', name: 'Nova', capacity: 10 },
  { id: 'ember', name: 'Ember', capacity: 4 },
  { id: 'zenith', name: 'Zenith', capacity: 12 },
];

const INITIAL_BOOKINGS: Booking[] = [
  { id: 'b1', roomId: 'atlas', title: 'Sprint Planning', date: today(), startTime: '09:00', endTime: '10:00' },
  { id: 'b2', roomId: 'nova', title: 'Design Review', date: today(), startTime: '11:00', endTime: '12:30' },
  { id: 'b3', roomId: 'ember', title: '1:1 Check-in', date: today(), startTime: '15:00', endTime: '15:30' },
  { id: 'b4', roomId: 'zenith', title: 'Leadership Sync', date: shiftDay(1), startTime: '10:30', endTime: '11:30' },
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function shiftDay(delta: number): string {
  const d = new Date();
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function overlaps(a: Booking, b: Booking): boolean {
  const sameRoomAndDate = a.roomId === b.roomId && a.date === b.date;
  if (!sameRoomAndDate) return false;
  const startA = toMinutes(a.startTime);
  const endA = toMinutes(a.endTime);
  const startB = toMinutes(b.startTime);
  const endB = toMinutes(b.endTime);
  return startA < endB && endA > startB;
}

function makeId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const DAY_START = 8 * 60;
const DAY_END = 18 * 60;
const DAY_HEIGHT = 280;

function App() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(ROOMS[0]?.id ?? '');
  const [selectedDate, setSelectedDate] = useState<string>(today());
  const [form, setForm] = useState<{ title: string; roomId: string; date: string; startTime: string; endTime: string }>(
    {
      title: 'New Booking',
      roomId: ROOMS[0]?.id ?? '',
      date: today(),
      startTime: '10:00',
      endTime: '11:00',
    },
  );
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [overviewMode, setOverviewMode] = useState<'day' | 'room'>('day');

  const bookingsForSelection = useMemo(
    () => bookings.filter((b) => b.roomId === selectedRoomId && b.date === selectedDate),
    [bookings, selectedRoomId, selectedDate],
  );

  const groupedByDate = useMemo(() => {
    return bookings.reduce<Record<string, Booking[]>>((acc, b) => {
      acc[b.date] = acc[b.date] ? [...acc[b.date], b] : [b];
      return acc;
    }, {});
  }, [bookings]);

  const groupedByRoom = useMemo(() => {
    return ROOMS.reduce<Record<string, Booking[]>>((acc, room) => {
      acc[room.id] = bookings
        .filter((b) => b.roomId === room.id)
        .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
      return acc;
    }, {});
  }, [bookings]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const newBooking: Booking = {
      id: makeId(),
      roomId: form.roomId,
      title: form.title.trim() || 'Untitled Meeting',
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
    };

    if (toMinutes(newBooking.endTime) <= toMinutes(newBooking.startTime)) {
      setError('End time must be after start time.');
      return;
    }

    const conflicts = bookings.some((b) => overlaps(b, newBooking));
    if (conflicts) {
      setError('This room already has a booking in that time range.');
      return;
    }

    setBookings((prev) => [...prev, newBooking]);
    setSelectedRoomId(newBooking.roomId);
    setSelectedDate(newBooking.date);
    setForm((prev) => ({ ...prev, title: 'New Booking' }));
    setSuccess('Booking created and scheduled.');
  }

  function handleFormChange(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function renderBookingBlocks(list: Booking[]) {
    return list.map((b) => {
      const top = ((toMinutes(b.startTime) - DAY_START) / (DAY_END - DAY_START)) * DAY_HEIGHT;
      const bottom = ((DAY_END - toMinutes(b.endTime)) / (DAY_END - DAY_START)) * DAY_HEIGHT;
      const height = DAY_HEIGHT - top - bottom;
      return (
        <div
          key={b.id}
          className="booking-block"
          style={{ top, height }}
        >
          <div className="booking-title">{b.title}</div>
          <div className="booking-meta">
            {b.startTime} - {b.endTime}
          </div>
        </div>
      );
    });
  }

  return (
    <div className="app-shell">
      <div className="header">
        <h1>Team Meeting Room Booking</h1>
        <div className="badge">Desktop · In-memory</div>
      </div>

      <div className="columns">
        <div className="panel">
          <div className="flex-between">
            <h2>Meeting rooms</h2>
            <span className="tag">Select to view calendar</span>
          </div>
          <div className="room-list">
            {ROOMS.map((room) => {
              const count = bookings.filter((b) => b.roomId === room.id && b.date === selectedDate).length;
              return (
                <div
                  key={room.id}
                  className={`room-card ${selectedRoomId === room.id ? 'active' : ''}`}
                  onClick={() => setSelectedRoomId(room.id)}
                >
                  <div className="flex-between">
                    <strong>{room.name}</strong>
                    <span className="badge" style={{ background: 'rgba(125, 211, 252, 0.2)', color: '#7dd3fc' }}>
                      {count} booked
                    </span>
                  </div>
                  <div className="room-meta">
                    Capacity {room.capacity}
                    <span className="tag">{room.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid">
          <div className="panel">
            <div className="flex-between">
              <h2>Booking calendar</h2>
              <div className="flex-between">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button className="button secondary" onClick={() => setSelectedDate(today())}>
                  Today
                </button>
              </div>
            </div>
            <div className="slot-grid">
              <div className="hour-labels">
                {Array.from({ length: 10 }, (_, i) => 8 + i).map((h) => (
                  <div key={h}>{h}:00</div>
                ))}
              </div>
              <div className="slots">
                {renderBookingBlocks(bookingsForSelection)}
              </div>
            </div>
            <div className="muted">Available slots are any visible gaps. Bookings are prevented from overlapping.</div>
          </div>

          <div className="panel">
            <div className="flex-between">
              <h2>Create booking</h2>
              <small>All fields required</small>
            </div>
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Title
                <input
                  value={form.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="Team sync"
                  required
                />
              </label>
              <label>
                Room
                <select value={form.roomId} onChange={(e) => handleFormChange('roomId', e.target.value)}>
                  {ROOMS.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} · {room.capacity} ppl
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  required
                />
              </label>
              <label>
                Start time
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => handleFormChange('startTime', e.target.value)}
                  min="08:00"
                  max="18:00"
                  required
                />
              </label>
              <label>
                End time
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => handleFormChange('endTime', e.target.value)}
                  min="08:15"
                  max="18:00"
                  required
                />
              </label>
              <div>
                <button className="button" type="submit">
                  Add booking
                </button>
              </div>
            </form>
            {error && <div className="error" role="alert">{error}</div>}
            {success && <div className="success">{success}</div>}
          </div>

          <div className="panel">
            <div className="flex-between">
              <h2>Booking overview</h2>
              <div className="flex-between" style={{ gap: 8 }}>
                <button
                  type="button"
                  className={`button secondary ${overviewMode === 'day' ? 'active' : ''}`}
                  onClick={() => setOverviewMode('day')}
                >
                  By day
                </button>
                <button
                  type="button"
                  className={`button secondary ${overviewMode === 'room' ? 'active' : ''}`}
                  onClick={() => setOverviewMode('room')}
                >
                  By room
                </button>
              </div>
            </div>

            {overviewMode === 'day' ? (
              <div className="overview">
                {Object.entries(groupedByDate)
                  .sort(([a], [b]) => (a < b ? -1 : 1))
                  .map(([date, list]) => (
                    <div className="overview-card" key={date}>
                      <h3>{date}</h3>
                      {list
                        .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
                        .map((b) => (
                          <div className="room-meta" key={b.id}>
                            <strong>{ROOMS.find((r) => r.id === b.roomId)?.name ?? b.roomId}</strong> · {b.title}{' '}
                            <span className="tag">{b.startTime} - {b.endTime}</span>
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="overview">
                {ROOMS.map((room) => (
                  <div className="overview-card" key={room.id}>
                    <h3>{room.name}</h3>
                    <small className="muted">Capacity {room.capacity}</small>
                    {groupedByRoom[room.id]?.length ? (
                      groupedByRoom[room.id].map((b) => (
                        <div className="room-meta" key={b.id}>
                          {b.date} · {b.title}
                          <span className="tag">{b.startTime} - {b.endTime}</span>
                        </div>
                      ))
                    ) : (
                      <div className="muted">No bookings</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
