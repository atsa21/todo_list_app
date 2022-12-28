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
import { map } from 'rxjs';
import { Todo } from 'src/app/models/todo.model';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  displayedColumns: string[] = [ 'checked', 'task',  'tags', 'date', 'action'];
  dataSource!: MatTableDataSource<any>;
  tableTags: any;

  public totalTodo: number = 0;
  public readyTodo: number = 0;
  public notReadyTodo: number = 0;
  public progress: number = 0;
  public categories: string[] = ['personal', 'work'];

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
    const todo = this.todoService.getTodoByCategory('Personal');
  }

  getAllTodo(): void {
    this.todoService.getAllTodo().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.totalTodo = data.length;
      this.setTotalTodo();
    });
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

  checkTodo(row: any, key : any){
    row.checked === false ? row.checked = true : row.checked = false;
    this.todoService.updateTodo(row, key);
  }

  deleteTodo(key: any){
    this.todoService.deleteTodo(key);
  }

  setTotalTodo() {
    this.todoService.setTotalTodo(this.totalTodo);
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
