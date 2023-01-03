import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const authMock = jasmine.createSpyObj('auth', ['logOut']);

  const usersMock = jasmine.createSpyObj('userService', ['getUser']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [ MatMenuModule ],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: UsersService, useValue: usersMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
