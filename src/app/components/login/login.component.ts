import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup ({
    email : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(
    private formBuilder : FormBuilder,
    private auth : AuthService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
  }

  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }


  login(){
    if(typeof this.loginForm.value.email === 'string' && typeof this.loginForm.value.password === 'string'){
      this.auth.login(this.loginForm.value.email, this.loginForm.value.password);
      this.api.postUser(this.loginForm.value);
    }
  }
}
