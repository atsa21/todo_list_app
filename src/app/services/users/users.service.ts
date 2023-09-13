import { Injectable } from '@angular/core';
import { child, getDatabase, push, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { User } from '../../models/user.model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  id: any;

  constructor(
    private db: AngularFireDatabase,
    private localStoreService: LocalStorageService) {
  }

  getUser(): AngularFireList<User> {
    this.id = this.localStoreService.getUserId();
    const userRef: AngularFireList<User> = this.db.list(`users/${this.id}`);
    return userRef;
  }

  createUser(user: User): Promise<void> {
    const db = getDatabase();
    const auth = getAuth();
    const id = auth.currentUser?.uid;
    const newPostKey = push(child(ref(db), 'users')).key;
    return set(ref(db, 'users/' + id + '/' + newPostKey), {
      key: newPostKey,
      userId: id,
      username: user.username,
      email: user.email,
      profile_photo: ''
    });
  }

  updateUser(user: User): Promise<void> {
    if(typeof user.key == 'string') {
      const id = localStorage.getItem('userId');
      const todoRef: AngularFireList<User> = this.db.list(`users/${id}`);
      return todoRef.update(user.key, user);
    } else {
      return Promise.reject('Invalid user key');
    }
  }
}
