import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-cabinet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h1>{{ isNew ? 'Adaugă Cabinet' : 'Editează Cabinet' }}</h1>

    <div class="form-container">
      <form [formGroup]="form" (ngSubmit)="save()">

        <div class="form-group">
          <label>Nume Cabinet</label>
          <input formControlName="name">
        </div>

        <div class="form-group">
          <label>Adresă</label>
          <input formControlName="address">
        </div>

        <div class="form-group">
          <label>Telefon</label>
          <input formControlName="phone">
        </div>

        <button type="submit" [disabled]="form.invalid">Salvează</button>
        <button class="back" routerLink="/admin/cabinets">Înapoi</button>

      </form>
    </div>
  `,
  styles: [`
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: 600;
      color: #1e293b;
    }

    .form-container {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0px 3px 10px rgba(0,0,0,0.08);
      max-width: 500px;
    }

    .form-group {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      margin-bottom: 5px;
    }

    .form-group input {
      padding: 10px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
    }

    button {
      padding: 10px 20px;
      background: #3b82f6;
      border: none;
      border-radius: 6px;
      color: white;
      margin-right: 10px;
      cursor: pointer;
      font-weight: 600;
    }

    button.back {
      background: #94a3b8;
    }
  `]
})
export class EditCabinetComponent implements OnInit {

  form!: FormGroup;
  isNew = false;
  id!: number;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isNew = this.id === 0;

    this.form = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      phone: ['']
    });

    if (!this.isNew) {
      // todo aici incarci cabinetul real
      // this.cabinetsService.getById(this.id).subscribe(data => this.form.patchValue(data));

      // deocamdata mock:
      this.form.patchValue({ name: 'Cabinet Test', address: 'Strada X', phone: '0712345678' });
    }
  }

  save() {
    if (this.form.invalid) return;

    if (this.isNew) {
      // create
      console.log("Create cabinet:", this.form.value);
    } else {
      // update
      console.log("Update cabinet:", this.form.value);
    }

    this.router.navigate(['/admin/cabinets']);
  }
}
