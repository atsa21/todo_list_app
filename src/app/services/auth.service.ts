import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private snackbar: SnackBarService
  ) { }

  login(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password)
    .then(() => {
      localStorage.setItem('token', 'true');
      localStorage.setItem('email', email);
      this.router.navigate(['todopage'])
    }, err => {
      this.snackbar.openSnackBar('Error while login', 'Close');
      this.router.navigate(['/login']);
    })
  }

  signUp(email: string, password: string) {
    this.fireAuth.createUserWithEmailAndPassword(email, password)
    .then (() => {
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
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      this.router.navigate(['/login']);
    }, err => {
      this.snackbar.openSnackBar('Error while log out', 'Close');
    })
  }

}
