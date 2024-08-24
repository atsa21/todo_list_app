import { Pipe, PipeTransform } from '@angular/core';
import { EPriorityIcons } from '@core/enums';

@Pipe({
  name: 'priorityIcon'
})
export class PriorityIconPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return `fa-solid ${EPriorityIcons.Critical}`;
      case 2:
        return `fa-solid ${EPriorityIcons.High}`;
      case 3:
        return `fa-solid ${EPriorityIcons.Medium}`;
      case 4:
        return `fa-solid ${EPriorityIcons.Low}`;
      default:
        return 'error';
    }
  }
}
