import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm-dialog">
      <div class="confirm-header">
        <span class="confirm-icon">⚠️</span>
        <h2>Confirmare</h2>
      </div>

      <p class="confirm-message">
        Ești sigur că vrei să anulezi această programare?
      </p>

      <div class="confirm-actions">
        <button class="btn-secondary" (click)="close(false)">
          Nu
        </button>
        <button class="btn-danger" (click)="close(true)">
          Da, anulează
        </button>
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
  `]
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
