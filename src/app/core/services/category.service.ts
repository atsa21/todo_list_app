import { inject, Injectable } from '@angular/core';
import { Database } from '@angular/fire/database';
import { get, ref, set } from 'firebase/database';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category } from '@core/models/category.model';
import { TODO_CATEGORIES } from '@core/constants/todo-categories.const';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private db = inject(Database);

  private getUserId(): string | null {
    return localStorage.getItem('uid');
  }

  getCategories(): Observable<Category[]> {
    const userId = this.getUserId();
    return from(get(ref(this.db, `todoList/${userId}/categories`))).pipe(
      map(snapshot => {
        if (!snapshot.exists()) return TODO_CATEGORIES;
        const val = snapshot.val();
        return Array.isArray(val) ? val : (Object.values(val) as Category[]);
      }),
      catchError(() => of(TODO_CATEGORIES)),
    );
  }

  saveCategories(categories: Category[]): Promise<void> {
    const userId = this.getUserId();
    return set(ref(this.db, `todoList/${userId}/categories`), categories);
  }

  seedDefaultCategories(userId: string): Promise<void> {
    return set(ref(this.db, `todoList/${userId}/categories`), TODO_CATEGORIES);
  }
}
