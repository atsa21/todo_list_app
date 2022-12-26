import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm !: FormGroup;
  user: User = new User();

  constructor(
    private auth : AuthService,
    private userService: UsersService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.signUpForm = this.fb.group ({
      name : new FormControl('', (Validators.required)),
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  get name(){
    return this.signUpForm.get('name');
  }

  get email(){
    return this.signUpForm.get('email');
  }

  get password(){
    return this.signUpForm.get('password');
  }

  signUp(){
    if(this.signUpForm.valid){
      this.auth.signUp(this.signUpForm.value.email, this.signUpForm.value.password);
      this.user.name = this.signUpForm.get('name')?.value;
      this.user.email = this.signUpForm.get('email')?.value;
      this.userService.createUser(this.user);
    }
  };

}
