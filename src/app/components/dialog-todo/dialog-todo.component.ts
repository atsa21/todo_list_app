import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-dialog-todo',
  templateUrl: './dialog-todo.component.html',
  styleUrls: ['./dialog-todo.component.scss']
})
export class DialogTodoComponent implements OnInit {

  taskCategories: string[] = ['Personal', 'Work'];
  tagsList: string[] = [];
  cantAddTag = false;

  todoForm !: FormGroup;
  dialogTitle : string = "Add Todo";
  actionBtn : string = "Submit";
  userId: number = 1;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor( private formBuilder : FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogReg: MatDialogRef<DialogTodoComponent>,
    private snackbar: SnackBarService) {
  }

  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      category : new FormControl('', Validators.required),
      task : new FormControl('', [Validators.required, Validators.minLength(2)]),
      tags : this.tagsList,
      authorId: this.userId,
      checked : false
    });

    if(this.editData) {
      this.dialogTitle = "Edit Todo";
      this.actionBtn = "Save";
      this.todoForm.controls['category'].setValue(this.editData.category);
      this.todoForm.controls['task'].setValue(this.editData.task);
      this.todoForm.controls['tags'].setValue(this.editData.tags);
    }
  }

  get category(){
    return this.todoForm.get('category');
  }

  get task(){
    return this.todoForm.get('task');
  }

  get tags(){
    return this.todoForm.get('tags');
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tagsList.push(value);
    }

    this.checkTagLength();
    event.chipInput!.clear();
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
        this.api.postTodo(this.todoForm.value)
        .subscribe({
          next:(res)=>{
            this.todoForm.reset();
            this.dialogReg.close('save');
          },
          error:()=>{
            this.snackbar.openSnackBar('Error while adding the todo', 'Close');
          }
        })
      }
    } else {
      this.updateTodo()
    }
  }

  updateTodo(){
    this.api.putTodo(this.todoForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        this.todoForm.reset();
        this.dialogReg.close('update');
      },
      error:()=>{
        this.snackbar.openSnackBar('Error while updating the todo', 'Close');
      }
    })
  }
}
