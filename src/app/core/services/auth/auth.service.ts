import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { SnackBarService } from '../snack-bar/snack-bar.service';
import { UsersService } from '../users/users.service';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);

  constructor(
    private router: Router,
    private snackbar: SnackBarService,
    private userService: UsersService,
    private localStorService: LocalStorageService
  ) { }

  public login(email: string, password: string): void {
    signInWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      this.localStorService.setToken('true');
      this.localStorService.setEmail(email);

      if (userCredential) {
        this.localStorService.setUserId(userCredential.user.uid);
      }
      this.router.navigate(['/main']);
    }, () => {
      this.snackbar.openSnackBar('Please check whether your email address or password is entered correctly', 'error', 'Close');
      this.router.navigate(['/login']);
    })
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public signUp(email: string, password: string, user: any): void {
    createUserWithEmailAndPassword(this.auth, email, password)
    .then (() => {
      this.userService.createUser(user);
      this.login(email, password);
      this.snackbar.openSnackBar('Sign Up Successfull', 'success', 'Close');
    }, () => {
      this.snackbar.openSnackBar('Something went wrong', 'error', 'Close');
      this.router.navigate(['/signup']);
    })
  }

  public logOut(): void {
    signOut(this.auth)
      .then (() => {
        this.localStorService.removeAll();
        this.router.navigate(['/login']);
      }, () => {
        this.snackbar.openSnackBar('Error while log out', 'error', 'Close');
      })
  }
}
