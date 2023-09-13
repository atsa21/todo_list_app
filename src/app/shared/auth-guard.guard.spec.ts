import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

import { AuthGuardGuard } from './auth-guard.guard';

describe('AuthGuardGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    serviceStub = {};
    guard = new AuthGuardGuard(serviceStub as AuthService, routerSpy);
  });

  let guard: AuthGuardGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let serviceStub: Partial<AuthService>;

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
