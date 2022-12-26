import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { child, get, getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() {}

  getCurrentUser(userId: string): void {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  createUser(user: User): void {
    const db = getDatabase();
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    set(ref(db, 'users/' + userId), {
      username: user.name,
      email: user.email,
      profile_picture : ''
    });
  }

  // update(id: string, value: any): Promise<void> {
  //   return this.usersRef.update(id, value);
  // }

  // delete(id: string): Promise<void> {
  //   return this.usersRef.remove(id);
  // }

  // deleteAll(): Promise<void> {
  //   return this.usersRef.remove();
  // }

}
