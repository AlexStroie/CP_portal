import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Patient} from '../../../../core/model/patient.model';
import {PatientsService} from '../../../../shared/service/patient.service';
import {TokenStorageService} from '../../../../core/security/token-storage.service';
import {CabinetsService} from '../../../../shared/service/cabinets.service';
import {Cabinet} from '../../../../core/model/cabinet.model';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css',
})
export class PatientsListComponent implements OnInit {

  isSuperAdmin: boolean = false;

  cabinets = signal<Cabinet[]>([]);
  patients = signal<Patient[]>([]);
  patientToDelete = signal<Patient | null>(null);

  cabinetMap = new Map<string, string>();

  constructor(
    private patientService: PatientsService,
    private cabinetService: CabinetsService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.tokenStorage.isSuperAdmin();

    this.cabinetService.getAll().subscribe(cabs => {
      this.cabinets.set(cabs);

      // construim map-ul
      cabs.forEach(c => this.cabinetMap.set(c.id, c.name));
    });

    this.refresh();
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
