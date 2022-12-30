import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { child, getDatabase, orderByChild, push, query, ref, set } from "firebase/database";
import { Observable, of } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todo: any;
  todoRef: AngularFireList<Todo>;
  userId: any;
  url: string;

  constructor(
    private db: AngularFireDatabase,
    private http: HttpClient
  ) {
    this.userId = localStorage.getItem('userId');
    this.todoRef = db.list(`todoList/${this.userId}/data`);
    this.url = "https://todo-list-app-45cf7-default-rtdb.europe-west1.firebasedatabase.app";
  }

  getAllTodo(): AngularFireList<Todo> {
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
      const newPostKey = push(child(ref(db), `todoList/${this.userId}/data`)).key;
      set(ref(db, 'todoList/' + this.userId + '/data/' + newPostKey), {
        key: newPostKey,
        category: todo.category,
        task: todo.task,
        date: todo.date.toString(),
        priority: todo.priority,
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
