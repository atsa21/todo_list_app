import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TodoService } from 'src/app/services/todo.service';
import { map, Subject, takeUntil } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Todo } from 'src/app/models/todo.model';
import { UsersService } from 'src/app/services/users.service';
import { AnimationOptions } from 'ngx-lottie';
import { DialogTodoComponent } from '../../dialog-todo/dialog-todo.component';

@Component({
  selector: 'app-todo-list-page',
  templateUrl: './todo-list-page.component.html',
  styleUrls: ['./todo-list-page.component.scss']
})
export class TodoListPageComponent implements OnInit {

  public displayedColumns: string[] = [ 'checked', 'category', 'task', 'date', 'priority', 'tags', 'action'];
  public dataSource!: MatTableDataSource<any>;
  public todoReadyList: any;
  public options: AnimationOptions = {
    path: '/assets/animation/watchtv.json'
  };

  public totalTodo: number = 0;
  public readyTodo: number = 0;
  public unreadyTodo: number = 0;
  public progress: number = 0;
  public categories: string[] = ['all tasks', 'work', 'study', 'home', 'hobbies', 'other'];
  public category = '';

  public data: any;
  public today: any;
  public user: any;
  private destroy: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:  MatSort;

  constructor(
    private dialog : MatDialog,
    private todoService: TodoService,
    private localStorService: LocalStorageService,
    private userService: UsersService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.today = new Date(new Date().setHours(0,0,0,0)).toString();
    this.getAllTodo();
    this.getUser();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    if(this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if(this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  private getAllTodo(): void {
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

  public getTodoByCategory(category: string): void {
    if(category !== 'all tasks') {
      this.todoService.getTodoByCategory(category).pipe(takeUntil(this.destroy)).subscribe( data => {
        this.setData(data);
      });
    } else {
      this.getAllTodo();
    }
  }

  private setData(data: any): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = this.dataSource.data.sort((a, b) => a.priority.id - b.priority.id);
    this.totalTodo = data.length;
    this.todoReadyList = this.dataSource.data.filter(el => el.checked === true);
    this.readyTodo = this.todoReadyList.length;
    this.unreadyTodo = this.totalTodo - this.readyTodo;
    this.progress = 100 / this.totalTodo * this.readyTodo;
  }

  private getUser(): void {
    this.userService.getUser().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.user = data[0];
    });
  }

  checkPastDate(date: string): boolean {
    const now = new Date();
    const dateToCheck = new Date(date);
    return dateToCheck < now;
  }

  editTodo(row : Todo): void {
    this.dialog.open(DialogTodoComponent, {
      width: '420px',
      data:row
    })
  }

  checkTodo(row: any, key : any): void {
    row.checked === false ? row.checked = true : row.checked = false;
    this.todoService.updateTodo(row, key);
  }

  deleteTodo(key: any): void {
    this.todoService.deleteTodo(key);
  }

  openDialog(): void {
    this.dialog.open(DialogTodoComponent, {
      width: '420px'
    });
  }

  search(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStyle(checked: boolean, date: string): string {
    const isPast = this.checkPastDate(date);
    if(checked) {
      return 'ready';
    }
    if(!checked && isPast) {
      return 'past';
    }
    return 'unready';
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'fa-solid fa-circle-exclamation';
      case 'high':
        return 'fa-solid fa-angles-up';
      case 'medium':
        return 'fa-solid fa-angle-up';
      case 'low':
        return 'fa-solid fa-angle-down';
      default:
        return 'error';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'critical-icon';
      case 'high':
        return 'high-icon';
      case 'medium':
        return 'medium-icon';
      case 'low':
        return 'low-icon';
      default:
        return 'error';
    }
  }

  getTagsClass(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'critical-tag';
      case 'high':
        return 'high-tag';
      case 'medium':
        return 'medium-tag';
      case 'low':
        return 'low-tag';
      default:
        return 'error';
    }
  }

}
