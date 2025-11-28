import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

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
        console.error(err);
      });
  }
}
