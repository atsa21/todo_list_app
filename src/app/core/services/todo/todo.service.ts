import { inject, Injectable } from '@angular/core';
import { Database } from '@angular/fire/database';
import { ref, query, orderByChild, equalTo, push, set, remove } from 'firebase/database';
import { Observable } from 'rxjs';
import { Todo } from '@core/models/todo.model';
import { listValRaw } from '@core/utils';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  public userId: string | null = null;
  private db = inject(Database);

  getUserId(): void {
    this.userId = localStorage.getItem('userId');
  }

  getAllTodo(): Observable<Todo[]> {
    this.getUserId();
    return listValRaw<Todo>(ref(this.db, `todoList/${this.userId}/data`));
  }

  getTodoByCategory(category: string): Observable<Todo[]> {
    this.getUserId();
    const q = query(ref(this.db, `todoList/${this.userId}/data`), orderByChild('category'), equalTo(category));
    return listValRaw<Todo>(q);
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
    return set(ref(this.db, `todoList/${this.userId}/data/${key}`), todo as any);
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
