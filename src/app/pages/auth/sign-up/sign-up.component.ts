import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth/auth.service';
import { UserModel } from '@core/models';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signUpForm?: FormGroup;
  public hide = true;

  private user: UserModel = new UserModel();

  constructor(
    private auth : AuthService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.signUpForm = this.fb.group ({
      name : new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern(Patterns.NamePattern)]),
      email : new FormControl('', [Validators.required, Validators.maxLength(62), Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(128), Validators.pattern(Patterns.PasswordPattern)])
    });
  }

  public get name(): FormControl {
    return this.signUpForm?.get('name') as FormControl;
  }

  public get email(): FormControl {
    return this.signUpForm?.get('email') as FormControl;
  }

  public get password(): FormControl {
    return this.signUpForm?.get('password') as FormControl;
  }

  public signUp(){
    if (this.signUpForm?.valid) {
      this.user.username = this.signUpForm?.value.name;
      this.user.email = this.signUpForm?.value.email;
      this.auth.signUp(this.signUpForm?.value.email, this.signUpForm?.value.password, this.user);
    }
  };

}
