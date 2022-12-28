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
  totalTasks: number = 0;
  todoRef: AngularFireList<Todo>;

  constructor(
    private db: AngularFireDatabase
  ) {
    const userId = localStorage.getItem('userId');
    this.todoRef = db.list(`todoList/${userId}/data`);
  }

  getAllTodo(): AngularFireList<Todo> {
    const userId = localStorage.getItem('userId');
    this.todoRef = this.db.list(`todoList/${userId}/data`);
    return this.todoRef;
  }

  getTodoByCategory(category: string): Observable<any> {
    const userId = localStorage.getItem('userId');
    const dbRef = this.db.database.ref(`todoList/${userId}/data`);
    const todo: Object[] = [];

    dbRef.orderByChild('category').equalTo(category).on("child_added", function(snapshot) {
      todo.push(snapshot.val());
    });
    return of(todo);
  }

  createTodo(todo: Todo, userId: string | null) {
    if(todo.date && typeof userId === 'string') {
      const db = getDatabase();
      const newPostKey = push(child(ref(db), 'todoList')).key;
      set(ref(db, 'todoList/' + userId + '/data/' + newPostKey), {
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

  setTotalTodo(todo: any) {
    this.totalTasks = todo;
  }
}
