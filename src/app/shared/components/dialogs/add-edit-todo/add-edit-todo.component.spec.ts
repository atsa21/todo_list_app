import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SnackBarService } from '@core/services/snack-bar.service';
import { TodoService } from '@core/services/todo.service';
import { CategoryService } from '@core/services/category.service';

import { AddEditTodoComponent } from './add-edit-todo.component';
import { AddEditTodoFormService } from './services/add-edit-todo-form.service';

describe('AddEditTodoComponent', () => {
  let component: AddEditTodoComponent;
  let fixture: ComponentFixture<AddEditTodoComponent>;
  let formBuilder: FormBuilder;

  const todoMock = {
    category: 'work',
    task: 'Some task',
    priority: 4,
    tags: ['test'],
  };

  const MatDialogRefMock = { close: () => {} };
  const categoryServiceMock = { getCategories: () => of([]) };
  const todoServiceMock = {
    createTodo: () => Promise.resolve(),
    updateTodo: () => Promise.resolve(),
  };

  const addEditTodoFormServiceMock = {
    createForm: (data: any) => undefined as any,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditTodoComponent],
      providers: [
        { provide: MatDialogRef, useValue: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: todoMock },
        { provide: SnackBarService, useValue: {} },
        { provide: TodoService, useValue: todoServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: AddEditTodoFormService, useValue: addEditTodoFormServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTodoComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    addEditTodoFormServiceMock.createForm = (data: any) =>
      formBuilder.group({
        category: new FormControl(data?.category || null),
        task: new FormControl(data?.task || null),
        date: new FormControl(null),
        priority: new FormControl(data?.priority || null),
        tags: new FormControl(data?.tags || []),
        authorId: 1,
        checked: false,
      });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default priority and date for a new todo', () => {
    component.editData = null;
    component.ngOnInit();

    expect(component.priority.value).toBe(3);
    expect(component.date.value instanceof Date).toBeTrue();
  });

  it('should load edit data onInit', () => {
    component.editData = todoMock;
    component.ngOnInit();

    expect(component.dialogTitle).toBe('Edit Task');
    expect(component.actionBtn).toBe('Save');
    expect(component.category.value).toBe('work');
    expect(component.task.value).toBe('Some task');
    expect(component.priority.value).toBe(4);
    expect(component.tagsList.value).toEqual(['test']);
  });
});
