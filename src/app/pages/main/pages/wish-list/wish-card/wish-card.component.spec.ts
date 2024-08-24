import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishCardComponent } from './wish-card.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('WishCardComponent', () => {
  let component: WishCardComponent;
  let fixture: ComponentFixture<WishCardComponent>;

  class MatDialogMock {
    open() {
      return {
        afterClosed: () => of(true)
      };
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishCardComponent ],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
