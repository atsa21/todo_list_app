import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { child, getDatabase, push, ref, set } from "firebase/database";
import { Observable, of } from 'rxjs';
import { Todo } from '../../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todo: any;
  userId: any;

  constructor(
    private db: AngularFireDatabase
  ) {
  }

  getUserId(): void {
    this.userId = localStorage.getItem('userId');
  }

  getAllTodo(): AngularFireList<Todo> {
    this.getUserId();
    const todoRef: AngularFireList<Todo> = this.db.list(`todoList/${this.userId}/data`);
    return todoRef;
  }

  getTodoByCategory(category: string): Observable<Object[]> {
    this.getUserId();
    const dbRef = this.db.database.ref(`todoList/${this.userId}/data`);
    const todo: Object[] = [];

    dbRef.orderByChild('category').equalTo(category).on("child_added", function(snapshot) {
      todo.push(snapshot.val());
    });
    return of(todo);
  }

  createTodo(todo: Todo): Promise<void> {
    this.getUserId();
    if(todo.date) {
      const db = getDatabase();
      const newPostKey = push(child(ref(db), `todoList/${this.userId}/data`)).key;
      return set(ref(db, 'todoList/' + this.userId + '/data/' + newPostKey), {
        key: newPostKey,
        category: todo.category,
        task: todo.task,
        date: todo.date.toString(),
        priority: todo.priority,
        tags: todo.tags,
        checked: false,
      });
    } else {
      return Promise.reject('Invalid todo date');
    }
  }

  updateTodo(todo: Todo, key: string): Promise<void> {
    this.getUserId();
    const todoRef: AngularFireList<Todo> = this.db.list(`todoList/${this.userId}/data`);
    return todoRef.update(key, todo);
  }

  deleteTodo(key: any): Promise<void> {
    this.getUserId();
    const todoRef: AngularFireList<Todo> = this.db.list(`todoList/${this.userId}/data`);
    return todoRef.remove(key);
  }

  deleteAllTodo(): Promise<void> {
    this.getUserId();
    const todoRef: AngularFireList<Todo> = this.db.list(`todoList/${this.userId}/data`);
    return todoRef.remove();
  }
}
