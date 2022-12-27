import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { child, get, getDatabase, ref, set } from "firebase/database";
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todo: any;
  totalTasks: number = 0;

  constructor() {
    const userId = localStorage.getItem('userId');
    this.getAllTodo(userId);
  }

  getAllTodo(userId: string | null): any {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `todoList/${userId}/data`)).then((res) => {
      this.todo = res.val();
      this.totalTasks = this.todo.length;
    }).catch((error) => {
      console.error(error);
    });
  }

  createTodo(todo: Todo, userId: string | null): void {
    const db = getDatabase();
    set(ref(db, 'todoList/' + userId + '/data/' + this.totalTasks ), {
      category: todo.category,
      task: todo.task,
      date: todo.date,
      tags: todo.tags,
      checked: false,
      authorId: userId,
    });
  }
}
