import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EControlNames } from '@core/enums';
import { Patterns } from 'src/assets/patterns/patterns';

@Injectable()
export class AddEditWishFormService {
  constructor(private fb: FormBuilder,) {}

  public createForm(data: any): FormGroup {
    return this.fb.group({
      [EControlNames.Image]: new FormControl(data?.image || null),
      [EControlNames.Title]: new FormControl(data?.task || null, [Validators.required, Validators.minLength(2), Validators.maxLength(70)]),
      [EControlNames.Price]: new FormControl(data?.price || null, [Validators.required, Validators.min(0.01), Validators.max(100000000)]),
      [EControlNames.Currency]: new FormControl(data?.currency || null, Validators.required),
      [EControlNames.Link]: new FormControl(data?.link || null, Validators.pattern(Patterns.LinkPattern)),
    });
  }
}
