import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '@core/services/auth/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    serviceStub = {};
    guard = new AuthGuard(serviceStub as AuthService, routerSpy);
  });

  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let serviceStub: Partial<AuthService>;

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
