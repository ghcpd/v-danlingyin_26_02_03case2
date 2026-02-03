export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface Booking {
  id: string;
  roomId: string;
  title: string;
  date: string; // yyyy-mm-dd
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
}
