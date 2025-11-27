import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cabinete',
  imports: [],
  templateUrl: './cabinets.component.html',
  styleUrl: './cabinets.component.css',
})
export class CabinetsComponent {

  public constructor(protected router: Router) {
  }

  protected navigateToURL(url: string): void {
    this.router.navigate([url])
      .then(success => {
        if (!success) {
          console.warn('Navigarea a eșuat către', url);
        }
      })
      .catch(err => {
        console.error('Eroare la navigare:', err);
      });
  }
}
