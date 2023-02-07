import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priority'
})
export class PriorityPipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 1:
        return 'critical';
      case 2:
        return 'high';
      case 3:
        return 'medium'
      default:
        return 'low';
    }
  }

}
