import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { appRouts, NAV_LIST } from '@core/constants';
import { UserModel } from '@core/models';
import { NavigationList } from 'src/app/core/models/navigation-list';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
  ],
})
export class HeaderComponent {
  public user = input<UserModel | null>();
  public currentPage: string = '';
  public navList: NavigationList[] = NAV_LIST;
  public profilePath: string = appRouts.profile.fullPath!;

  constructor(private router: Router) {
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
}
