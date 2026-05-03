import { Component, inject, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { take } from 'rxjs';
import { SnackBarService } from '@core/services/snack-bar/snack-bar.service';
import { TodoService } from '@core/services/todo/todo.service';
import { CategoryService } from '@core/services/category/category.service';
import { AddEditTodoFormService } from './services/add-edit-todo-form.service';
import { EControlNames } from '@core/enums';
import { Category } from '@core/models/category.model';
import { PriorityStatusModule } from '@core/components/priority-status/priority-status.module';

@Component({
    standalone: true,
    selector: 'app-add-edit-todo',
    templateUrl: './add-edit-todo.component.html',
    styleUrls: ['./add-edit-todo.component.scss'],
    imports: [
      ReactiveFormsModule,
      MatDialogModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      MatOptionModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatChipsModule,
      PriorityStatusModule,
    ],
    providers: [AddEditTodoFormService]
})
export class AddEditTodoComponent implements OnInit {
  public categories: Category[] = [];
  public priorities: number[] = [1, 2, 3, 4];
  public cantAddTag = false;
  public minDate: Date;

  public todoForm!: FormGroup;
  public dialogTitle: string = 'Add Todo';
  public actionBtn: string = 'Submit';
  public key: any;

  public addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private categoryService = inject(CategoryService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private todoService: TodoService,
    private dialogRef: MatDialogRef<AddEditTodoComponent>,
    private snackbar: SnackBarService,
    private addEditTodoFormService: AddEditTodoFormService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.minDate = new Date();
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

  ngOnInit(): void {
    if (this.editData) {
      this.dialogTitle = 'Edit Todo';
      this.actionBtn = 'Save';
      this.key = this.editData.key;
    }
    this.todoForm = this.addEditTodoFormService.createForm(this.editData);
    this.categoryService.getCategories().pipe(take(1)).subscribe(cats => {
      this.categories = cats.filter(c => !c.isHidden);
    });
  }

  public addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const isValidTag = value.length >= 2 && value.length <= 14 && !this.tagsList.value.includes(value);
    if (isValidTag) {
      this.tagsList.setValue([...this.tagsList.value, value]);
      this.checkTagLength();
      event.chipInput!.clear();
    }
  }

  public removeTag(tag: string): void {
    const current: string[] = this.tagsList.value;
    const index = current.indexOf(tag);
    if (index >= 0) {
      const updated = [...current];
      updated.splice(index, 1);
      this.tagsList.setValue(updated);
    }
    this.checkTagLength();
  }

  public checkTagLength(): void {
    this.cantAddTag = this.tagsList.value.length === 3;
  }

  public addTodo(): void {
    if (!this.editData) {
      if (this.todoForm.valid) {
        this.todoService.createTodo(this.todoForm.value).then(() => {
          this.dialogRef.close();
        });
      }
    } else {
      this.updateTodo();
    }
  }

  public updateTodo(): void {
    if (this.todoForm.value.date) {
      this.date.setValue(this.todoForm.value.date.toString());
    }
    this.todoService.updateTodo(this.todoForm.value, this.key).then(() => {
      this.dialogRef.close();
      this.snackbar.openSnackBar('Task Updated', 'success', 'Close');
    });
  }
}
