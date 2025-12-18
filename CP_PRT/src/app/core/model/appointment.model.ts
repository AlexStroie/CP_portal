export interface Appointment {
  id?: number;

  patientId: number;
  cabinetId: number;
  userId: number;

  date: string;       // ISO „YYYY-MM-DD”
  startTime: string;  // „HH:mm”
  endTime: string;    // „HH:mm”

  status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
}

export interface AppointmentRequest {
  appointmentID: number;
  patientId: number;
  cabinetId: number;
  userId: number;

  date: string;
  startTime: string;
  endTime: string;

  notes?: string;
}

export interface AppointmentExtended {
  id: number;

  patientId: number;
  patientName: string;

  cabinetId: number;
  cabinetName: string;

  userId: number;
  userFullName: string;

  date: string;
  startTime: string;
  endTime: string;

  status: string;
  notes?: string;

  color?: string;
}

// core/model/appointment.model.ts
export interface AppointmentCalendar {
  id?: number;
  patientName: string;
  patientId?: number;
  cabinetName?: string;
  start: string; // ISO string: '2025-12-11T10:30:00'
  end: string;   // ISO string
  color?: string;
}
