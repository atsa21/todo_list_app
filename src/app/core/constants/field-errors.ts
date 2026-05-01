import { AbstractControl } from '@angular/forms';

export const FORM_ERRORS: Record<
  string,
  (error?: any) => string
> = {
  required: () => 'This field is required',
  email: () => 'Please enter a correct email format',
  minlength: (error) =>
    `Please enter at least ${error.requiredLength} characters`,
  maxlength: (error) =>
    `Please enter less than  ${error.requiredLength} characters`,
  pattern: () => 'Invalid format',
};

export function getFormError(control: AbstractControl | null): string {
  if (!control || !control.errors) {
    return '';
  }

  const firstErrorKey = Object.keys(control.errors)[0];
  const errorValue = control.errors[firstErrorKey];

  const errorFn = FORM_ERRORS[firstErrorKey];

  return errorFn ? errorFn(errorValue) : '';
}