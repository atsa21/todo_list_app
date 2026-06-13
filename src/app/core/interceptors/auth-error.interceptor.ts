import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LocalStorageService } from '@core/services/local-storage.service';

const TOKEN_KEY = 'auth_token';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error?.error?.errors?.[0]?.message === 'USER_NOT_FOUND') {
        localStorageService.removeAll();
        router.navigate(['/login']);
      }

      if (error.status === 401) {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
        }

        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
  );
};
