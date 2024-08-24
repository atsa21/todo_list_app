import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { SnackBarService } from '@core/services/snack-bar/snack-bar.service';
import { environment } from 'src/environments/environment';

import { AddEditTodoComponent } from './add-edit-todo.component';
import { PriorityPipeModule } from '@core/pipes/priority-pipe/priority.pipe.module';
import { AddEditTodoFormService } from './services/add-edit-todo-form.service';

describe('AddEditTodoComponent', () => {
  let component: AddEditTodoComponent;
  let fixture: ComponentFixture<AddEditTodoComponent>;
  let formBuilder: FormBuilder;

  const todoMock = {
    category: 'work',
    task: 'Some task',
    priopity: 'low',
    tags: ['test'],
  };

  const MatDialogRefMock = {
    close: () => {}
  };

  const addEditTodoFormServiceMock = {
    createForm: (data: any) => {}
  };

  const dateAdapterMock = jasmine.createSpyObj('adapter', ['setLocale']);
  dateAdapterMock.setLocale = () => of('en-GB');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTodoComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        MatDialogModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        BrowserAnimationsModule,
        PriorityPipeModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: todoMock },
        { provide: SnackBarService, useValue: {} },
        { provide: DateAdapter, useValue: dateAdapterMock },
        { provide: AddEditTodoFormService, useValue: addEditTodoFormServiceMock}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTodoComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    addEditTodoFormServiceMock.createForm = (data: any) => {
      return formBuilder.group({
        category: new FormControl(data?.category || null),
        task: new FormControl(data?.task || null),
        date: new FormControl(null),
        priority: new FormControl(data?.priopity || null),
        tags: new FormControl(data?.tags || []),
        authorId: 1,
        checked: false
      })
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should data be add data onInit', () => {
    component.editData = null;
    fixture.detectChanges();

    component.ngOnInit();
    expect(component.category.value).toBeNull();
    expect(component.task.value).toBeNull();
    expect(component.priority.value).toBeNull();
    expect(component.tagsList.value).toEqual([]);
  });

  it('should change data to edit data onInit', () => {
    component.editData = todoMock;
    fixture.detectChanges();
  
    component.ngOnInit();
    expect(component.dialogTitle).toBe('Edit Todo');
    expect(component.actionBtn).toBe('Save');
    expect(component.category.value).toBe('work');
    expect(component.task.value).toBe('Some task');
    expect(component.priority.value).toBe('low');
    expect(component.tagsList.value).toEqual(['test']);
  });
});
