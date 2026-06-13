import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EControlNames } from '@core/enums';

@Injectable()
export class AddEditTodoFormService {
  constructor(private fb: FormBuilder,) {}

  public createForm(data: any): FormGroup {
    const userId = localStorage.getItem('uid');
    const date = data ? new Date(data?.date) : null;

    return this.fb.group({
      [EControlNames.Category]: new FormControl(data?.category || null, Validators.required),
      [EControlNames.Task]: new FormControl(data?.task || null, [Validators.required, Validators.minLength(2), Validators.maxLength(70)]),
      [EControlNames.Date]: new FormControl(date),
      [EControlNames.Priority]: new FormControl(data?.priority || null, Validators.required),
      [EControlNames.Tags]: new FormControl(data?.tags || []),
      [EControlNames.AuthorId]: userId,
      [EControlNames.Checked]: false
    });
  }
}
