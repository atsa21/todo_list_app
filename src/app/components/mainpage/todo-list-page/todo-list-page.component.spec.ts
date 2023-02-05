import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

import { TodoListPageComponent } from './todo-list-page.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('TodoListPageComponent', () => {
  let component: TodoListPageComponent;
  let fixture: ComponentFixture<TodoListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoListPageComponent ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule
      ],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
