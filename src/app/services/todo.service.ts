import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { child, getDatabase, push, ref, set } from "firebase/database";
import { Observable, of } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todo: any;
  todoRef: AngularFireList<Todo>;
  userId: any;

  constructor(
    private db: AngularFireDatabase
  ) {
    this.userId = localStorage.getItem('userId');
    this.todoRef = db.list(`todoList/${this.userId}/data`);
  }

  getAllTodo(): AngularFireList<Todo> {
    this.todoRef = this.db.list(`todoList/${this.userId}/data`);
    return this.todoRef;
  }

  getTodoByCategory(category: string): Observable<any> {
    const dbRef = this.db.database.ref(`todoList/${this.userId}/data`);
    const todo: Object[] = [];

    dbRef.orderByChild('category').equalTo(category).on("child_added", function(snapshot) {
      todo.push(snapshot.val());
    });
    return of(todo);
  }

  getReadyTodo(): Observable<any> {
    const dbRef = this.db.database.ref(`todoList/${this.userId}/data`);
    const todo: Object[] = [];

    dbRef.orderByChild('checked').equalTo(true).on("child_added", function(snapshot) {
      todo.push(snapshot.val());
    });
    return of(todo);
  }

  createTodo(todo: Todo) {
    if(todo.date) {
      const db = getDatabase();
      const newPostKey = push(child(ref(db), 'todoList')).key;
      set(ref(db, 'todoList/' + this.userId + '/data/' + newPostKey), {
        key: newPostKey,
        category: todo.category,
        task: todo.task,
        date: todo.date.toString(),
        tags: todo.tags,
        checked: false,
      });
    }
  }

  updateTodo(todo: Todo, key: string): Promise<void> {
    return this.todoRef.update(key, todo);
  }

  deleteTodo(key: any): Promise<void> {
    return this.todoRef.remove(key);
  }

  deleteAllTodo(): Promise<void> {
    return this.todoRef.remove();
  }
}
