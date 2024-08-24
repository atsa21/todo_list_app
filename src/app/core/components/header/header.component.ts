import { ChangeDetectorRef, Component, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { NavigationList } from 'src/app/core/models/navigation-list';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {

  @Input() user: any;

  public currentPage: string = '';
  public navList: NavigationList[] = [
    { name: 'Todo list', link: '/main/todo', icon: 'check_circle_outline'},
    { name: 'Wish list', link: '/main/wish_list', icon: 'favorite_border' },
    { name: 'Profile', link: '/main/profile', icon: 'person_outline' }
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
