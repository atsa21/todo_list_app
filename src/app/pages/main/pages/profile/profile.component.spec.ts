import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';

import { ProfileComponent } from './profile.component';
import { ProfileFormService } from './services/profile-form.service';
import { UsersService } from '@core/services/users/users.service';
import { SnackBarService } from '@core/services/snack-bar/snack-bar.service';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const userServiceMock = {
    getUser() {
      return {
        snapshotChanges: () => of(true)
      }
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule
      ],
      providers: [
        { provide: UsersService, useValue: userServiceMock },
        { provide: ProfileFormService, useValue: { createForm: () => {} } },
        { provide: SnackBarService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
