import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { Todo } from '@core/models/todo.model';
import { PriorityPipe } from '@core/pipes';
import { TagComponent } from '@shared/components/tag/tag.component';

@Component({
  standalone: true,
  selector: 'app-task-row',
  imports: [CommonModule, PriorityPipe, TagComponent],
  templateUrl: './task-row.component.html',
  styleUrls: ['./task-row.component.scss'],
})
export class TaskRowComponent {
  @Input({ required: true }) todo!: Todo;
  @Input() categoryIcon = 'fa-tag';
  @Input() dateLabel = '';
  @Input() urgent = false;

  @Output() toggleDone = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  public menuOpen = false;

  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  public get title(): string {
    return (this.todo.task as unknown as string) ?? '';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.menuOpen = false;
    }
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  startEdit(): void {
    this.menuOpen = false;
    this.edit.emit();
  }

  deleteTask(): void {
    this.menuOpen = false;
    this.remove.emit();
  }
}
