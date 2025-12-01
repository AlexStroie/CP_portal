import {Component, Inject, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '../../../../shared/service/users.service';
import {UserRequest, UserResponse} from '../../../../core/model/user.model';
import {TokenStorageService} from '../../../../core/security/token-storage.service';
import {Cabinet} from '../../../../core/model/cabinet.model';
import {CabinetsService} from '../../../../shared/service/cabinets.service';
import {APP_CONFIG, IAppConfig} from '../../../../app.config';

@Component({
  standalone: true,
  selector: 'app-users-edit',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  isSuperAdmin: boolean = false;
  id = signal<number | null>(null);
  user = signal<UserResponse | null>(null);
  cabinets = signal<Cabinet[]>([]);
  currentCabinet = signal<any | null>(null);
  activationLink: string = "";
  cabinetId: string = "";

  form = new FormGroup({
    fullName: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('USER', Validators.required),
    enabled: new FormControl(false),
    password: new FormControl('')
  });

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private tokenService: TokenStorageService,
    private cabinetService: CabinetsService,
    private usersService: UsersService
  ) {
    this.isSuperAdmin = false;
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    this.isSuperAdmin = this.tokenService.isSuperAdmin();

    if (this.isSuperAdmin) {
      this.cabinetService.getAll().subscribe(data => this.cabinets.set(data));
    }

    if (idParam) {
      this.id.set(Number(idParam));
      this.loadUser(Number(idParam));
    }
  }

  loadUser(id: number) {
    this.usersService.getById(id).subscribe(user => {
      this.user.set(user);

      this.form.patchValue({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        enabled: user.enabled,
        password: ''
      });

      this.cabinetId =  user.cabinetId;

      const baseUrl = window.location.origin;
      this.activationLink = baseUrl + '/activate?token=' + user.activationLink;
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const req: UserRequest = {
      fullName: this.form.value.fullName!,
      username: this.form.value.username!,
      email: this.form.value.email!,
      role: this.form.value.role!,
      enabled: this.form.value.enabled!,
      cabinetId: this.cabinetId
    };

    if (this.id()) {
      this.usersService.update(this.id()!, req).subscribe(() => {
        this.router.navigate(['/admin/users']);
      });
    } else {
      this.usersService.create(req).subscribe(() => {
        this.router.navigate(['/admin/users']);
      });
    }
  }

  setCabinetId(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    if (newValue) {
     this.cabinetId = newValue;
    }
  }
}
