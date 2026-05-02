import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    standalone: false
})
export class PageNotFoundComponent {
  public options: AnimationOptions = {
    path: '/assets/animation/nowish.json'
  };
}
