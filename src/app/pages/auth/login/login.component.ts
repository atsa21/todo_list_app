import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getFormError } from '@core/constants';
import { ControlPipe } from '@core/pipes';
import { InputDirective } from '@shared/directives';
import { LoginFormService } from './services/login-form.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatIconModule,
    InputDirective,
    ControlPipe,
  ],
  providers: [LoginFormService, ControlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private loginFormService = inject(LoginFormService);
  private controlPipe = inject(ControlPipe);

  public loginForm = this.loginFormService.createForm();
  public hide = signal(true);
  public remember = signal(false);
  public emailError = signal(getFormError(this.control('email')));
  public passwordError = signal(getFormError(this.control('password')));

  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.control('email')
      .valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emailError.set(getFormError(this.control('email'))));

    this.control('password')
      .valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.passwordError.set(getFormError(this.control('password'))));
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.emailError.set(getFormError(this.control('email')));
      this.passwordError.set(getFormError(this.control('password')));
      return;
    }

    const { email, password } = this.loginForm.value;
    if (typeof email === 'string' && typeof password === 'string') {
      this.auth.login(email, password);
    }
  }

  loginWithGoogle(): void {
    this.auth.loginWithGoogle();
  }

  private control(name: string): FormControl {
    return this.controlPipe.transform(this.loginForm, name)
  }
}
