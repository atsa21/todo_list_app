import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-priority-status',
    templateUrl: './priority-status.component.html',
    styleUrls: ['./priority-status.component.scss'],
    standalone: false
})
export class PriorityStatusComponent {
  @Input() priority!: number;
}
