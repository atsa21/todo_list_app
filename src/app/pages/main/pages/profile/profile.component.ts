import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { take } from 'rxjs';
import { UserModel } from '@core/models';
import { Todo } from '@core/models/todo.model';
import { Wish } from '@core/models/wish.model';
import { UsersService } from '@core/services/users/users.service';
import { TodoService } from '@core/services/todo/todo.service';
import { WishListService } from '@core/services/wish-list/wish-list.service';
import { AuthService } from '@core/services/auth/auth.service';
import { SnackBarService } from '@core/services/snack-bar/snack-bar.service';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { InputDirective } from '@shared/directives';
import { ProfileFormService } from './services/profile-form.service';

interface Preferences {
  emailNotifications: boolean;
  pushReminders: boolean;
  weeklyDigest: boolean;
  publicWishList: boolean;
}

type PrefKey = keyof Preferences;

interface StatTile {
  icon: string;
  tint: 'cyan' | 'lavender' | 'peach';
  value: number;
  suffix: string;
  label: string;
}

interface PrefRow {
  key: PrefKey;
  title: string;
  description: string;
}

const PREFS_DEFAULT: Preferences = {
  emailNotifications: true,
  pushReminders: true,
  weeklyDigest: false,
  publicWishList: true,
};

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, ImageCropperComponent, LoaderComponent, InputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProfileFormService],
})
export class ProfileComponent implements OnInit {
  public profileForm?: FormGroup;
  public todayDate = new Date();

  public imageChangedEvent: any = '';
  public croppedImage = '';
  public photoEditorOpen = signal(false);

  public readonly prefRows: PrefRow[] = [
    { key: 'emailNotifications', title: 'Email notifications', description: 'Reminders and summaries to your inbox' },
    { key: 'pushReminders', title: 'Push reminders', description: 'Nudge me when a task is due' },
    { key: 'weeklyDigest', title: 'Weekly digest', description: 'A recap of what you got done' },
    { key: 'publicWishList', title: 'Public wish list', description: 'Let others view your wish list' },
  ];

  private user = signal<UserModel | null>(null);
  private todos = signal<Todo[]>([]);
  private wishes = signal<Wish[]>([]);
  public preferences = signal<Preferences>({ ...PREFS_DEFAULT });

  public loaded = computed(() => this.user() !== null);
  public username = computed(() => this.user()?.username ?? '');
  public email = computed(() => this.user()?.email ?? '');
  public initial = computed(() => (this.username().charAt(0) || '?').toUpperCase());
  public photo = computed(() => this.user()?.profile_photo ?? '');

  private completed = computed(() => this.todos().filter((t) => t.checked).length);
  private active = computed(() => this.todos().filter((t) => !t.checked).length);
  private completionRate = computed(() => {
    const total = this.todos().length;
    return total ? Math.round((this.completed() / total) * 100) : 0;
  });

  public stats = computed<StatTile[]>(() => [
    { icon: 'fa-circle-check', tint: 'cyan', value: this.completed(), suffix: '', label: 'Tasks completed' },
    { icon: 'fa-list-check', tint: 'lavender', value: this.active(), suffix: '', label: 'Active tasks' },
    { icon: 'fa-gift', tint: 'peach', value: this.wishes().length, suffix: '', label: 'Wishes saved' },
    { icon: 'fa-bullseye', tint: 'cyan', value: this.completionRate(), suffix: '%', label: 'Completion rate' },
  ]);

  private usersService = inject(UsersService);
  private todoService = inject(TodoService);
  private wishService = inject(WishListService);
  private profileFormService = inject(ProfileFormService);
  private snackbar = inject(SnackBarService);
  private auth = inject(AuthService);
  private localStore = inject(LocalStorageService);
  private destroyRef = inject(DestroyRef);

  public get usernameControl(): FormControl {
    return this.profileForm?.get('username') as FormControl;
  }

  public get profilePhoto(): FormControl {
    return this.profileForm?.get('profile_photo') as FormControl;
  }

  public get key(): FormControl {
    return this.profileForm?.get('key') as FormControl;
  }

  ngOnInit(): void {
    this.preferences.set(this.loadPreferences());

    this.usersService
      .getUser()
      .pipe(take(1))
      .subscribe((data) => {
        const user = data[0] ?? null;
        this.user.set(user);
        if (user) {
          this.profileForm = this.profileFormService.createForm(user);
        }
      });

    this.todoService
      .getAllTodo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => this.todos.set(data));

    this.wishService
      .getWish()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => this.wishes.set(data));
  }

  public togglePhotoEditor(): void {
    this.photoEditorOpen.update((open) => !open);
  }

  public fileChangeEvent(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const valid = file && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
    valid
      ? (this.imageChangedEvent = event)
      : this.snackbar.openSnackBar('Invalid image format', 'error', 'Close');
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64 ?? '';
  }

  public loadImageFailed(): void {
    this.snackbar.openSnackBar('Load image is failed', 'error', 'Close');
  }

  public deletePhoto(): void {
    this.imageChangedEvent = '';
    this.croppedImage = '';
    this.profilePhoto.setValue('');
  }

  public toggle(key: PrefKey): void {
    this.preferences.update((prefs) => {
      const next = { ...prefs, [key]: !prefs[key] };
      this.savePreferences(next);
      return next;
    });
  }

  public submit(): void {
    if (!this.profileForm?.valid) {
      return;
    }

    this.key.setValue(this.user()?.key);
    if (this.croppedImage) {
      this.profilePhoto.setValue(this.croppedImage);
    }

    this.usersService.updateUser(this.profileForm.value).then(() => {
      this.user.update((user) => (user ? { ...user, ...this.profileForm!.value } : user));
      this.imageChangedEvent = '';
      this.croppedImage = '';
      this.photoEditorOpen.set(false);
      this.snackbar.openSnackBar('Profile was updated', 'success', 'Close');
    });
  }

  public logOut(): void {
    this.auth.logOut();
  }

  private prefsStorageKey(): string {
    return `taskly:prefs:${this.localStore.getUserId() ?? 'anon'}`;
  }

  private loadPreferences(): Preferences {
    try {
      const raw = localStorage.getItem(this.prefsStorageKey());
      return raw ? { ...PREFS_DEFAULT, ...(JSON.parse(raw) as Partial<Preferences>) } : { ...PREFS_DEFAULT };
    } catch {
      return { ...PREFS_DEFAULT };
    }
  }

  private savePreferences(prefs: Preferences): void {
    localStorage.setItem(this.prefsStorageKey(), JSON.stringify(prefs));
  }
}
