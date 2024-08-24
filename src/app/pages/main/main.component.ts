import { Component, OnInit } from '@angular/core';
import { UsersService } from '@core/services/users/users.service';
import { map } from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public user: any;

  constructor(private userService: UsersService){}

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
