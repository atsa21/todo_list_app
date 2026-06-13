import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  DestroyRef,
  HostListener,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TodoService } from '@core/services/todo.service';
import { CategoryService } from '@core/services/category.service';
import { UsersService } from '@core/services/users.service';
import { UserModel } from '@core/models';
import { Subject, debounceTime, take, takeUntil } from 'rxjs';
import { Todo } from 'src/app/core/models/todo.model';
import { Category } from '@core/models/category.model';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AddEditTodoComponent } from '@shared/components/dialogs/add-edit-todo/add-edit-todo.component';
import { EditCategoriesComponent } from '@shared/components/dialogs/edit-categories/edit-categories.component';
import { TaskRowComponent } from '@shared/components/task-row/task-row.component';
import { ButtonDirective } from 'src/app/shared/directives';
import { LoaderComponent } from '@shared/components/loader/loader.component';

type SortKey = 'default' | 'date' | 'priority';
type DateFilter = 'all' | 'today' | 'week' | 'later';

const DAY_MS = 86400000;

@Component({
  standalone: true,
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LottieComponent,
    LoaderComponent,
    TaskRowComponent,
    ButtonDirective,
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class TodoListComponent implements OnInit {
  public options: AnimationOptions = {
    path: '/assets/animation/watchtv.json',
  };

  public categories: Category[] = [];
  public user: UserModel | null = null;
  public todayDate: Date = new Date();
  public loaded = false;

  public searchControl = new FormControl('');
  public search = '';
  public sort: SortKey = 'default';

  public filterCategories: string[] = [];
  public filterPriority: number | null = null;
  public filterDate: DateFilter = 'all';
  public openPopover: 'sort' | 'filter' | null = null;

  public readonly pageSize = 5;
  public page = 0;

  public quickAddValue = '';

  public readonly sortKeys: SortKey[] = ['default', 'date', 'priority'];
  public readonly sortLabels: Record<SortKey, string> = {
    default: 'Default order',
    date: 'Date · soonest',
    priority: 'Priority · high first',
  };

  public readonly priorityOptions: { value: number; label: string; cls: string }[] = [
    { value: 1, label: 'Critical', cls: 'critical' },
    { value: 2, label: 'High', cls: 'high' },
    { value: 3, label: 'Medium', cls: 'medium' },
    { value: 4, label: 'Low', cls: 'low' },
  ];

  private rawTodos: Todo[] = [];
  private today = '';

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private destroyRef = inject(DestroyRef);

  public dialog = inject(MatDialog);
  public todoService = inject(TodoService);
  public categoryService = inject(CategoryService);
  private usersService = inject(UsersService);
  public cdr = inject(ChangeDetectorRef);
  private datePipe = inject(DatePipe);

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.search = (value ?? '').trim().toLowerCase();
        this.page = 0;
        this.cdr.markForCheck();
      });

    this.usersService
      .getUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.user = data?.[0] ?? null;
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {
    this.today = new Date(new Date().setHours(0, 0, 0, 0)).toString();
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(take(1))
      .subscribe((cats) => {
        this.categories = cats;
        this.loadTodos();
        this.cdr.markForCheck();
      });
  }

  private loadTodos(): void {
    this.todoService
      .getAllTodo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.rawTodos = data;
        this.loaded = true;
        this.clampPage();
        this.cdr.markForCheck();
      });
  }

  public get visibleCategories(): Category[] {
    return this.categories.filter((c) => !c.isHidden);
  }

  public get visibleTodos(): Todo[] {
    const hidden = new Set(this.categories.filter((c) => c.isHidden).map((c) => c.name));
    return hidden.size ? this.rawTodos.filter((t) => !hidden.has(t.category!)) : this.rawTodos;
  }

  public get hasTodos(): boolean {
    return this.rawTodos.length > 0;
  }

  public get filtered(): Todo[] {
    return this.visibleTodos.filter((t) => {
      if (this.filterCategories.length && !this.filterCategories.includes(t.category!)) {
        return false;
      }
      if (this.filterPriority !== null && t.priority !== this.filterPriority) {
        return false;
      }
      if (this.filterDate !== 'all') {
        const offset = this.dueOffset(t.date);
        if (offset === null) {
          return false;
        }
        if (this.filterDate === 'today' && offset !== 0) {
          return false;
        }
        if (this.filterDate === 'week' && (offset < 0 || offset > 6)) {
          return false;
        }
        if (this.filterDate === 'later' && offset <= 6) {
          return false;
        }
      }
      if (this.search && !this.titleOf(t).toLowerCase().includes(this.search)) {
        return false;
      }
      return true;
    });
  }

  public get sorted(): Todo[] {
    const list = [...this.filtered];
    if (this.sort === 'date') {
      list.sort((a, b) => {
        const oa = this.dueOffset(a.date);
        const ob = this.dueOffset(b.date);
        if (oa === null && ob === null) return 0;
        if (oa === null) return 1;
        if (ob === null) return -1;
        return oa - ob;
      });
    } else if (this.sort === 'priority') {
      list.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
    }
    return list;
  }

  public get pagedTodos(): Todo[] {
    const start = this.page * this.pageSize;
    return this.sorted.slice(start, start + this.pageSize);
  }

  public get totalCount(): number {
    return this.visibleTodos.length;
  }

  public get doneCount(): number {
    return this.visibleTodos.filter((t) => t.checked).length;
  }

  public get remainingCount(): number {
    return this.totalCount - this.doneCount;
  }

  public get remainingToday(): number {
    return this.visibleTodos.filter((t) => !t.checked && this.dueOffset(t.date) === 0).length;
  }

  public get progress(): number {
    return this.totalCount ? Math.round((this.doneCount / this.totalCount) * 100) : 0;
  }

  public get activeFilterCount(): number {
    let n = this.filterCategories.length;
    if (this.filterPriority !== null) n++;
    if (this.filterDate !== 'all') n++;
    return n;
  }

  public get pageCount(): number {
    return Math.max(1, Math.ceil(this.sorted.length / this.pageSize));
  }

  public get rangeStart(): number {
    return this.sorted.length ? this.page * this.pageSize + 1 : 0;
  }

  public get rangeEnd(): number {
    return Math.min((this.page + 1) * this.pageSize, this.sorted.length);
  }

  public prevPage(): void {
    if (this.page > 0) {
      this.page--;
    }
  }

  public nextPage(): void {
    if (this.page < this.pageCount - 1) {
      this.page++;
    }
  }

  private clampPage(): void {
    if (this.page > this.pageCount - 1) {
      this.page = this.pageCount - 1;
    }
  }

  public togglePopover(name: 'sort' | 'filter', event: MouseEvent): void {
    event.stopPropagation();
    this.openPopover = this.openPopover === name ? null : name;
  }

  @HostListener('document:click')
  public closePopovers(): void {
    this.openPopover = null;
  }

  public setSort(sort: SortKey): void {
    this.sort = sort;
    this.page = 0;
    this.openPopover = null;
  }

  public setCategory(category: string): void {
    if (category === 'all') {
      this.filterCategories = [];
    } else {
      const i = this.filterCategories.indexOf(category);
      if (i === -1) {
        this.filterCategories = [...this.filterCategories, category];
      } else {
        this.filterCategories = this.filterCategories.filter((c) => c !== category);
      }
    }
    this.page = 0;
  }

  public isCategoryActive(category: string): boolean {
    return category === 'all'
      ? this.filterCategories.length === 0
      : this.filterCategories.includes(category);
  }

  public setPriority(priority: number | null): void {
    this.filterPriority = priority;
    this.page = 0;
  }

  public setDateFilter(value: DateFilter): void {
    this.filterDate = value;
    this.page = 0;
  }

  public clearFilters(): void {
    this.filterCategories = [];
    this.filterPriority = null;
    this.filterDate = 'all';
    this.page = 0;
  }

  public priorityLabel(value: number): string {
    return this.priorityOptions.find((p) => p.value === value)?.label ?? '';
  }

  public toggleDone(row: Todo): void {
    row.checked = !row.checked;
    this.todoService.updateTodo(row, row.key!);
  }

  public openEdit(row: Todo): void {
    this.dialog.open(AddEditTodoComponent, {
      width: '600px',
      panelClass: 'todo-dialog-panel',
      backdropClass: 'todo-dialog-backdrop',
      data: row,
    });
  }

  public deleteTodo(key: string | null | undefined): void {
    this.todoService.deleteTodo(key);
  }

  public quickAdd(): void {
    const value = this.quickAddValue.trim();
    if (!value) {
      return;
    }
    const category = this.visibleCategories[0]?.name ?? 'other';
    this.todoService.createTodo({
      task: value as unknown as string[],
      category,
      date: this.today,
      priority: 4,
      tags: [],
    });
    this.quickAddValue = '';
  }

  public openDialog(): void {
    this.dialog.open(AddEditTodoComponent, {
      width: '600px',
      panelClass: 'todo-dialog-panel',
      backdropClass: 'todo-dialog-backdrop',
    });
  }

  public openEditCategories(): void {
    this.dialog
      .open(EditCategoriesComponent, {
        width: '600px',
        panelClass: 'todo-dialog-panel',
        backdropClass: 'todo-dialog-backdrop',
        data: { categories: this.categories },
      })
      .afterClosed()
      .subscribe((updated: Category[] | undefined) => {
        if (updated) {
          this.categories = updated;
          const available = new Set(this.visibleCategories.map((c) => c.name));
          this.filterCategories = this.filterCategories.filter((c) => available.has(c));
          this.clampPage();
          this.cdr.markForCheck();
        }
      });
  }

  public categoryIcon(name: string | undefined): string {
    return this.categories.find((c) => c.name === name)?.icon ?? 'fa-tag';
  }

  public isUrgent(row: Todo): boolean {
    const offset = this.dueOffset(row.date);
    return !row.checked && offset !== null && offset <= 0;
  }

  public formatDate(date: string | undefined): string {
    if (!date || date === '-') {
      return '—';
    }
    if (date === this.today) {
      return 'Today';
    }
    return this.datePipe.transform(date) ?? '—';
  }

  private titleOf(todo: Todo): string {
    return (todo.task as unknown as string) ?? '';
  }

  private dueOffset(date: string | undefined): number | null {
    if (!date || date === '-') {
      return null;
    }
    const target = new Date(date);
    if (isNaN(target.getTime())) {
      return null;
    }
    target.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - now.getTime()) / DAY_MS);
  }
}
