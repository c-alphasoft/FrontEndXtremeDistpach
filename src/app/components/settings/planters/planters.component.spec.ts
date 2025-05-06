import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantersComponent } from './planters.component';

describe('PlantersComponent', () => {
  let component: PlantersComponent;
  let fixture: ComponentFixture<PlantersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
