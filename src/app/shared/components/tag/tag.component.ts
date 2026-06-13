import { Component, input } from '@angular/core';
import { TagStatePipe } from '@core/pipes';

@Component({
  selector: 'app-tag',
  imports: [TagStatePipe],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
  public tag = input<string | null>(null);
  public priority = input<number>(0);
  public checked = input<boolean>(false);
  public isMobile = input<boolean>(false);
}
