import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
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
    provideFirebaseApp(() => firebaseApp),
    provideDatabase(() => getDatabase(firebaseApp)),
    provideAuth(() => getAuth(firebaseApp)),
    provideLottieOptions({
      player: () => player,
    }),
    provideCacheableAnimationLoader(),
  ]
};
