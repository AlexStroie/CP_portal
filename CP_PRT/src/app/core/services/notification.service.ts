import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  success(message: string) {
    this.open(message, 'success-snackbar');
  }

  error(message: string) {
    this.open(message, 'error-snackbar');
  }

  info(message: string) {
    this.open(message, 'info-snackbar');
  }

  private open(message: string, panelClass: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
}
