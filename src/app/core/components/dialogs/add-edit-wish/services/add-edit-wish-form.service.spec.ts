import { TestBed } from '@angular/core/testing';
import { AddEditWishFormService } from './add-edit-wish-form.service';
import { FormBuilder } from '@angular/forms';

describe('AddEditWishFormService', () => {
  let service: AddEditWishFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddEditWishFormService, FormBuilder],
    });
    service = TestBed.inject(AddEditWishFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
