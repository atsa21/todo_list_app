import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Pipe({
  name: 'control',
})
export class ControlPipe implements PipeTransform {
  transform(group: AbstractControl | null, name: string): FormControl {
    return group?.get(name) as FormControl;
  }
}
