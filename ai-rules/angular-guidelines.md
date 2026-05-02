# Angular 20 Guidelines

Rules for this project. Follow them strictly when generating or modifying Angular code.

---

## 1. Standalone Components — Always

Every component, directive, and pipe must be standalone. Never create or reference NgModules.

```typescript
// CORRECT
@Component({
  standalone: true,
  selector: 'app-example',
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {}

// WRONG — no NgModule declarations
@NgModule({ declarations: [ExampleComponent] })
export class ExampleModule {}
```

If a legacy NgModule file (`*.module.ts`) exists, migrate its component to standalone rather than adding to it.

---

## 2. Signals for All Local State

Use signals for every piece of local component state. Do not use plain class properties for reactive data.

```typescript
// CORRECT
export class TodoListComponent {
  public isLoading = signal(false);
  public selectedId = signal<string | null>(null);
  public filteredTodos = computed(() =>
    this.todos().filter(t => t.priority === this.selectedPriority())
  );

  constructor() {
    effect(() => {
      console.log('selected:', this.selectedId());
    });
  }
}

// WRONG
export class TodoListComponent {
  public isLoading = false;        // plain property — not reactive
  public selectedId: string | null = null;
}
```

### Signal inputs and outputs

Use `input()` and `output()` instead of `@Input()` / `@Output()`.

```typescript
// CORRECT
export class WishCardComponent {
  public wish = input.required<WishModel>();
  public deleted = output<string>();
}

// WRONG
export class WishCardComponent {
  @Input() wish!: WishModel;
  @Output() deleted = new EventEmitter<string>();
}
```

### Reading signals in templates

Always call signals as functions in templates.

```html
<!-- CORRECT -->
<span>{{ user() }}</span>
@if (isLoading()) { <app-loader /> }

<!-- WRONG -->
<span>{{ user }}</span>
@if (isLoading) { <app-loader /> }
```

---

## 3. Control Flow — @if, @for, @switch

Always use Angular 17+ built-in control flow. Never use `*ngIf`, `*ngFor`, or `*ngSwitch`.

### @if / @else if / @else

```html
@if (todos().length) {
  <ul>...</ul>
} @else if (isLoading()) {
  <app-loader />
} @else {
  <p class="empty-state">No items yet.</p>
}
```

### @for with track

`track` is mandatory. Use the item's unique identifier.

```html
@for (todo of todos(); track todo.id) {
  <app-todo-card [todo]="todo" />
} @empty {
  <p class="empty-state">No todos yet.</p>
}
```

### @switch

```html
@switch (priority()) {
  @case ('high')   { <span class="priority-high">High</span> }
  @case ('medium') { <span class="priority-medium">Medium</span> }
  @default         { <span class="priority-low">Low</span> }
}
```

---

## 4. Dependency Injection — inject() Function

Use `inject()` instead of constructor parameters.

```typescript
// CORRECT
export class TodoListComponent {
  private todoService = inject(TodoService);
  private router      = inject(Router);
  private cdr         = inject(ChangeDetectorRef);
}

// WRONG
export class TodoListComponent {
  constructor(
    private todoService: TodoService,
    private router: Router,
  ) {}
}
```

---

## 5. RxJS Subscriptions — takeUntilDestroyed

Use `takeUntilDestroyed()` from `@angular/core/rxjs-interop`. Do not use manual `destroy$` subjects.

```typescript
// CORRECT
export class TodoListComponent {
  private destroyRef = inject(DestroyRef);

  private loadTodos(): void {
    this.todoService.getAllTodo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.todos.set(data);
      });
  }
}

// WRONG — manual destroy subject
export class TodoListComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
}
```

---

## 6. Change Detection — OnPush Always

Every component must use `ChangeDetectionStrategy.OnPush`.

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class MyComponent {}
```

With signals and `OnPush`, manual `cdr.markForCheck()` calls are rarely needed. Remove them when signals drive the template.

---

## 7. Services

- Always `providedIn: 'root'` for singleton services.
- Use `inject()` inside the service body.
- Return `Observable<T>` for Firebase data streams; use signals only for derived/local state inside the service if needed.

```typescript
@Injectable({ providedIn: 'root' })
export class TodoService {
  private db = inject(Database);
  private auth = inject(AuthService);

