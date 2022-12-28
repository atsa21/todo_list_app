import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DateAdapter } from '@angular/material/core';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-dialog-todo',
  templateUrl: './dialog-todo.component.html',
  styleUrls: ['./dialog-todo.component.scss']
})
export class DialogTodoComponent implements OnInit {

  taskCategories: string[] = ['Personal', 'Work'];
  tagsList: string[] = [];
  cantAddTag = false;
  minDate: Date;

  todoForm !: FormGroup;
  dialogTitle : string = "Add Todo";
  actionBtn : string = "Submit";
  userId: string | null = '';
  key: any;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor( private formBuilder : FormBuilder,
    private todoService: TodoService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogReg: MatDialogRef<DialogTodoComponent>,
    private snackbar: SnackBarService,
    private dateAdapter: DateAdapter<Date>
    ) {
      this.dateAdapter.setLocale('en-GB');
      this.minDate = new Date();
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.todoForm = this.formBuilder.group({
      category : new FormControl('', Validators.required),
      task : new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]),
      date: new FormControl('', Validators.required),
      tags : this.tagsList,
      authorId: this.userId,
      checked : false
    });

    if(this.editData) {
      this.dialogTitle = "Edit Todo";
      this.actionBtn = "Save";
      const date = new Date(this.editData.date);
      this.todoForm.controls['category'].setValue(this.editData.category);
      this.todoForm.controls['task'].setValue(this.editData.task);
      this.todoForm.controls['date'].setValue(date);
      this.tagsList = this.editData.tags;
      this.key = this.editData.key;
    }
  }

  get category(){
    return this.todoForm.get('category');
  }

  get date(){
    return this.todoForm.get('date');
  }

  get task(){
    return this.todoForm.get('task');
  }

  get tags(){
    return this.todoForm.get('tags');
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value.length >= 2 && value.length <= 14) {
      this.tagsList.push(value);
      this.checkTagLength();
      event.chipInput!.clear();
    }
  }

  removeTag(tag: string): void {
    const index = this.tagsList.indexOf(tag);
    if (index >= 0) {
      this.tagsList.splice(index, 1);
    }
    this.checkTagLength();
  }

  checkTagLength(): void {
    this.tagsList.length === 3 ? this.cantAddTag = true : this.cantAddTag = false;
  }

  addTodo(): void {
    if(!this.editData){
      if(this.todoForm.valid){
        this.tags?.setValue(this.tagsList);
        this.todoService.createTodo(this.todoForm.value, this.userId);
        this.dialogReg.close();
      }
    } else {
      this.updateTodo();
    }
  }

  updateTodo(){
    this.tags?.setValue(this.tagsList);
    this.todoService.updateTodo(this.todoForm.value, this.key)
    this.dialogReg.close();
  }
}
