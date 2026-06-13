import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Database, listVal } from '@angular/fire/database';
import { ref, push, set, update } from 'firebase/database';
import { Auth } from '@angular/fire/auth';
import { UserModel } from '@core/models';
import { LocalStorageService } from '@core/services/local-storage.service';
import { Observable, of } from 'rxjs';
import { listValRaw } from '@core/utils/list-val-raw';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private db = inject(Database);
  private auth = inject(Auth);
  private localStoreService = inject(LocalStorageService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public getUser(uid?: string): Observable<UserModel[]> {
    if (!this.isBrowser) return of([]);
    const id = uid ?? this.auth.currentUser?.uid ?? this.localStoreService.getUserId();
    if (!id) return of([]);
    return listValRaw<UserModel>(ref(this.db, `users/${id}`), 'key');
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
      const id = localStorage.getItem('uid');
      return update(ref(this.db, `users/${id}/${user.key}`), user as any);
    } else {
      return Promise.reject('Invalid user key');
    }
  }
}
