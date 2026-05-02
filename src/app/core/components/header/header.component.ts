import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { NAV_LIST } from '@core/constants';
import { UserModel } from '@core/models';
import { AuthService } from '@core/services/auth/auth.service';
import { NavigationList } from 'src/app/core/models/navigation-list';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class HeaderComponent {
  public user = input<UserModel | null>();
  public currentPage: string = '';
  public navList: NavigationList[] = NAV_LIST;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.currentPage = this.router.url;
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.currentPage = this.router.url;
      });
  }

  logOut(): void {
    this.auth.logOut();
  }
}
