import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    }
  ]
})
export class TimePickerComponent {

  value: string = '';
  show: boolean = false;

  times: string[] = [];
  filtered: string[] = [];

  onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit() {
    const minutes = ['00', '15', '30', '45'];

    for (let h = 0; h < 24; h++) {
      const hh = h.toString().padStart(2, '0');
      minutes.forEach(m => this.times.push(`${hh}:${m}`));
    }

    this.filtered = [...this.times];
  }

  toggle() {
    this.show = !this.show;
    this.filtered = [...this.times];
  }

  filter(event: Event) {
    const q = (event.target as HTMLInputElement).value;
    this.filtered = this.times.filter(t => t.includes(q));
  }

  select(time: string) {
    this.value = time;
    this.onChange(time);
    this.show = false;
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
