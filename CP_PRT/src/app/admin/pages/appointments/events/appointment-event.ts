import {Patient} from '../../../../core/model/patient.model';
import {AppointmentCalendar} from '../../../../core/model/appointment.model';

export interface CreateAppointmentEvent {
  date: Date;
  startHour: number;
  startMinute: number;
  patients: Patient[];
}

export interface EditAppointmentEvent extends CreateAppointmentEvent {
  appointment: AppointmentCalendar;
}
