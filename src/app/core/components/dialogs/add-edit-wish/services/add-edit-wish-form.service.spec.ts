import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';

import { AddEditWishFormService } from './add-edit-wish-form.service';

describe('AddEditWishFormService', () => {
  let service: AddEditWishFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule
      ]
    });
    service = TestBed.inject(AddEditWishFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
