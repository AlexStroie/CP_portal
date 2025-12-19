import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, computed,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppointmentCalendar} from '../../../../core/model/appointment.model';
import {PatientsService} from '../../../../shared/service/patient.service';
import {Patient} from '../../../../core/model/patient.model';
import {CreateAppointmentEvent, EditAppointmentEvent} from '../events/appointment-event';
import {DateUtils} from '../utils/date-utils';


type CalendarView = 'day' | 'week';

@Component({
  selector: 'cp-appointments-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.css']
})
export class AppointmentCalendarComponent implements OnInit, OnChanges,AfterViewInit {

  @Input() view: CalendarView = 'week';
  @Input() currentDate: Date = new Date();
  @Input() appointments: AppointmentCalendar[] = [];

  @Output() createAppointment =new EventEmitter<CreateAppointmentEvent>();
  @Output() editAppointment = new EventEmitter<EditAppointmentEvent>();

  patients = signal<Patient[]>([]);

  startHour = 8;
  endHour = 20;
  slotMinutes = 15;
  appointmentsByDay = new Map<string, AppointmentCalendar[]>();


  constructor(private patientsService: PatientsService,
              private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appointments'] && this.appointments.length > 0) {
      this.buildCalendar();
    }
  }

  ngOnInit(): void {
    this.patientsService.getAll().subscribe(data => this.patients.set(data));
  }

  private buildCalendar() {
    this.appointmentsByDay.clear();

    for (const appt of this.appointments) {
      // extragem ziua din start (ISO)
      const dateKey = appt.start.split('T')[0]; // yyyy-MM-dd

      if (!this.appointmentsByDay.has(dateKey)) {
        this.appointmentsByDay.set(dateKey, []);
      }

      this.appointmentsByDay.get(dateKey)!.push(appt);
    }

  }

  get hours(): string[] {
    const arr = [];
    for (let h = this.startHour; h <= this.endHour; h++) {
      arr.push((h < 10 ? '0' + h : h) + ':00');
    }
    return arr;
  }

  get slotsPerHourArray(): null[] {
    return Array.from({length: 60 / this.slotMinutes});
  }

  // Week days
  currentDateHeader = signal(new Date());

  weekDays = computed(() => {
    const start = this.getStartOfWeek(this.currentDateHeader());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  });

  get dayColumns() {
    return [{key: 'default', label: 'Programări'}];
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay(); // Sunday = 0
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // getAppointmentsForDay(day: Date): AppointmentCalendar[] {
  //   return this.appointments.filter(a => {
  //     return new Date(a.start).toDateString() === day.toDateString();
  //   });
  // }

  getAppointmentsForDay(day: Date): AppointmentCalendar[] {
    const key = day.toISOString().split('T')[0];
    return this.appointmentsByDay.get(key) || [];
  }

  getAppointmentsForDayColumn(column: string): AppointmentCalendar[] {
    return this.appointments;
  }

  getAppointmentStyle(appt: AppointmentCalendar) {
    const start = new Date(appt.start);
    const end = new Date(appt.end);

    const minutesFromStart =
      (start.getHours() - this.startHour) * 60 + start.getMinutes();

    const duration = (end.getTime() - start.getTime()) / 60000;

    const GRID_TOP_OFFSET = 0;      // ✔️ bun la tine
    const PX_PER_MINUTE = 16 / 15; // 🔥 FIXUL REAL

    return {
      top: `${GRID_TOP_OFFSET + minutesFromStart * PX_PER_MINUTE}px`,
      height: `${Math.max(duration * PX_PER_MINUTE, 20)}px`
    };
  }

  goToPrevious() {
    const delta = this.view === 'week' ? -7 : -1;
    const d = new Date(this.currentDate);
    d.setDate(d.getDate() + delta);
    this.currentDate = d;
  }

  goToNext() {
    const delta = this.view === 'week' ? 7 : 1;
    const d = new Date(this.currentDate);
    d.setDate(d.getDate() + delta);
    this.currentDate = d;
  }

  goToToday() {
    this.currentDate = new Date();
  }

  switchView(view: CalendarView) {
    this.view = view;
  }

  formatDay(d: Date): string {
    return d.toLocaleDateString('ro-RO', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  }

  onSlotClick(day: Date, hour: number, minute: number) {
    this.createAppointment.emit({
      date: day,
      startHour: hour,
      startMinute: minute,
      patients: this.patients()
    });
  }

  onAppointmentClick(appt: AppointmentCalendar, event: MouseEvent) {
    event.stopPropagation();

    const start = new Date(appt.start);

    this.editAppointment.emit({
      date: start,
      startHour: start.getHours(),
      startMinute: start.getMinutes(),
      patients: this.patients(),
      appointment: appt
    });
  }

  protected readonly DateUtils = DateUtils;
}
