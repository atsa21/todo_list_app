import { ChangeDetectorRef, Component, Input, AfterViewInit } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {

  @Input() user: any;

  constructor(
    private auth: AuthService,
    private userService: UsersService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  logOut() {
    this.auth.logOut();
  }

}
