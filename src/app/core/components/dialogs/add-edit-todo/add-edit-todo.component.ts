import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { SnackBarService } from '@core/services/snack-bar/snack-bar.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DateAdapter } from '@angular/material/core';
import { TodoService } from '@core/services/todo/todo.service';
import { AddEditTodoFormService } from './services/add-edit-todo-form.service';
import { EControlNames } from '@core/enums';

@Component({
  selector: 'app-add-edit-todo',
  templateUrl: './add-edit-todo.component.html',
  styleUrls: ['./add-edit-todo.component.scss']
})
export class AddEditTodoComponent implements OnInit {
  public categories: string[] = ['work', 'study', 'home', 'hobbies', 'other'];
  public priorities: number[] = [ 1, 2 , 3, 4 ];
  public cantAddTag = false;
  public minDate: Date;

  public todoForm !: FormGroup;
  public dialogTitle : string = "Add Todo";
  public actionBtn : string = "Submit";
  public key: any;

  public addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private todoService: TodoService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogReg: MatDialogRef<AddEditTodoComponent>,
    private snackbar: SnackBarService,
    private addEditTodoFormService: AddEditTodoFormService,
    private dateAdapter: DateAdapter<Date>
    ) {
    this.dateAdapter.setLocale('en-GB');
    this.minDate = new Date();
  }

  get category(): FormControl {
    return this.todoForm.get(EControlNames.Category) as FormControl;
  }

  get date(): FormControl {
    return this.todoForm.get(EControlNames.Date) as FormControl;
  }

  get priority(): FormControl {
    return this.todoForm.get(EControlNames.Priority) as FormControl;
  }

  get task(): FormControl {
    return this.todoForm.get(EControlNames.Task) as FormControl;
  }

  get tagsList(): FormControl {
    return this.todoForm.get(EControlNames.Tags) as FormControl;
  }

  ngOnInit(): void {
    if (this.editData) {
      this.dialogTitle = "Edit Todo";
      this.actionBtn = "Save";
      this.key = this.editData.key;
    }

    this.todoForm = this.addEditTodoFormService.createForm(this.editData);
    console.log(this.todoForm);
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const isValidTag = value.length >= 2 && value.length <= 14 && !this.tagsList?.value.includes(value);
    if (isValidTag) {
      this.tagsList?.setValue([...this.tagsList?.value, value]);
      this.checkTagLength();
      event.chipInput!.clear();
    }
  }

  removeTag(tag: string): void {
    const index = this.tagsList?.value.indexOf(tag);
    if (index >= 0) {
      const newValue = this.tagsList?.value;
      newValue.splice(index, 1)

      this.tagsList?.setValue(newValue);
    }
    this.checkTagLength();
  }

  checkTagLength(): void {
    this.tagsList?.value.length === 3 ? this.cantAddTag = true : this.cantAddTag = false;
  }

  addTodo(): void {
    if(!this.editData){
      if(this.todoForm.valid){
        this.todoService.createTodo(this.todoForm.value).then(() => {
          this.dialogReg.close();
        });
      }
    } else {
      this.updateTodo();
    }
  }

  updateTodo(){
    const dateString = this.todoForm.value.date.toString();
    this.date?.setValue(dateString);
    this.todoService.updateTodo(this.todoForm.value, this.key).then(() => {
      this.dialogReg.close();
      this.snackbar.openSnackBar('Task Updated', 'success', 'Close');
    });
  }
}
