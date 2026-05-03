import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CategoryService } from '@core/services/category/category.service';
import { Subject, debounceTime, take, takeUntil } from 'rxjs';
import { Todo } from 'src/app/core/models/todo.model';
import { Category } from '@core/models/category.model';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AddEditTodoComponent } from '@core/components/dialogs/add-edit-todo/add-edit-todo.component';
import { EditCategoriesComponent } from '@core/components/dialogs/edit-categories/edit-categories.component';
import { LoaderModule } from '@core/components/loader/loader.module';
import { PriorityStatusModule } from '@core/components/priority-status/priority-status.module';
import { TagComponent } from '@core/components/tag/tag.component';
import { PriorityPipe } from '@core/pipes';
import { TODO_LIST_COLUMN } from './constants/todo-list.const';

@Component({
    standalone: true,
    selector: 'app-todo-list',
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
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
      TagComponent,
      PriorityPipe,
    ],
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DatePipe],
})
export class TodoListComponent implements OnInit {

  public displayedColumns: string[] = TODO_LIST_COLUMN;
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
  public categories: Category[] = [];
  public selectedCategory: string = 'all tasks';

  private rawTodos: Todo[] = [];

  public today: any;
  public menuOpen = false;

  public searchControl = new FormControl('');

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private destroyRef = inject(DestroyRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:  MatSort;

  public dialog = inject(MatDialog);
  public todoService = inject(TodoService);
  public categoryService = inject(CategoryService);
  public cdr = inject(ChangeDetectorRef);
  private datePipe = inject(DatePipe);

  public get visibleCategories(): Category[] {
    return this.categories.filter(c => !c.isHidden);
  }

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(value => {
      if (this.dataSource) {
        this.dataSource.filter = (value ?? '').trim().toLowerCase();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
    });
  }

  ngOnInit(): void {
    this.today = new Date(new Date().setHours(0,0,0,0)).toString();
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(take(1))
      .subscribe(cats => {
        this.categories = cats;
        this.getAllTodo();
        this.cdr.markForCheck();
      });
  }

  private getAllTodo(): void {
    this.todoService.getAllTodo()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.rawTodos = data;
        this.todoElements = data.length;
        this.setData(data);
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

  private setData(data: Todo[]): void {
    const hiddenNames = new Set(this.categories.filter(c => c.isHidden).map(c => c.name));
    const filtered = hiddenNames.size ? data.filter(t => !hiddenNames.has(t.category!)) : data;

    this.dataSource = new MatTableDataSource(filtered);
    this.dataSource.data = this.dataSource.data.sort((a, b) => a.priority - b.priority);
    this.totalTodo = filtered.length;
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

  openEditCategories(): void {
    this.dialog.open(EditCategoriesComponent, {
      width: '480px',
      data: { categories: this.categories },
    }).afterClosed().subscribe((updated: Category[] | undefined) => {
      if (updated) {
        this.categories = updated;
        if (!this.visibleCategories.some(c => c.name === this.selectedCategory)) {
          this.selectedCategory = 'all tasks';
        }
        this.setData(this.rawTodos);
        this.cdr.markForCheck();
      }
    });
  }

  getStyle(checked: boolean, date: string): string {
    const isPast = this.checkPastDate(date);
    return checked ? 'ready' : (isPast ? 'past' : 'unready');
  }

  getCategoryIcon(name: string): string {
    return this.categories.find(c => c.name === name)?.icon ?? 'fa-tag';
  }

  formatDate(date: string | undefined): string {
    if (!date || date === '-') return '—';
    if (date === this.today) return 'Today';
    return this.datePipe.transform(date) ?? '—';
  }
}
