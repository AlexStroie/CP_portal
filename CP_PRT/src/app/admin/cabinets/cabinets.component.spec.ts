import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetsComponent } from './cabinets.component';

describe('Cabinete', () => {
  let component: CabinetsComponent;
  let fixture: ComponentFixture<CabinetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinetsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
