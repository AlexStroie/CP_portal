import {Component, OnInit, signal, computed, HostListener} from '@angular/core';
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
class CabinetsListComponent implements OnInit {

  protected readonly Role = Role;

  openDropdownId = signal<number | null>(null);
  cabinets = signal<Cabinet[]>([]);
  selectedCabinet = signal<any | null>(null);

  isSuperAdmin = false;

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
    this.cabinetService.getAll()
      .subscribe(data => this.cabinets.set(data));
  }

  isActive(cabinet: Cabinet): boolean {
    return cabinet.subscriptionStatus === 'ACTIVE'
      || cabinet.subscriptionStatus === 'TRIAL';
  }

  getDaysRemaining(cabinet: Cabinet): number | null {
    if (!cabinet) return null;

    const end = new Date(this.getExpiryDate(cabinet)).getTime();
    const now = new Date().getTime();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  }

  getExpiryDate(cabinet: any): string {

    switch (cabinet.subscriptionStatus) {

      case 'TRIAL':
        return cabinet.trialEndDate;

      case 'ACTIVE':
      case 'SUSPENDED':
        return cabinet.endDate;

      default:
        return new Date().toDateString();
    }
  }


  getPlanClass(plan: string): string {
    switch (plan) {
      case 'BASIC':
        return 'plan basic';
      case 'PRO':
        return 'plan pro';
      case 'PREMIUM':
        return 'plan premium';
      default:
        return 'plan';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'status active';
      case 'TRIAL':
        return 'status trial';
      case 'EXPIRED':
        return 'status expired';
      case 'SUSPENDED':
        return 'status suspended';
      default:
        return 'status';
    }
  }

  toggleDropdown(cabinetId: number) {
    this.openDropdownId.update(current =>
      current === cabinetId ? null : cabinetId
    );
  }

  switchContext(cabinetId: number, role: Role) {
    const request: SwitchRequest = {
      username: this.tokenStorage.getUser().username,
      cabinetId,
      role
    };

    this.authService.switchContext(request)
      .subscribe(() => this.router.navigate(['/admin']));
  }

  openDetails(cabinet: any) {
    this.selectedCabinet.set(cabinet);
    document.body.style.overflow = 'hidden';
  }

  closeDetails() {
    this.selectedCabinet.set(null);
    document.body.style.overflow = 'auto';
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeDetails();
  }
}

export default CabinetsListComponent
