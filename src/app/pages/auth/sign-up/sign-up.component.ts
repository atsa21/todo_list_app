import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserModel } from '@core/models';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getFormError } from '@core/constants';
import { ControlPipe } from '@core/pipes';
import { InputDirective } from '@shared/directives';
import { SignUpFormService } from './services/sign-up-form.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatIconModule,
    InputDirective,
    ControlPipe,
  ],
  providers: [SignUpFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  private signUpFormService = inject(SignUpFormService);

  public signUpForm = this.signUpFormService.createForm();

  public hide = signal(true);
  public hideConfirm = signal(true);

  public nameError = signal<string | null>(null);
  public emailError = signal<string | null>(null);
  public passwordError = signal<string | null>(null);
  public confirmError = signal<string | null>(null);

  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  get name(): FormControl { return this.signUpForm.get('name') as FormControl; }
  get email(): FormControl { return this.signUpForm.get('email') as FormControl; }
  get password(): FormControl { return this.signUpForm.get('password') as FormControl; }
  get confirmPassword(): FormControl { return this.signUpForm.get('confirmPassword') as FormControl; }

  ngOnInit(): void {
    this.subscribeChanges();
  }

  signUp(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      this.nameError.set(getFormError(this.name));
      this.emailError.set(getFormError(this.email));
      this.passwordError.set(this.getPasswordError());
      this.confirmError.set(this.getConfirmError());
      return;
    }

    const { name, email, password } = this.signUpForm.value;
    const user = new UserModel();
    user.username = name ?? '';
    user.email = email ?? '';
    this.auth.signUp(email ?? '', password ?? '', user);
  }

  loginWithGoogle(): void {
    this.auth.loginWithGoogle();
  }

  private getPasswordError(): string {
    if (this.password.errors?.['pattern']) {
      return 'Password must contain at least 1 uppercase and 1 lowercase letter and 1 number';
    }
    return getFormError(this.password);
  }

  private getConfirmError(): string {
    if (this.confirmPassword.errors?.['required']) {
      return 'This field is required';
    }
    if (this.signUpForm.errors?.['mismatch'] && this.confirmPassword.value) {
      return 'Passwords do not match';
    }
    return '';
  }

  private subscribeChanges(): void {
    this.email
      .valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emailError.set(getFormError(this.email)));

    this.password
      .valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.passwordError.set(this.getPasswordError()));

    this.name
      .valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.nameError.set(getFormError(this.name)));
    
    this.signUpForm
      .valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.confirmError.set(this.getConfirmError()));
  }
}
