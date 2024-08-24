import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishCardComponent } from './wish-card.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { WishListService } from '@core/services/wish-list/wish-list.service';

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
        { provide: WishListService, useValue: { deleteWish: () => {} } },
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
