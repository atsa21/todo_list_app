import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EControlNames } from '@core/enums';
import { UserModel } from '@core/models';
import { Patterns } from 'src/assets/patterns/patterns';

@Injectable()
export class ProfileFormService {
  constructor(private fb: FormBuilder) {}

  public createForm(user: UserModel): FormGroup {
    return this.fb.group({
      [EControlNames.Username]: new FormControl(user?.username || null, [Validators.required, Validators.pattern(Patterns.NamePattern)]),
      [EControlNames.Key]: new FormControl(user?.key || null),
      [EControlNames.ProfilePhoto]: new FormControl(user?.profile_photo || null),
    });
  }
}
