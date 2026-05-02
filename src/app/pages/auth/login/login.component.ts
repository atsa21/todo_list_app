import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getFormError } from '@core/constants';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public loginForm = new FormGroup ({
    email : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  public hide = signal(true);
  public emailError = signal(getFormError(this.email));
  public passwordError = signal(getFormError(this.password));

  private auth = inject(AuthService);

  constructor() {
    this.email?.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.emailError.set(getFormError(this.email)));
    this.password?.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.passwordError.set(getFormError(this.password)));
  }

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  login(): void {
    if(typeof this.loginForm.value.email === 'string' && typeof this.loginForm.value.password === 'string'){
      this.auth.login(this.loginForm.value.email, this.loginForm.value.password);
    }
  }
}
