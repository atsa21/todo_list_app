import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { SnackBarService } from '../snack-bar/snack-bar.service';
import { UsersService } from '../users/users.service';
import { CategoryService } from '../category/category.service';
import { Auth, createUserWithEmailAndPassword, getAdditionalUserInfo, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(Injector);

  constructor(
    private router: Router,
    private snackbar: SnackBarService,
    private userService: UsersService,
    private categoryService: CategoryService,
    private localStorService: LocalStorageService
  ) { }

  public login(email: string, password: string): void {
    runInInjectionContext(this.injector, () => signInWithEmailAndPassword(this.auth, email, password))
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

  public loginWithGoogle(): void {
    const provider = new GoogleAuthProvider();
    runInInjectionContext(this.injector, () => signInWithPopup(this.auth, provider))
      .then((userCredential) => {
        if(!userCredential) {
          return
        }

        const user = userCredential.user;
        const isNewUser = getAdditionalUserInfo(userCredential)?.isNewUser;

        this.localStorService.setToken('true');
        this.localStorService.setUserId(user.uid);
        if (user.email) {
          this.localStorService.setEmail(user.email);
        }

        if (isNewUser) {
          this.userService.createUser({
            username: user.displayName ?? '',
            email: user.email ?? '',
          });
          this.categoryService.seedDefaultCategories(user.uid);
        }

        this.router.navigate(['/main']);
      }, (error) => {
        console.error('Google sign-in failed:', error?.code, error);

        if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
          return;
        }

        const message = this.googleErrorMessage(error?.code);
        this.snackbar.openSnackBar(message, 'error', 'Close');
      });
  }

  private googleErrorMessage(code: string | undefined): string {
    switch (code) {
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled for this app. Enable the Google provider in Firebase Authentication.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for Google sign-in. Add it to the authorized domains in Firebase Authentication.';
      case 'auth/popup-blocked':
        return 'The sign-in popup was blocked by the browser. Please allow popups and try again.';
      default:
        return 'Could not sign in with Google. Please try again.';
    }
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public signUp(email: string, password: string, user: any): void {
    runInInjectionContext(this.injector, () => createUserWithEmailAndPassword(this.auth, email, password))
    .then ((userCredential) => {
      this.userService.createUser(user);
      this.categoryService.seedDefaultCategories(userCredential.user.uid);
      this.login(email, password);
      this.snackbar.openSnackBar('Sign Up Successfull', 'success', 'Close');
    }, () => {
      this.snackbar.openSnackBar('Something went wrong', 'error', 'Close');
      this.router.navigate(['/signup']);
    })
  }

  public logOut(): void {
    runInInjectionContext(this.injector, () => signOut(this.auth))
      .then (() => {
        this.localStorService.removeAll();
        this.router.navigate(['/login']);
      }, () => {
        this.snackbar.openSnackBar('Error while log out', 'error', 'Close');
      })
  }
}
