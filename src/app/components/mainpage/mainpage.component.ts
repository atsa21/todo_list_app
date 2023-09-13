import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {

  public user: any;

  constructor(
    private userService: UsersService
  ){}

  ngOnInit(): void {
    this.getUser();
  }

  private getUser(): void {
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

}
