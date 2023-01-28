import { Injectable } from '@angular/core';
import { child, getDatabase, push, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { User } from '../models/user.model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  id: any;

  constructor(private db: AngularFireDatabase) {
  }

  getUser(): AngularFireList<User> {
    this.id = localStorage.getItem('userId');
    const userRef: AngularFireList<User> = this.db.list(`users/${this.id}`);
    return userRef;
  }

  createUser(user: User): void {
    const db = getDatabase();
    const auth = getAuth();
    const id = auth.currentUser?.uid;
    const newPostKey = push(child(ref(db), 'users')).key;
    set(ref(db, 'users/' + id + '/' + newPostKey), {
      key: newPostKey,
      userId: id,
      username: user.username,
      email: user.email,
      profile_photo: ''
    });
  }
}
