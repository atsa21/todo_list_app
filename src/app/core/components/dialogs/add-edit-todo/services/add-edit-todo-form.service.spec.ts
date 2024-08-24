import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';

import { AddEditTodoFormService } from './add-edit-todo-form.service';

describe('AddEditTodoFormService', () => {
  let service: AddEditTodoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule
      ]
    });
    service = TestBed.inject(AddEditTodoFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
