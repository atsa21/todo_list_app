import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { environment } from 'src/environments/environment';

import { DialogTodoComponent } from './dialog-todo.component';

describe('DialogTodoComponent', () => {
  let component: DialogTodoComponent;
  let fixture: ComponentFixture<DialogTodoComponent>;

  const todoMock = {
    category: 'low',
    task: 'Some task',
    
  };

  const dateAdapterMock = jasmine.createSpyObj('adapter', ['setLocale']);
  dateAdapterMock.setLocale = () => of('en-GB');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTodoComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: SnackBarService, useValue: {} },
        { provide: DateAdapter, useValue: dateAdapterMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.editData = todoMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
