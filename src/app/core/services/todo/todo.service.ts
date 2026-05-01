import { Injectable, inject } from '@angular/core';
import { Database, listVal } from '@angular/fire/database';
import { ref, query, orderByChild, equalTo, push, set, update, remove } from 'firebase/database';
import { Observable } from 'rxjs';
import { Todo } from '@core/models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private db = inject(Database);
  userId: any;

  getUserId(): void {
    this.userId = localStorage.getItem('userId');
  }

  getAllTodo(): Observable<Todo[]> {
    this.getUserId();
    return listVal<Todo>(ref(this.db, `todoList/${this.userId}/data`), { keyField: 'key' });
  }

  getTodoByCategory(category: string): Observable<Todo[]> {
    this.getUserId();
    const q = query(ref(this.db, `todoList/${this.userId}/data`), orderByChild('category'), equalTo(category));
    return listVal<Todo>(q, { keyField: 'key' });
  }

  createTodo(todo: Todo): Promise<void> {
    this.getUserId();
    if (todo.date) {
      const listRef = ref(this.db, `todoList/${this.userId}/data`);
      const newPostKey = push(listRef).key;
      return set(ref(this.db, `todoList/${this.userId}/data/${newPostKey}`), {
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
    return update(ref(this.db, `todoList/${this.userId}/data/${key}`), todo as any);
  }

  deleteTodo(key: any): Promise<void> {
    this.getUserId();
    return remove(ref(this.db, `todoList/${this.userId}/data/${key}`));
  }

  deleteAllTodo(): Promise<void> {
    this.getUserId();
    return remove(ref(this.db, `todoList/${this.userId}/data`));
  }
}
