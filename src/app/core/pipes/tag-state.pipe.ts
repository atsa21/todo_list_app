import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tagState',
})
export class TagStatePipe implements PipeTransform {
  transform(priority: number, checked: boolean): string {
    if (checked) return 'ready-tag';

    switch (priority) {
      case 1:
        return 'critical-tag';
      case 2:
        return 'high-tag';
      case 3:
        return 'medium-tag';
      case 4:
        return 'low-tag';
      default:
        return 'ready-tag';
    }
  }
}
