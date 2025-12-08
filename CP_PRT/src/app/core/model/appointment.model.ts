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
}
