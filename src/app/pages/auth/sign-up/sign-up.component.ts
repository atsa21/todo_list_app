import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { UserModel } from '@core/models';
import { Patterns } from 'src/assets/patterns/patterns';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { inject } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit {
  public signUpForm?: FormGroup;
  public hide = signal(true);

  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name:     new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern(Patterns.NamePattern)]),
      email:    new FormControl('', [Validators.required, Validators.maxLength(62), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(128), Validators.pattern(Patterns.PasswordPattern)]),
    });
  }

  get name(): FormControl     { return this.signUpForm!.get('name') as FormControl; }
  get email(): FormControl    { return this.signUpForm!.get('email') as FormControl; }
  get password(): FormControl { return this.signUpForm!.get('password') as FormControl; }

  public signUp(): void {
    if (this.signUpForm?.valid) {
      const user = new UserModel();
      user.username = this.signUpForm.value.name;
      user.email    = this.signUpForm.value.email;
      this.auth.signUp(this.signUpForm.value.email, this.signUpForm.value.password, user);
    }
  }
}
