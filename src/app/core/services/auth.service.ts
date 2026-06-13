import { Injectable, Injector, PLATFORM_ID, inject, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {
  Auth,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { UserModel } from '@core/models';
import { SnackBarService } from './snack-bar.service';
import { UsersService } from './users.service';
import { CategoryService } from './category.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(Injector);
  private router = inject(Router);
  private snackbar = inject(SnackBarService);
  private userService = inject(UsersService);
  private categoryService = inject(CategoryService);
  private localStorService = inject(LocalStorageService);

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public login(email: string, password: string): void {
    runInInjectionContext(this.injector, () => signInWithEmailAndPassword(this.auth, email, password)).then(
      userCredential => {
        this.cacheSession(userCredential);
        this.router.navigate(['/main']);
      },
      () => {
        this.snackbar.openSnackBar(
          'Please check whether your email address or password is entered correctly',
          'error',
          'Close',
        );
        this.router.navigate(['/login']);
      },
    );
  }

  public loginWithGoogle(): void {
    if (!this.isBrowser) {
      return;
    } else {
      runInInjectionContext(this.injector, () => signInWithPopup(this.auth, new GoogleAuthProvider()))
        .then(userCredential => this.cacheSession(userCredential))
        .then(userCredential => {
          const user = userCredential.user;
          const isNewUser = getAdditionalUserInfo(userCredential)?.isNewUser;

          if (isNewUser) {
            const newUser = new UserModel();
            newUser.username = user.displayName ?? '';
            newUser.email = user.email ?? '';
            this.userService.createUser(newUser);
            this.categoryService.seedDefaultCategories(user.uid);
          }

          this.router.navigate(['/main']);
        })
        .catch(error => {
          if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
            return;
          }

          this.snackbar.openSnackBar(this.googleErrorMessage(error?.code), 'error', 'Close');
        });
    }
  }

  public signUp(email: string, password: string, user: UserModel): void {
    runInInjectionContext(this.injector, () => createUserWithEmailAndPassword(this.auth, email, password)).then(
      userCredential => {
        this.userService.createUser(user);
        this.categoryService.seedDefaultCategories(userCredential.user.uid);
        this.login(email, password);
        this.snackbar.openSnackBar('Sign Up Successful', 'success', 'Close');
      },
      () => {
        this.snackbar.openSnackBar('Something went wrong', 'error', 'Close');
        this.router.navigate(['/sign_up']);
      },
    );
  }

  public logOut(): void {
    runInInjectionContext(this.injector, () => signOut(this.auth)).then(
      () => {
        this.localStorService.removeAll();
        this.router.navigate(['/login']);
      },
      () => {
        this.snackbar.openSnackBar('Error while log out', 'error', 'Close');
      },
    );
  }

  public isLoggedIn(): boolean {
    return this.isBrowser && !!this.localStorService.getToken();
  }

  private async cacheSession(credential: UserCredential): Promise<UserCredential> {
    const token = await credential.user.getIdToken();

    if (typeof localStorage !== 'undefined') {
      this.localStorService.setToken(token);
      this.localStorService.setUserId(credential.user.uid);
    }

    return credential;
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
}
