import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="confirm-dialog">

      <div class="confirm-header">
        <span class="confirm-icon">⚠️</span>
        <h2>{{ data.titleKey | translate }}</h2>
      </div>

      <p class="confirm-message">
        {{ data.messageKey | translate }}
      </p>

      <div class="confirm-actions">

        <button class="btn-secondary" (click)="close('cancel')">
          {{ 'common.no' | translate }}
        </button>

        @if (data.isSeries) {

          <button class="btn-warning" (click)="close('single')">
            {{ 'appointments.cancelSingle' | translate }}
          </button>

          <button class="btn-danger" (click)="close('series')">
            {{ 'appointments.cancelSeries' | translate }}
          </button>

        } @else {

          <button class="btn-danger" (click)="close('single')">
            {{ 'appointments.cancelButton' | translate }}
          </button>

        }

      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 20px 22px;
      min-width: 320px;
      box-sizing: border-box;
      overflow-x: hidden; /* 🔥 FIX */
    }

    .confirm-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .confirm-icon {
      font-size: 22px;
    }

    .confirm-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .confirm-message {
      margin: 0 0 20px;
      font-size: 14px;
      color: #444;
    }

    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    /* butoane */
    .btn-secondary {
      background: #f5f5f5;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
    }

    .btn-danger {
      background: #d32f2f;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 6px 14px;
      cursor: pointer;
    }

    .btn-danger:hover {
      background: #b71c1c;
    }

    .btn-warning {
      background: #f59e0b;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 14px;
      cursor: pointer;
    }

    .btn-warning:hover {
      background: #d97706;
    }
  `]
})
export class ConfirmDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titleKey: string;
      messageKey: string;
      isSeries?: boolean;
    }
  ) {}


  close(result: 'cancel' | 'single' | 'series') {
    this.dialogRef.close(result);
  }
}
