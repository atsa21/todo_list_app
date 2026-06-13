import { Component, ElementRef, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { SnackBarService } from '@core/services/snack-bar.service';
import { TodoService } from '@core/services/todo.service';
import { CategoryService } from '@core/services/category.service';
import { AddEditTodoFormService } from './services/add-edit-todo-form.service';
import { EControlNames } from '@core/enums';
import { Category } from '@core/models/category.model';
import { PriorityPipe } from '@core/pipes';
import { DialogShellComponent } from '@shared/components/dialogs/dialog-shell/dialog-shell.component';
import { InputDirective } from '@shared/directives';

const MAX_TAGS = 3;
const MIN_TAG_LENGTH = 2;
const MAX_TAG_LENGTH = 14;

@Component({
    standalone: true,
    selector: 'app-add-edit-todo',
    templateUrl: './add-edit-todo.component.html',
    styleUrls: ['./add-edit-todo.component.scss'],
    imports: [ReactiveFormsModule, PriorityPipe, DialogShellComponent, InputDirective],
    providers: [AddEditTodoFormService]
})
export class AddEditTodoComponent implements OnInit {
  @ViewChild('taskInput') private taskInput?: ElementRef<HTMLTextAreaElement>;

  public categories: Category[] = [];
  public priorities: number[] = [1, 2, 3, 4];
  public minDate: string = this.toInputDate(new Date());

  public todoForm!: FormGroup;
  public key: string | null = null;

  private categoryService = inject(CategoryService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private todoService: TodoService,
    private dialogRef: MatDialogRef<AddEditTodoComponent>,
    private snackbar: SnackBarService,
    private addEditTodoFormService: AddEditTodoFormService
  ) {}

  public get dialogTitle(): string {
    return this.editData ? 'Edit Task' : 'New Task';
  }

  public get subline(): string {
    return this.editData
      ? 'Tweak the details and keep things on track'
      : 'Add it to your list and stay on track';
  }

  public get actionBtn(): string {
    return this.editData ? 'Save' : 'Add task';
  }

  public get category(): FormControl {
    return this.todoForm.get(EControlNames.Category) as FormControl;
  }

  public get date(): FormControl {
    return this.todoForm.get(EControlNames.Date) as FormControl;
  }

  public get priority(): FormControl {
    return this.todoForm.get(EControlNames.Priority) as FormControl;
  }

  public get task(): FormControl {
    return this.todoForm.get(EControlNames.Task) as FormControl;
  }

  public get tagsList(): FormControl {
    return this.todoForm.get(EControlNames.Tags) as FormControl;
  }

  public get tags(): string[] {
    return this.tagsList.value ?? [];
  }

  public get canAddTag(): boolean {
    return this.tags.length < MAX_TAGS;
  }

  public get dateInputValue(): string {
    return this.date.value ? this.toInputDate(new Date(this.date.value)) : '';
  }

  public get timeInputValue(): string {
    return this.date.value ? this.toInputTime(new Date(this.date.value)) : '';
  }

  ngOnInit(): void {
    if (this.editData) {
      this.key = this.editData.key;
    }
    this.todoForm = this.addEditTodoFormService.createForm(this.editData);

    if (!this.editData) {
      if (!this.priority.value) {
        this.priority.setValue(3);
      }
    }

    this.categoryService.getCategories().pipe(take(1)).subscribe(cats => {
      this.categories = cats.filter(c => !c.isHidden);
      if (!this.editData && !this.category.value && this.categories.length) {
        this.category.setValue(this.categories[0].name);
      }
    });
  }

  public selectCategory(name: string): void {
    this.category.setValue(name);
    this.category.markAsDirty();
  }

  public selectPriority(value: number): void {
    this.priority.setValue(value);
    this.priority.markAsDirty();
  }

  public onDateChange(value: string): void {
    if (!value) {
      this.date.setValue(null);
      return;
    }
    const [year, month, day] = value.split('-').map(Number);
    const current = this.date.value ? new Date(this.date.value) : null;
    const hours = current ? current.getHours() : 0;
    const minutes = current ? current.getMinutes() : 0;
    this.date.setValue(new Date(year, month - 1, day, hours, minutes));
  }

  public onTimeChange(value: string): void {
    // Time alone has no meaning without a day — ignore it until a date is picked.
    if (!this.date.value) {
      return;
    }
    const current = new Date(this.date.value);
    const [hours, minutes] = value ? value.split(':').map(Number) : [0, 0];
    current.setHours(hours, minutes, 0, 0);
    this.date.setValue(current);
  }

  public onTagKeydown(event: KeyboardEvent, input: HTMLInputElement): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag(input);
    }
  }

  public addTag(input: HTMLInputElement): void {
    const value = input.value.trim().replace(/^#/, '');
    const isValid =
      value.length >= MIN_TAG_LENGTH &&
      value.length <= MAX_TAG_LENGTH &&
      this.canAddTag &&
      !this.tags.includes(value);

    if (isValid) {
      this.tagsList.setValue([...this.tags, value]);
    }
    input.value = '';
  }

  public removeTag(tag: string): void {
    this.tagsList.setValue(this.tags.filter(t => t !== tag));
  }

  public close(): void {
    this.dialogRef.close();
  }

  public submit(): void {
    if (this.todoForm.invalid) {
      this.task.markAsTouched();
      this.taskInput?.nativeElement.focus();
      return;
    }

    if (!this.editData) {
      this.todoService.createTodo(this.todoForm.value).then(() => this.dialogRef.close());
    } else {
      this.updateTodo();
    }
  }

  private updateTodo(): void {
    this.todoService.updateTodo(this.todoForm.value, this.key as string).then(() => {
      this.dialogRef.close();
      this.snackbar.openSnackBar('Task Updated', 'success', 'Close');
    });
  }

  private toInputDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toInputTime(date: Date): string {
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