  private get userId(): string {
    return this.auth.currentUser()!.uid;
  }

  getAllTodo(): Observable<Todo[]> {
    return listValRaw<Todo>(ref(this.db, `todoList/${this.userId}/data`));
  }
}
```

---

## 8. Routing — Lazy-Loaded Standalone Components

Use `loadComponent` for leaf routes and `loadChildren` returning a `Routes` array (not a module) for feature areas.

```typescript
// Root routes
export const routes: Routes = [
  {
    path: 'main',
    loadChildren: () =>
      import('./pages/main/main.routes').then(m => m.MAIN_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(m => m.LoginComponent),
  },
];

// Feature routes file (main.routes.ts) — exports a Routes array, NOT a module
export const MAIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./main.component').then(m => m.MainComponent),
    children: [
      {
        path: 'todo',
        loadComponent: () =>
          import('./pages/todo-list/todo-list.component').then(m => m.TodoListComponent),
      },
    ],
  },
];
```

---

## 9. Reactive Forms

Use `FormGroup` / `FormControl` with typed generics. Access controls via `.controls` not `.get()` where possible.

```typescript
export class LoginComponent {
  public form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  // Derived signal from form control for template error display
  public emailError = signal(getFormError(this.form.controls.email));
}
```

In templates, bind directly to `form.controls.email` rather than `form.get('email')`.

---

## 10. TypeScript

- Enable strict mode — never disable it or use `any` to silence errors.
- Prefer `readonly` on injected dependencies and props that don't change.
- Use explicit return types on public service methods.
- Use `interface` for data shapes, `type` for unions/aliases.

```typescript
// CORRECT
interface TodoModel {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  done: boolean;
}

// WRONG
const todo: any = { ... };
```

---

## 11. Template Best Practices

- One structural directive / control-flow block per element.
- Prefer `ng-container` when you need a grouping element with no DOM output.
- Avoid logic in templates — move conditions to `computed()` signals or getters.
- Use `async` pipe only when not using signals; prefer converting to signals via `toSignal()`.

```typescript
// Convert observable to signal at the component level
export class TodoListComponent {
  private todoService = inject(TodoService);
  public todos = toSignal(this.todoService.getAllTodo(), { initialValue: [] });
}
```

```html
<!-- Then the template is simple, no async pipe needed -->
@for (todo of todos(); track todo.id) {
  <app-todo-card [todo]="todo" />
}
```

---

## 12. File & Folder Conventions

```
src/app/
  core/
    components/     # Shared dumb components (header, loader, priority-status)
    services/       # Singleton services (todo, wish-list, auth, snack-bar)
    pipes/          # Shared pipes
    guards/         # Route guards
  pages/
    auth/           # Login, sign-up feature
    main/
      pages/        # Todo-list, wish-list, profile features
  shared/           # Models, enums, constants, utils
```

- One component per folder with its `.ts`, `.html`, `.scss`, and `.spec.ts`.
- Name files `kebab-case.component.ts` — no abbreviations.
- Barrel `index.ts` files are optional; import directly to keep paths explicit.

---

## 13. Angular Material

Import individual Material modules in the component's `imports` array.

```typescript
@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
})
export class LoginComponent {}
```

Never import `MaterialModule` (a barrel module) — it prevents tree-shaking.

---

## 14. What to Avoid

| Avoid | Use Instead |
|---|---|
| `*ngIf`, `*ngFor`, `*ngSwitch` | `@if`, `@for`, `@switch` |
| `@Input()` / `@Output()` decorators | `input()` / `output()` functions |
| Constructor injection | `inject()` function |
| `NgModule` | Standalone component `imports` array |
| Plain class properties for reactive state | `signal()` |
| `takeUntil(destroy$)` | `takeUntilDestroyed(destroyRef)` |
| `Default` change detection | `OnPush` |
| `async` pipe with observables | `toSignal()` |
| `form.get('control')` | `form.controls.control` |
| `any` type | Explicit typed interfaces |
