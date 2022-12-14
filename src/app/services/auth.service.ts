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

  login(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password)
    .then(() => {
      this.localStorService.setItem('token', 'true');
      this.localStorService.setItem('email', email);
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userId = user.uid;
          localStorage.setItem('userId', this.userId);
        }
        this.router.navigate(['/mainpage']);
      });
    }, err => {
      this.snackbar.openSnackBar('The email or password is incorrect. Try again', 'Close');
      this.router.navigate(['/login']);
    })
  }

  signUp(email: string, password: string, user: any) {
    this.fireAuth.createUserWithEmailAndPassword(email, password)
    .then (() => {
      this.userService.createUser(user);
      this.snackbar.openSnackBar('Sign Up Successfull', 'Close');
      this.router.navigate(['/login']);
    }, err => {
      alert (err.message);
      this.router.navigate(['/signup']);
    })
  }

  logOut() {
    this.fireAuth.signOut()
    .then (() => {
      this.localStorService.removeItem('token');
      this.localStorService.removeItem('email');
      this.localStorService.removeItem('userId');
      this.router.navigate(['/login']);
    }, err => {
      this.snackbar.openSnackBar('Error while log out', 'Close');
    })
  }

}
