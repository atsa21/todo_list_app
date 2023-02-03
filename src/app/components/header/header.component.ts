import { ChangeDetectorRef, Component, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {

  @Input() user: any;

  public currentPage: string = '';
  public navList: any[] = [
    {name: 'Todo list', link: '/mainpage/todo'},
    {name: 'Wish list', link: '/mainpage/wish'},
    {name: 'Profile', link: '/mainpage/profile'}
  ];

  constructor(
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.currentPage = this.router.url;
    this.getPageLink();
  }

  getPageLink(): void {
    this.router.events.subscribe((val) => {
      this.currentPage = this.router.url;
    });
  }

  logOut() {
    this.auth.logOut();
  }
  
}
