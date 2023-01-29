import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { map } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User = {};
  public edit: boolean = false;

  profileForm = new FormGroup ({
    username: new FormControl(this.user.username, [Validators.required, Validators.pattern(Patterns.NamePattern)]),
    email: new FormControl(this.user.email, [Validators.required, Validators.email]),
    photo: new FormControl('')
  });

  constructor(
    private userService: UsersService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService.getUser().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.user = data[0];
      this.username?.setValue(this.user.username);
      this.email?.setValue(this.user.email);
    });
  }

  get username(){
    return this.profileForm.get('username');
  }

  get email(){
    return this.profileForm.get('email');
  }

  submit(): void {

  }

}
