import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
  public tag = input<string | null>(null);
  public priority = input<number>(0);
  public checked = input<boolean>(false);
  public isMobile = input<boolean>(false);

  public getStateClass(): string {
    return this.checked() ? 'ready-tag' : this.getTagsClass(this.priority());
  }

  private getTagsClass(priority: number): string {
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
