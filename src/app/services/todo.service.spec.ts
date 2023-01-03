import { TestBed } from '@angular/core/testing';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import {Observable, of } from 'rxjs';

import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  
  let fireDatabaseMock = { list(query: string): any {
    return {
        valueChanges() {
            return of([
                {
                    date: 12345,
                    name: 'Hello World'
                },
                {
                    date: 456779,
                    name: 'Hola Mundo'
                }
            ])
        }
    }
}};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireDatabase, useValue: fireDatabaseMock }
      ]
    });
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
