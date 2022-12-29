import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getItem(name: string): string | null {
    return localStorage.getItem(name);
  }

  setItem(name: string, value: string): void {
    localStorage.setItem(name, value);
  }

  removeItem(name: string): void {
    localStorage.removeItem(name);
  }
}
