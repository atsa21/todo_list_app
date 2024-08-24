import { Pipe, PipeTransform } from '@angular/core';
import { EPriority } from '@core/enums';

@Pipe({
  name: 'priority'
})
export class PriorityPipe implements PipeTransform {
  transform(value: number): EPriority {
    switch (value) {
      case 1:
        return EPriority.Critical;
      case 2:
        return EPriority.High;
      case 3:
        return EPriority.Medium
      default:
        return EPriority.Low;
    }
  }
}
