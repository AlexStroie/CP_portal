import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Cabinet} from '../../../../../core/model/cabinet.model';
import {CabinetsService} from '../../../../../shared/service/cabinets.service';

@Component({
  standalone: true,
  selector: 'app-cabinet-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './cabinet-form.component.html',
  styleUrls: ['./cabinet-form.component.css']
})
export class CabinetFormComponent implements OnInit {

  id = signal<number | null>(null);
  cabinet = signal<Cabinet | null>(null);

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl('', Validators.email),
    active: new FormControl(true)
  });

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private cabinetsService: CabinetsService
  ) {
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const parsed = Number(idParam);
      this.id.set(parsed);

      this.loadCabinet(parsed);
    }
  }

  loadCabinet(id: number) {
    this.cabinetsService.getById(this.id()!).subscribe(c => {
      this.cabinet.set(c);

      this.form.patchValue({
        name: c.name,
        address: c.address,
        phone: c.phone,
        email: c.email,
        active: c.active
      });
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value as Cabinet;

    if (this.id() !== null && !isNaN(this.id()!)) {
      this.cabinetsService.update(this.id() as number, data).subscribe(() => {
        this.router.navigate(['/admin/cabinets']);
      });

    } else {
      this.cabinetsService.create(data).subscribe(() => {
        this.router.navigate(['/admin/cabinets']);
      });
    }
  }

}
