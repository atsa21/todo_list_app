import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderComponent } from '@shared/components/header/header.component';
import { UserModel } from '@core/models';
import { UsersService } from '@core/services/users/users.service';

@Component({
    selector: 'app-main',
    standalone: true,
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    imports: [RouterModule, HeaderComponent]
})
export class MainComponent {
  public user = signal<UserModel | null>(null);

  private userService = inject(UsersService);

  constructor() {
    this.userService.getUser()
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        this.user.set(data?.[0] ?? null);
      });
  }
}
