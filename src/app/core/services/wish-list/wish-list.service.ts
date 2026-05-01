import { Injectable, inject } from '@angular/core';
import { Database, listVal } from '@angular/fire/database';
import { ref, push, set, update, remove } from 'firebase/database';
import { Wish } from '../../models/wish.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  private db = inject(Database);
  userId: any;

  getUserId(): void {
    this.userId = localStorage.getItem('userId');
  }

  getWish(): Observable<Wish[]> {
    this.getUserId();
    return listVal<Wish>(ref(this.db, `wishList/${this.userId}/data`), { keyField: 'key' });
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
      image: wish.image,
      link: wish.link
    });
  }

  updateWish(wish: Wish, key: string): Promise<void> {
    this.getUserId();
    return update(ref(this.db, `wishList/${this.userId}/data/${key}`), wish as any);
  }

  deleteWish(key: any): Promise<void> {
    this.getUserId();
    return remove(ref(this.db, `wishList/${this.userId}/data/${key}`));
  }
}
