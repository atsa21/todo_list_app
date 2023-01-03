import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabase, AngularFireDatabaseModule, AngularFireList, snapshotChanges } from '@angular/fire/compat/database';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TodoService } from 'src/app/services/todo.service';

import { MainpageComponent } from './mainpage.component';

describe('MainpageComponent', () => {
  let component: MainpageComponent;
  let fixture: ComponentFixture<MainpageComponent>;

  const todoServiceMock = jasmine.createSpyObj('todoService', ['getAllTodo', 'getTodoByCategory', 'updateTodo', 'deleteTodo']);
  const localStorServiceMock = jasmine.createSpyObj('localStorService', ['getItem']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainpageComponent ],
      imports: [MatDialogModule],
      providers: [
        { provide: TodoService, useValue: todoServiceMock },
        { provide: LocalStorageService, useValue: localStorServiceMock },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
