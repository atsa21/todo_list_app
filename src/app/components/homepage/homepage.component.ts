import { Component, OnInit, ViewChild} from '@angular/core';
import { DialogTodoComponent } from '../dialog-todo/dialog-todo.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/services/api.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { AuthService } from 'src/app/services/auth.service';
import { getAuth } from 'firebase/auth';
import { UsersService } from 'src/app/services/users.service';
import { TodoService } from 'src/app/services/todo.service';

export interface todoList {
  category: string;
  task: string;
  tags: string[];
  date: string;
  action: any;
  checked: false;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  displayedColumns: string[] = [ 'checked', 'task',  'tags', 'date', 'action'];
  dataSource!: MatTableDataSource<todoList>;
  tableTags: any;

  public totalTodo: number = 0;
  public readyTodo: number = 0;
  public notReadyTodo: number = 0;
  public progress: number = 0;

  public data: any;

  private userId: string | null = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private dialog : MatDialog,
    private api : ApiService,
    private snackbar : SnackBarService,
    private todoService: TodoService
  ){}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.getAllTodo();
  }

  getAllTodo(): void {
    this.todoService.getAllTodo(this.userId);
  }

  editTodo(row : any){
    this.dialog.open(DialogTodoComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllTodo();
      }
    })
  }

  checkTodo(row: any, id : number){
    if (row.checked == false) {
      row.checked = true;
      this.api.putTodo(row, id)
      .subscribe({
        next:(res)=>{
          this.getAllTodo();
        }
      })
    } else if (row.checked == true) {
      row.checked = false;
      this.api.putTodo(row, id)
      .subscribe({
        next:(res)=>{
          this.getAllTodo();
        }
      })
    }
  }

  deleteTodo(id: number){
    this.api.deleteTodo(id)
    .subscribe({
      next:(res)=>{
        this.getAllTodo();
      },
      error:()=>{
        this.snackbar.openSnackBar('Error while deleting the todo', 'Close');
      }
    })
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
