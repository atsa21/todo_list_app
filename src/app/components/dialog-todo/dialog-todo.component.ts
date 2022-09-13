import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-dialog-todo',
  templateUrl: './dialog-todo.component.html',
  styleUrls: ['./dialog-todo.component.scss']
})
export class DialogTodoComponent implements OnInit {


  // Create a todo

  taskcategories: string[] = ['Personal', 'Work'];

  todoForm !: FormGroup;
  dialogTitle : string = "Add Todo";
  actionBtn : string = "Submit";


  constructor( private formBuilder : FormBuilder,
    private api : ApiService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogReg : MatDialogRef<DialogTodoComponent>,
    private snackbar : SnackBarService) {
  }

  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      category : new FormControl('', Validators.required),
      taskTitle : new FormControl('', [Validators.required, Validators.minLength(2)]),
      taskDescription : new FormControl('', [Validators.required, Validators.minLength(2)]),
      checked : false
    });

    if(this.editData) {
      this.dialogTitle = "Edit Todo";
      this.actionBtn = "Save";
      this.todoForm.controls['category'].setValue(this.editData.category);
      this.todoForm.controls['taskTitle'].setValue(this.editData.taskTitle);
      this.todoForm.controls['taskDescription'].setValue(this.editData.taskDescription);
    }
  }

  get category(){
    return this.todoForm.get('category');
  }

  get taskTitle(){
    return this.todoForm.get('taskTitle');
  }

  get taskDescription(){
    return this.todoForm.get('taskDescription');
  }

  // Add Todo

  addTodo(){
    if(!this.editData){
      if(this.todoForm.valid){
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

  // Edit Todo

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
