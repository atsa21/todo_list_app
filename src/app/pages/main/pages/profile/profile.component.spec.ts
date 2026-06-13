import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { UsersService } from '@core/services/users.service';
import { TodoService } from '@core/services/todo.service';
import { WishListService } from '@core/services/wish-list.service';
import { AuthService } from '@core/services/auth.service';
import { SnackBarService } from '@core/services/snack-bar.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: UsersService,
          useValue: { getUser: () => of([{ username: 'Anna', email: 'anna@example.com', key: 'k1' }]) },
        },
        { provide: TodoService, useValue: { getAllTodo: () => of([]) } },
        { provide: WishListService, useValue: { getWish: () => of([]) } },
        { provide: AuthService, useValue: { logOut: () => {} } },
        { provide: SnackBarService, useValue: { openSnackBar: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('computes the initial from the username', () => {
    expect(component.initial()).toBe('A');
  });

  it('persists a preference toggle', () => {
    const before = component.preferences().weeklyDigest;
    component.toggle('weeklyDigest');
    expect(component.preferences().weeklyDigest).toBe(!before);
  });
});
