import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { child, get, getDatabase, ref, set } from "firebase/database";

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() { }

  getTodo(userId: string | null): any {
    const dbRef = ref(getDatabase());
    let data;
    get(child(dbRef, `users/${userId}`)).then((res) => {
      data = res.val();
      return data;
    }).catch((error) => {
      console.error(error);
    });
  }

  createTodo(todo: any): void {
    const db = getDatabase();
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    set(ref(db, 'todoList/' + userId), {
      category: todo.category,
      task: todo.task,
      authorId: userId
    });
  }
}
