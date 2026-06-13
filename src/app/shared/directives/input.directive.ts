import { Directive, booleanAttribute, input } from '@angular/core';

/**
 * Applies the shared `.field-input` styling to any text input/textarea.
 *
 * Usage:
 *   <input appInput type="email">
 *   <input appInput password [type]="hide() ? 'password' : 'text'">
 *   <input appInput [invalid]="emailError() && email.touched">
 *
 * The base `.field-input` class is always added; `password` toggles the
 * `--password` modifier (extra right padding for the eye toggle) and
 * `invalid` toggles the `--error` modifier. Both are boolean attributes,
 * so `<input appInput password>` works as shorthand for `[password]="true"`.
 */
@Directive({
  selector: 'input[appInput], textarea[appInput]',
  standalone: true,
  host: {
    class: 'field-input',
    '[class.field-input--password]': 'password()',
    '[class.field-input--error]': 'invalid()',
  },
})
export class InputDirective {
  readonly password = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
}
