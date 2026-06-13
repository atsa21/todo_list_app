import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityStatusComponent } from './priority-status.component';

describe('PriorityComponent', () => {
  let component: PriorityStatusComponent;
  let fixture: ComponentFixture<PriorityStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriorityStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
