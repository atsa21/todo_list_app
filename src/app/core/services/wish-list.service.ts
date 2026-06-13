import { Injectable, inject } from '@angular/core';
import { Database } from '@angular/fire/database';
import { ref, push, set, remove } from 'firebase/database';
import { Wish } from '../models/wish.model';
import { Observable } from 'rxjs';
import { listValRaw } from '@core/utils';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  public userId: string | null = null;
  private db = inject(Database);

  getUserId(): void {
    this.userId = localStorage.getItem('uid');
  }

  getWish(): Observable<Wish[]> {
    this.getUserId();
    return listValRaw<Wish>(ref(this.db, `wishList/${this.userId}/data`));
  }

  createWish(wish: Wish): void {
    this.getUserId();
    const listRef = ref(this.db, `wishList/${this.userId}/data`);
    const newPostKey = push(listRef).key;
    set(ref(this.db, `wishList/${this.userId}/data/${newPostKey}`), {
      key: newPostKey,
      title: wish.title,
      price: wish.price,
      currency: wish.currency,
      image: wish.image ?? null,
      link: wish.link ?? null
    });
  }

  updateWish(wish: Wish, key: string): Promise<void> {
    this.getUserId();
    return set(ref(this.db, `wishList/${this.userId}/data/${key}`), wish as any);
  }

  deleteWish(key: any): Promise<void> {
    this.getUserId();
    return remove(ref(this.db, `wishList/${this.userId}/data/${key}`));
  }
}
