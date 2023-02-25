import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { LocalStorageService } from './local-storage.service';
import { SnackBarService } from './snack-bar.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userId: string = '';

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private snackbar: SnackBarService,
    private userService: UsersService,
    private localStorService: LocalStorageService
  ) { }

  login(email: string, password: string): void {
    this.fireAuth.signInWithEmailAndPassword(email, password)
    .then(() => {
      this.localStorService.setToken('true');
      this.localStorService.setEmail(email);
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userId = user.uid;
          this.localStorService.setUserId(this.userId);
        }
        this.router.navigate(['/mainpage/todo']);
      });
    }, err => {
      this.snackbar.openSnackBar(err.message, 'Close');
      this.router.navigate(['/login']);
    })
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  signUp(email: string, password: string, user: any): void {
    this.fireAuth.createUserWithEmailAndPassword(email, password)
    .then (() => {
      this.userService.createUser(user);
      this.snackbar.openSnackBar('Sign Up Successfull', 'Close');
      this.router.navigate(['/login']);
    }, err => {
      this.snackbar.openSnackBar(err.message, 'Close');
      this.router.navigate(['/signup']);
    })
  }

  logOut(): void {
    this.fireAuth.signOut()
    .then (() => {
      this.localStorService.removeAll();
      this.router.navigate(['/login']);
    }, err => {
      this.snackbar.openSnackBar('Error while log out', 'Close');
    })
  }
}
