import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wish-list-page',
  templateUrl: './wish-list-page.component.html',
  styleUrls: ['./wish-list-page.component.scss']
})
export class WishListPageComponent implements OnInit {

  public wishList = [
    { name: 'USD AEON 60 EQT - PINK', price: 299.99 , image: 'https://hedonskate.com/media/cache/usd-aeon-60-eqt-pink-5ae60da4d7c98938742fece6a6ca5b90.jpg' , link: 'https://hedonskate.com/p/skates-1/usd-284/usd-aeon-60-eqt-pink-187078?category%5B0%5D=1&filter-category-95%5B0%5D=aggressive-738&apply=true&category%5B0%5D=1&filter-category-95%5B0%5D=aggressive-738&page=8#.Y92Br3bP1PZ'},
    { name: 'USD AEON 60 EQT - PINK', price: 299.99 , image: 'https://hedonskate.com/media/cache/usd-aeon-60-eqt-pink-5ae60da4d7c98938742fece6a6ca5b90.jpg' , link: 'https://hedonskate.com/p/skates-1/usd-284/usd-aeon-60-eqt-pink-187078?category%5B0%5D=1&filter-category-95%5B0%5D=aggressive-738&apply=true&category%5B0%5D=1&filter-category-95%5B0%5D=aggressive-738&page=8#.Y92Br3bP1PZ'},
    { name: 'USD AEON 60 EQT - PINK', price: 299.99 , image: 'https://hedonskate.com/media/cache/usd-aeon-60-eqt-pink-5ae60da4d7c98938742fece6a6ca5b90.jpg' , link: 'https://hedonskate.com/p/skates-1/usd-284/usd-aeon-60-eqt-pink-187078?category%5B0%5D=1&filter-category-95%5B0%5D=aggressive-738&apply=true&category%5B0%5D=1&filter-category-95%5B0%5D=aggressive-738&page=8#.Y92Br3bP1PZ'},
    { name: 'USD AEON 60 EQT - PINK', price: 299.99 , image: 'https://hedonskate.com/media/cache/usd-aeon-60-eqt-pink-5ae60da4d7c98938742fece6a6ca5b90.jpg' , link: 'https://hedonskate.com/p/skates-1/usd-284/usd-aeon-60-eqt-pink-187078?category%5B0%5D=1&filter-category-95%5B0%5D=aggressive-738&apply=true&category%5B0%5D=1&filter-category-95%5B0%5D=aggressive-738&page=8#.Y92Br3bP1PZ'},
    { name: 'USD AEON 60 EQT - PINK', price: 299.99 , image: 'https://hedonskate.com/media/cache/usd-aeon-60-eqt-pink-5ae60da4d7c98938742fece6a6ca5b90.jpg' , link: 'https://hedonskate.com/p/skates-1/usd-284/usd-aeon-60-eqt-pink-187078?category%5B0%5D=1&filter-category-95%5B0%5D=aggressive-738&apply=true&category%5B0%5D=1&filter-category-95%5B0%5D=aggressive-738&page=8#.Y92Br3bP1PZ'},
    { name: 'USD AEON 60 EQT - PINK', price: 299.99 , image: 'https://hedonskate.com/media/cache/usd-aeon-60-eqt-pink-5ae60da4d7c98938742fece6a6ca5b90.jpg' , link: 'https://hedonskate.com/p/skates-1/usd-284/usd-aeon-60-eqt-pink-187078?category%5B0%5D=1&filter-category-95%5B0%5D=aggressive-738&apply=true&category%5B0%5D=1&filter-category-95%5B0%5D=aggressive-738&page=8#.Y92Br3bP1PZ'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
