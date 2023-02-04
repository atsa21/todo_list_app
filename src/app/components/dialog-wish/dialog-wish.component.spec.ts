import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWishComponent } from './dialog-wish.component';

describe('DialogWishComponent', () => {
  let component: DialogWishComponent;
  let fixture: ComponentFixture<DialogWishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogWishComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogWishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
