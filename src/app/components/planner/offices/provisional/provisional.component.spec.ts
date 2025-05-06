import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionalComponent } from './provisional.component';

describe('ProvisionalComponent', () => {
  let component: ProvisionalComponent;
  let fixture: ComponentFixture<ProvisionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvisionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvisionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
