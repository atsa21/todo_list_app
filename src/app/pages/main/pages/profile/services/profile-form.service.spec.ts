import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';

import { ProfileFormService } from './profile-form.service';
import { FormBuilder } from '@angular/forms';

describe('ProfileFormService', () => {
  let service: ProfileFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileFormService, FormBuilder],
    });
    service = TestBed.inject(ProfileFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
