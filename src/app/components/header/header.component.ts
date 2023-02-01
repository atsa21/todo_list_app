import { ChangeDetectorRef, Component, Input, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {

  @Input() user: any;

  constructor(
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  logOut() {
    this.auth.logOut();
  }

}
