import { Injectable } from '@angular/core';
import { child, getDatabase, push, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { UserModel } from '@core/models';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private db: AngularFireDatabase,
    private localStoreService: LocalStorageService) {
  }

  public getUser(): AngularFireList<UserModel> {
    const id = this.localStoreService.getUserId();
    const userRef: AngularFireList<UserModel> = this.db.list(`users/${id}`);
    return userRef;
  }

  public createUser(user: UserModel): Promise<void> {
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

  public updateUser(user: UserModel): Promise<void> {
    if(typeof user.key == 'string') {
      const id = localStorage.getItem('userId');
      const todoRef: AngularFireList<UserModel> = this.db.list(`users/${id}`);
      return todoRef.update(user.key, user);
    } else {
      return Promise.reject('Invalid user key');
    }
  }
}
