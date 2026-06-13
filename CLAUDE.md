# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Angular 20 single-page app for managing to-do tasks, a wish list, and a user profile, backed by Firebase (Auth + Realtime Database) and deployed to Firebase Hosting. The `master` branch is the main branch.

## Commands

- `npm start` / `ng serve` — dev server at `http://localhost:4200` (development configuration, no optimization).
- `npm run build` / `ng build` — production build (default configuration); output goes to `public/browser/` (note: not the usual `dist/`).
- `npm run watch` — incremental development build.
- `npm test` / `ng test` — Karma + Jasmine unit tests in a Chrome browser.
- Run a single spec: `ng test --include='src/app/core/services/todo/todo.service.spec.ts'` (glob also works, e.g. `--include='**/todo*.spec.ts'`).
- Deploy: `ng build` then `ng deploy` (uses `@angular/fire:deploy`, target project `todo-list-app-45cf7`) — or `firebase deploy`.

The README pins Angular CLI 14 / Node 16, but the project has since been upgraded to Angular 20 (see `package.json`); ignore the README's version instructions.

## Architecture

Standalone-component app bootstrapped from `src/app/app.config.ts` (no root `NgModule`). All providers — router, HttpClient with interceptors, Firebase app/database/auth, Lottie, Material date adapter — are registered there.

### Routing & lazy loading

Routes are split into three lazy layers:
- `src/app/app.routes.ts` — top level: `/login`, `/sign_up`, and `/main` (guarded by `AuthGuard`). Unknown paths fall through to the page-not-found module.
- `src/app/pages/main/main.routes.ts` — the authenticated shell (`MainComponent`) with children `todo`, `wish_list`, `profile`; default redirect is to `todo`.

Almost every route uses `loadComponent` / `loadChildren`. Route paths are **not** hardcoded — they come from the typed `appRouts` map in `src/app/core/constants/app-routes.ts`. Use that map (and its `fullPath` entries) rather than string literals when navigating or adding routes.

### Path alias

`@core/*` → `src/app/core/*` (defined in `tsconfig.json`). Core barrel files (`@core/constants`, `@core/models`, `@core/enums`, `@core/pipes`, `@core/utils`) re-export their contents — import from the barrel, not deep paths, where one exists.

### Firebase data model (Realtime Database)

Per-user data is keyed by the Firebase Auth `uid`, which is cached in `localStorage` (`userId`) by `AuthService` on login and read back by the data services:
- `todoList/<uid>/data/<pushKey>` — todos (`TodoService`).
- `todoList/<uid>/categories` — the user's category list (`CategoryService`); seeded with `TODO_CATEGORIES` on sign-up and falls back to that constant if absent.
- `wishList/<uid>/data/<pushKey>` — wishes (`WishListService`).
- `users/<uid>/<pushKey>` — user profile (`UsersService`).

Data services read `userId` from `localStorage` on every call (`getUserId()`), not from injected Auth state — keep that pattern when adding new reads/writes.

### Realtime reads

Live lists use the custom `listValRaw<T>()` helper in `src/app/core/utils/list-val-raw.ts`, which wraps Firebase `onValue` in an RxJS `Observable` and injects the Firebase child key as a `key` field on each item. Prefer it over `@angular/fire`'s `listVal` so the push-key is preserved (writes/deletes address records by that `key`).

### Auth

`AuthService` (`@core/services/auth/auth.service.ts`) wraps `@angular/fire/auth` email/password flows and drives navigation + snackbar feedback directly. `AuthGuard` gates `/main` purely on the presence of a `token` flag in `localStorage` (set to `'true'` on login) — it does not re-check Firebase session validity. `authErrorInterceptor` clears local storage and redirects to `/login` on a `USER_NOT_FOUND` HTTP error.

### UI conventions

- Angular Material (prebuilt `indigo-pink` theme) + CDK; global styles in `src/styles.scss` and `src/styleguide.scss`, both on the `includePaths` SCSS resolution root (`.`), so `@use`/`@import` can reference them without relative paths. Component styles default to SCSS.
- Add/edit flows are Material dialogs under `src/app/core/components/dialogs/` (`add-edit-todo`, `add-edit-wish`, `edit-categories`), each pairing a dialog component with a form service that builds its reactive form.
- Lottie animations (`ngx-lottie`) for empty/loading states; assets in `src/assets/animation/`.

## Notes

- Firebase web config in `src/environments/environment*.ts` is intentionally public (client SDK keys); access control is enforced by Realtime Database security rules, not by hiding these values.
- TypeScript is in `strict` mode with `noPropertyAccessFromIndexSignature` and Angular `strictTemplates`; writes that bypass typing use explicit `as any` casts in the data services.
