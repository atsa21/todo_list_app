import { ChangeDetectorRef, Component, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationList } from 'src/app/models/navigation-list';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {

  @Input() user: any;

  public currentPage: string = '';
  public navList: NavigationList[] = [
    { name: 'Todo list', link: '/mainpage/todo', icon: 'check_circle_outline'},
    { name: 'Wish list', link: '/mainpage/wish', icon: 'favorite_border' },
    { name: 'Profile', link: '/mainpage/profile', icon: 'person_outline' }
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
