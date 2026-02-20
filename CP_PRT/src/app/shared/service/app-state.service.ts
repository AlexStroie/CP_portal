import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  // state intern
  private _isCabinetSuspended = signal(false);

  // expus readonly
  readonly isCabinetSuspended = this._isCabinetSuspended.asReadonly();

  // helper dacă vrei logică inversă
  readonly isCabinetActive = computed(() => !this._isCabinetSuspended());

  // metode control
  setCabinetSuspended(value: boolean) {
    this._isCabinetSuspended.set(value);
  }

  reset() {
    this._isCabinetSuspended.set(false);
  }
}
