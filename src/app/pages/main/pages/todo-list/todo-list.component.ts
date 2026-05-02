import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TodoService } from '@core/services/todo/todo.service';
import { Subject, take, takeUntil } from 'rxjs';
import { Todo } from 'src/app/core/models/todo.model';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AddEditTodoComponent } from '@core/components/dialogs/add-edit-todo/add-edit-todo.component';
import { LoaderModule } from '@core/components/loader/loader.module';
import { PriorityStatusModule } from '@core/components/priority-status/priority-status.module';
import { PriorityPipeModule } from '@core/pipes/priority-pipe/priority.pipe.module';

@Component({
    standalone: true,
    selector: 'app-todo-list',
    imports: [
      CommonModule,
      FormsModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatOptionModule,
      MatCheckboxModule,
      MatButtonModule,
      MatIconModule,
      MatMenuModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatProgressBarModule,
      LottieComponent,
      LoaderModule,
      PriorityStatusModule,
      PriorityPipeModule,
    ],
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit {

  public displayedColumns: string[] = ['checked', 'task','category', 'date', 'priority', 'tags', 'action', 'open'];
  public dataSource!: MatTableDataSource<any>;
  public todoReadyList: any;
  public todoElements: number = 0;
  public options: AnimationOptions = {
    path: '/assets/animation/watchtv.json'
  };

  public totalTodo: number = 0;
  public readyTodo: number = 0;
  public unreadyTodo: number = 0;
  public progress: number = 0;
  public categories: string[] = ['all tasks', 'work', 'study', 'home', 'hobbies', 'other'];
  public selectedCategory: string = 'all tasks';

  public data: any;
  public today: any;
  public menuOpen = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:  MatSort;

  public dialog = inject(MatDialog);
  public todoService = inject(TodoService);
  public cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.today = new Date(new Date().setHours(0,0,0,0)).toString();
    this.getAllTodo();
  }

  private getAllTodo(): void {
    this.todoService.getAllTodo()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.setData(data);
        this.todoElements = data.length;
        this.cdr.markForCheck();
      });
  }

  public getTodoByCategory(category: string): void {
    if (category !== 'all tasks') {
      this.todoService
        .getTodoByCategory(category)
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe((data) => {
          this.setData(data);
          this.cdr.markForCheck();
        });
    } else {
      this.getAllTodo();
    }
  }

  private setData(data: any): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.data = this.dataSource.data.sort((a, b) => a.priority - b.priority);
    this.totalTodo = data.length;
    this.todoReadyList = this.dataSource.data.filter(el => el.checked === true);
    this.readyTodo = this.todoReadyList.length;
    this.unreadyTodo = this.totalTodo - this.readyTodo;
    this.progress = 100 / this.totalTodo * this.readyTodo;

    if(this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if(this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  checkPastDate(date: string): boolean {
    const now = new Date();
    const dateToCheck = new Date(date);
    return dateToCheck < now;
  }

  editTodo(row : Todo): void {
    this.dialog.open(AddEditTodoComponent, {
      width: '420px',
      data:row
    })
  }

  checkTodo(row: Todo, key: string): void {
    this.todoService.updateTodo(row, key);
  }

  deleteTodo(key: any): void {
    this.todoService.deleteTodo(key);
  }

  openDialog(): void {
    this.dialog.open(AddEditTodoComponent, {
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
    return checked ? 'ready' : (isPast ? 'past' : 'unready');
  }

  getPriorityClass(priority: number): string {
    switch (priority) {
      case 1:
        return 'critical-icon';
      case 2:
        return 'high-icon';
      case 3:
        return 'medium-icon';
      case 4:
        return 'low-icon';
      default:
        return 'error';
    }
  }

  getTagsClass(priority: number): string {
    switch (priority) {
      case 1:
        return 'critical-tag';
      case 2:
        return 'high-tag';
      case 3:
        return 'medium-tag';
      case 4:
        return 'low-tag';
      default:
        return 'error';
    }
  }

}
