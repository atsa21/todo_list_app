import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  public setUserId(value: string): void {
    localStorage.setItem('userId', value);
  }

  public setEmail(value: string): void {
    localStorage.setItem('email', value);
  }

  public setToken(value: string): void {
    localStorage.setItem('token', value);
  }

  public removeUserId(): void {
    localStorage.removeItem('userId');
  }

  public removeEmail(): void {
    localStorage.removeItem('email');
  }

  public removeToken(): void {
    localStorage.removeItem('token');
  }

  public removeAll(): void {
    localStorage.clear();
  }
}
