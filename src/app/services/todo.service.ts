import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { child, getDatabase, push, ref, set } from "firebase/database";
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

  deleteTodo(): Promise<void> {
    return this.todoRef.remove();
  }

  deleteAllTodo(): Promise<void> {
    return this.todoRef.remove();
  }

  setTotalTodo(todo: any) {
    this.totalTasks = todo;
  }
}
