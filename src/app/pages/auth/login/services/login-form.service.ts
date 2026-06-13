import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class LoginFormService {
  public createForm(): FormGroup {
    return new FormGroup({
      email: new FormControl(
        null, [
          Validators.required,
          Validators.email
        ]),
      password: new FormControl(
        null, [
          Validators.required,
          Validators.minLength(6)
        ]),
    });
  }
}
