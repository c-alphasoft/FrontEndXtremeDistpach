import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftlandComponent } from './softland.component';

describe('SoftlandComponent', () => {
  let component: SoftlandComponent;
  let fixture: ComponentFixture<SoftlandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoftlandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoftlandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
