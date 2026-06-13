import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Patterns } from 'src/assets/patterns/patterns';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Injectable()
export class SignUpFormService {
  public createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(
        null,
        [
          Validators.maxLength(20),
          Validators.pattern(Patterns.NamePattern)
        ]
      ),
      email: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(62),
          Validators.email]
      ),
      password: new FormControl(
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(128),
          Validators.pattern(Patterns.PasswordPattern)
        ]
      ),
      confirmPassword: new FormControl(
        null, [Validators.required]),
    }, { validators: passwordsMatch });
  }
}
