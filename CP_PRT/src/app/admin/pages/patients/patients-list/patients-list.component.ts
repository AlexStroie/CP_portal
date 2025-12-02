import {Component, computed, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Patient, PatientFilter} from '../../../../core/model/patient.model';
import {PatientsService} from '../../../../shared/service/patient.service';
import {TokenStorageService} from '../../../../core/security/token-storage.service';
import {CabinetsService} from '../../../../shared/service/cabinets.service';
import {Cabinet} from '../../../../core/model/cabinet.model';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css',
})
export class PatientsListComponent implements OnInit {

  isSuperAdmin: boolean = false;

  cabinets = signal<Cabinet[]>([]);
  patients = signal<Patient[]>([]);
  patientToDelete = signal<Patient | null>(null);

  // Form controls pentru filtre
  name = new FormControl('');
  cnp = new FormControl('');
  cabinetId = new FormControl(null);

  cabinetMap = new Map<string, string>();

  private filterState = signal<PatientFilter>({});

  sortField = signal<string | null>(null);
  sortDir = signal<string | null>('asc');

  constructor(
    private patientService: PatientsService,
    private cabinetService: CabinetsService,
    private tokenStorage: TokenStorageService
  ) {
  }

  ngOnInit(): void {
    this.isSuperAdmin = this.tokenStorage.isSuperAdmin();

    this.cabinetService.getAll().subscribe(cabs => {
      this.cabinets.set(cabs);

      // construim map-ul
      cabs.forEach(c => this.cabinetMap.set(c.id, c.name));
    });

    // 🔥 legăm filtrarea live pe valueChanges
    this.name.valueChanges.pipe(debounceTime(250)).subscribe(() => this._updateFilters());
    this.cnp.valueChanges.pipe(debounceTime(250)).subscribe(() => this._updateFilters());
    this.cabinetId.valueChanges.subscribe(() => this._updateFilters());

    this.refresh();
  }

  private _updateFilters() {
    this.filterState.set({
      name: this.name.value ?? '',
      cnp: this.cnp.value ?? '',
      cabinetId: this.cabinetId.value,
    });
  }

  // Lista filtrată finală (recalculată automat)
  filteredPatients = computed(() => {
    const list = this.patients();
    const f = this.filterState();

    // 1. filtrare
    let filtered = list.filter(p => {
      if (f.name) {
        const fullName = (p.firstName + ' ' + p.lastName).toLowerCase();
        if (!fullName.includes(f.name.toLowerCase())) return false;
      }
      if (f.cnp && !p.cnp.includes(f.cnp)) return false;
      if (f.cabinetId && p.cabinetId !== f.cabinetId) return false;
      return true;
    });

    // 2. sortare
    return this.sortList(filtered);
  });

  private sortList(list: Patient[]) {
    const field = this.sortField();
    const dir = this.sortDir();
    if (!field) return list;

    return [...list].sort((a, b) => {

      let valA: string | number = '';
      let valB: string | number = '';

      switch (field) {
        case 'name':
          valA = (a.firstName + ' ' + a.lastName).toLowerCase();
          valB = (b.firstName + ' ' + b.lastName).toLowerCase();
          break;

        case 'cnp':
          valA = a.cnp;
          valB = b.cnp;
          break;

        case 'cabinet':
          valA = this.cabinetMap.get(a.cabinetId) ?? '';
          valB = this.cabinetMap.get(b.cabinetId) ?? '';
          break;
      }

      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }


  refresh() {
    this.patientService.getAll().subscribe(data => this.patients.set(data));
  }

  askDelete(patient: Patient) {
    this.patientToDelete.set(patient);
  }

  confirmDelete() {
    const patient = this.patientToDelete();
    if (!patient) return;

    this.patientService.delete(patient.id).subscribe(() => {
      this.patientToDelete.set(null);
      this.refresh();
    });
  }

  cancelDelete() {
    this.patientToDelete.set(null);
  }

  isDeleteDisabled(patient: Patient): boolean {
    return false;
  }

}
