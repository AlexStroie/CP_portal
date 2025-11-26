import { TestBed } from '@angular/core/testing';
import { AuthenticateComponent } from './authenticate.component';

describe('AuthenticateComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticateComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AuthenticateComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
