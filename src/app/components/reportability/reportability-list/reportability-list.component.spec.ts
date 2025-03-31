import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportabilityListComponent } from './reportability-list.component';

describe('ReportabilityListComponent', () => {
  let component: ReportabilityListComponent;
  let fixture: ComponentFixture<ReportabilityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportabilityListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportabilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
