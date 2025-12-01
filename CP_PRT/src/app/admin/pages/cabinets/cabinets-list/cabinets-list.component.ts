import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TokenStorageService} from '../../../../core/security/token-storage.service';
import {Cabinet} from '../../../../core/model/cabinet.model';
import {CabinetsService} from '../../../../shared/service/cabinets.service';

@Component({
  selector: 'app-cabinets-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cabinets-list.component.html',
  styleUrl: './cabinets-list.component.css',
})
export class CabinetsListComponent implements OnInit {

  cabinets = signal<Cabinet[]>([]);
  cabinetToDelete = signal<Cabinet | null>(null);

  constructor(
    private cabinetService: CabinetsService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.cabinetService.getAll().subscribe(data => this.cabinets.set(data));
  }

  askDelete(cabinet: Cabinet) {
    this.cabinetToDelete.set(cabinet);
  }

  confirmDelete() {
    const cabinet = this.cabinetToDelete();
    if (!cabinet) return;

    this.cabinetService.delete(cabinet.id).subscribe(() => {
      this.cabinetToDelete.set(null);
      this.refresh();
    });
  }

  cancelDelete() {
    this.cabinetToDelete.set(null);
  }

  isDeleteDisabled(cabinet: Cabinet): boolean {
    return false;
  }

}
