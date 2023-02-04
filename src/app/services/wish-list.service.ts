import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Wish } from '../models/wish.model';
import { Observable, of } from 'rxjs';
import { child, getDatabase, push, ref, set } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  wish: any;
  userId: any;

  constructor(
    private db: AngularFireDatabase
  ) {
  }

  getUserId(): void {
    this.userId = localStorage.getItem('userId');
  }

  getWish(): AngularFireList<Wish> {
    this.getUserId();
    const wishRef: AngularFireList<Wish> = this.db.list(`wishList/${this.userId}/data`);
    return wishRef;
  }

  createWish(wish: Wish) {
    this.getUserId();
    const db = getDatabase();
    const newPostKey = push(child(ref(db), `wishList/${this.userId}/data`)).key;
    set(ref(db, 'wishList/' + this.userId + '/data/' + newPostKey), {
      key: newPostKey,
      name: wish.name,
      price: wish.price,
      image: wish.image,
      link: wish.link
    });
  }

  updateWish(wish: Wish, key: string): Promise<void> {
    this.getUserId();
    const wishRef: AngularFireList<Wish> = this.db.list(`wishList/${this.userId}/data`);
    return wishRef.update(key, wish);
  }

  deleteWish(key: any): Promise<void> {
    this.getUserId();
    const wishRef: AngularFireList<Wish> = this.db.list(`wishList/${this.userId}/data`);
    return wishRef.remove(key);
  }

  deleteAllWish(): Promise<void> {
    this.getUserId();
    const wishRef: AngularFireList<Wish> = this.db.list(`wishList/${this.userId}/data`);
    return wishRef.remove();
  }
}
