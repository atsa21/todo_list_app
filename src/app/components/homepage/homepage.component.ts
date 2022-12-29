import { Component, OnInit, ViewChild} from '@angular/core';
import { DialogTodoComponent } from '../dialog-todo/dialog-todo.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TodoService } from 'src/app/services/todo.service';
import { map } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  displayedColumns: string[] = [ 'checked', 'category', 'task',  'tags', 'date', 'action'];
  dataSource!: MatTableDataSource<any>;
  tableTags: any;
  todoReadyList: any;

  public totalTodo: number = 0;
  public readyTodo: number = 0;
  public unreadyTodo: number = 0;
  public progress: number = 0;
  public categories: string[] = ['All tasks', 'Personal', 'Work'];
  public category = '';

  public data: any;
  private userId: string | null = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog : MatDialog,
    private todoService: TodoService,
    private localStorService: LocalStorageService
  ){}

  ngOnInit(): void {
    this.userId = this.localStorService.getItem('userId');
    this.getAllTodo();
  }

  getAllTodo(): void {
    this.todoService.getAllTodo().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.setData(data);
    });
  }

  getTodoByCategory(category: string): void {
    if(category !== 'All tasks') {
      this.todoService.getTodoByCategory(category).pipe().subscribe( data => {
        this.setData(data);
      });
    } else {
      this.getAllTodo();
    }
  }

  getReadyTodo(): void {
    this.todoService.getReadyTodo().pipe().subscribe( data => {
      this.todoReadyList = data;
      this.readyTodo = this.todoReadyList.length;
      this.unreadyTodo = this.totalTodo - this.readyTodo;
      this.progress = 100 / this.totalTodo * this.readyTodo;
    })
  }

  setData(data: any): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.totalTodo = data.length;
    this.getReadyTodo();
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

  openDialog(): void {
    this.dialog.open(DialogTodoComponent, {
      width: '30%'
    });
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
