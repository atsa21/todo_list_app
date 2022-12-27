import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { getAuth } from 'firebase/auth';
import { child, get, getDatabase, ref, set } from "firebase/database";
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todo: any;
  totalTasks: number = 0;
  tutorialsRef: AngularFireList<Todo>;

  constructor(private db: AngularFireDatabase) {
    const userId = localStorage.getItem('userId');
    this.getAllTodo(userId);
    this.tutorialsRef = db.list(`todoList/${userId}/data`);
  }

  getAllTodo(userId: string | null): any {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `todoList/${userId}/data`)).then((res) => {
      this.todo = res.val();
      this.totalTasks = this.todo.length;
      this.userTodo();
    }).catch((error) => {
      console.error(error);
    });
  }

  getAll(): AngularFireList<Todo> {
    return this.tutorialsRef;
  }

  userTodo() {
    return this.todo;
  }

  createTodo(todo: Todo, userId: string | null): void {
    if(todo.date && typeof userId === 'string') {
      const db = getDatabase();
      set(ref(db, 'todoList/' + userId + '/data/' + this.totalTasks ), {
        category: todo.category,
        task: todo.task,
        date: todo.date.toString(),
        tags: todo.tags,
        checked: false,
        authorId: userId,
      });
    }
  }
}
