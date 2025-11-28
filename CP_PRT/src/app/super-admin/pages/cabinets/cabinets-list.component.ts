import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cabinets-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Cabinete</h1>

    <div class="top-actions">
      <button routerLink="/super-admin/cabinets/0">+ Adaugă Cabinet</button>
    </div>

    <table class="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Nume</th>
        <th>Proprietar</th>
        <th>Acțiuni</th>
      </tr>
      </thead>


      <tbody>
        @for (cab of cabinets; track cab.id) {
          <tr>
            <td>{{ cab.id }}</td>
            <td>{{ cab.name }}</td>
            <td>{{ cab.ownerName }}</td>
            <td>
              <button [routerLink]="['/super-admin/cabinets', cab.id]">Editează</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #1e293b;
    }

    .top-actions {
      margin-bottom: 20px;
    }

    .top-actions button {
      background: #3b82f6;
      color: white;
      padding: 10px 15px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }

    table.table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.08);
    }

    table th {
      text-align: left;
      background: #f1f5f9;
      padding: 12px;
      font-weight: 600;
      color: #1e293b;
      font-size: 14px;
    }

    table td {
      padding: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 14px;
    }

    table button {
      background: #0ea5e9;
      border: none;
      padding: 6px 12px;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }

    table button:hover {
      background: #0284c7;
    }
  `]
})
export class CabinetsListComponent implements OnInit {

  cabinets = [
    {id: 1, name: 'Cabinet Test 1', ownerName: 'Ion Popescu'},
    {id: 2, name: 'Cabinet Test 2', ownerName: 'Maria Ionescu'}
  ];

  ngOnInit(): void {
    // todo aici vei încărca din backend:
    // this.cabinetsService.getAll().subscribe(data => this.cabinets = data);
  }
}
