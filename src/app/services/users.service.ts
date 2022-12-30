import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { child, get, getDatabase, push, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { User } from '../models/user.model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  userRef: AngularFireList<User>;

  constructor(private db: AngularFireDatabase) {
    const userId = localStorage.getItem('userId');
    this.userRef = db.list(`users/${userId}`);
  }

  getUser(): AngularFireList<User> {
    const userId = localStorage.getItem('userId');
    this.userRef = this.db.list(`users/${userId}`);
    return this.userRef;
  }

  createUser(user: User): void {
    const db = getDatabase();
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const newPostKey = push(child(ref(db), 'users')).key;
    set(ref(db, 'users/' + userId + '/' + newPostKey), {
      key: newPostKey,
      username: user.name,
      email: user.email,
      profile_picture : ''
    });
  }
}
