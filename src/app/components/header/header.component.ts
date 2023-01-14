import { Component, AfterViewInit } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {

  public user: any = [];

  constructor(
    private auth: AuthService,
    private userService: UsersService
  ) { }

  ngAfterViewInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getUser().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.user = data[0];
    });
  }

  logOut() {
    this.auth.logOut();
  }

}
