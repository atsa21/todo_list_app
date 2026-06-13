import { TestBed } from '@angular/core/testing';
import { AddEditTodoFormService } from './add-edit-todo-form.service';
import { FormBuilder } from '@angular/forms';

describe('AddEditTodoFormService', () => {
  let service: AddEditTodoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddEditTodoFormService, FormBuilder],
    });
    service = TestBed.inject(AddEditTodoFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
