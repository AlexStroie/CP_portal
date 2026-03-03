export interface Appointment {
  id?: number;

  patientId: number;
  cabinetId: number;
  userId: number;

  date: string;       // ISO „YYYY-MM-DD”
  startTime: string;  // „HH:mm”
  endTime: string;    // „HH:mm”

  recurrenceType: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | null;
  recurrenceId: string;

  status: 'SCHEDULED' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface AppointmentRequest {
  appointmentId: number;
  patientId: number;
  cabinetId: number;
  userId: number;

  date: string;
  startTime: string;
  endTime: string;
  status: string;

  recurrent: boolean;
  recurrenceType: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | null;
  recurrenceUntil: string | null;

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
  phone?: string;

  color?: string;

  recurrenceType: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | null;
  recurrenceId: string;

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
  phone?: string;
  status: string;

  recurrenceType: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | null;
  recurrenceId: string;
}
