import { Injectable, inject } from '@angular/core';
import { Database, listVal } from '@angular/fire/database';
import { ref, push, set, update } from 'firebase/database';
import { Auth } from '@angular/fire/auth';
import { UserModel } from '@core/models';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private db = inject(Database);
  private auth = inject(Auth);
  private localStoreService = inject(LocalStorageService);

  public getUser(): Observable<UserModel[]> {
    const id = this.auth.currentUser?.uid ?? this.localStoreService.getUserId();
    if (!id) return of([]);
    return listVal<UserModel>(ref(this.db, `users/${id}`), { keyField: 'key' });
  }

  public createUser(user: UserModel): Promise<void> {
    const id = this.auth.currentUser?.uid;
    const newPostKey = push(ref(this.db, 'users')).key;
    return set(ref(this.db, `users/${id}/${newPostKey}`), {
      key: newPostKey,
      userId: id,
      username: user.username,
      email: user.email,
      profile_photo: ''
    });
  }

  public updateUser(user: UserModel): Promise<void> {
    if (typeof user.key == 'string') {
      const id = localStorage.getItem('userId');
      return update(ref(this.db, `users/${id}/${user.key}`), user as any);
    } else {
      return Promise.reject('Invalid user key');
    }
  }
}
