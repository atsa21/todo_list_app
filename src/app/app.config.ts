import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter } from '@angular/router';
import { authErrorInterceptor } from './core/interceptors/auth-error.interceptor';
import { routes } from './app.routes';
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { getDatabase } from 'firebase/database';
import { provideDatabase } from '@angular/fire/database';
import { getAuth } from 'firebase/auth';
import { provideAuth } from '@angular/fire/auth';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

const firebaseApp = initializeApp(environment.firebase);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authErrorInterceptor])),
    provideFirebaseApp(() => firebaseApp),
    provideDatabase(() => getDatabase(firebaseApp)),
    provideAuth(() => getAuth(firebaseApp)),
    provideLottieOptions({
      player: () => player,
    }),
    provideCacheableAnimationLoader(),
    provideNativeDateAdapter(),
  ]
};
