import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {TokenStorageService} from '../../../../core/security/token-storage.service';
import {Cabinet} from '../../../../core/model/cabinet.model';
import {CabinetsService} from '../../../../shared/service/cabinets.service';
import {Role} from '../../../../shared/types/role';
import {AuthenticationService} from '../../../../core/security/authentication.service';
import {SwitchRequest} from '../../../../core/model/user.model';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-cabinets-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './cabinets-list.component.html',
  styleUrl: './cabinets-list.component.css',
})
export class CabinetsListComponent implements OnInit {

  protected readonly Role = Role;
  // dropdown state
  openDropdownId = signal<number | null>(null);

  isSuperAdmin: boolean = false;

  cabinets = signal<Cabinet[]>([]);
  cabinetToDelete = signal<Cabinet | null>(null);

  constructor(
    private authService: AuthenticationService,
    private tokenStorage: TokenStorageService,
    private cabinetService: CabinetsService,
    public router: Router
  ) {
  }

  ngOnInit(): void {
    this.isSuperAdmin = this.tokenStorage.isSuperAdmin();
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

  toggleDropdown(cabinetId: number) {
    this.openDropdownId.update(current =>
      current === cabinetId ? null : cabinetId
    );
  }

  switchContext(cabinetId: number, role: Role) {

    this.openDropdownId.set(null); // închide dropdown

    const request: SwitchRequest = {
      username: this.tokenStorage.getUser().username,
      cabinetId: cabinetId,
      role: role
    };

    this.authService.switchContext(request)
      .subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: err => {
          console.error('Switch context failed', err);
        }
      });
  }
}
