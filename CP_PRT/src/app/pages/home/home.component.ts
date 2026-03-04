import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslatePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  openFaq: number | null = null;

  faq = [
    { q: 'HOME.FAQ.Q1', a: 'HOME.FAQ.A1' },
    { q: 'HOME.FAQ.Q2', a: 'HOME.FAQ.A2' },
    { q: 'HOME.FAQ.Q3', a: 'HOME.FAQ.A3' }
  ];

  constructor(private router: Router) {}

  toggleFaq(index: number) {
    this.openFaq = this.openFaq === index ? null : index;
  }

  navigateToURL(url: string): void {
    this.router.navigate([url])
      .catch(err => console.error(err));
  }
}
