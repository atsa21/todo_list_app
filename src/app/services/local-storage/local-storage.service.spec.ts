import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  const localStoreMock = {
    getItem: (key: any) => {
      return key in localStorage ? localStorage[key] : null;
    },
    setItem: (key: string, value: string) => {
      localStorage[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete localStorage[key];
    },
    clear: () => {
      localStorage.clear();
    }
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: localStorage, useValue: localStoreMock}
      ]
    });
    service = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    localStoreMock.clear();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get userId', () => {
    const userId = service.getUserId();
    expect(userId).toBeNull();
  });

  it('should set items to local storage', () => {
    const spy = spyOn(localStorage, 'setItem').and.callFake(localStoreMock.setItem);
    service.setUserId('id');
    expect(spy).toHaveBeenCalledWith('userId', 'id');
    service.setEmail('test@gmail.com');
    expect(spy).toHaveBeenCalledWith('email', 'test@gmail.com');
    service.setToken('true');
    expect(spy).toHaveBeenCalledWith('token', 'true');
  });

  it('should remove items from local storage', () => {
    const spy = spyOn(localStorage, 'removeItem').and.callFake(localStoreMock.removeItem);
    service.removeUserId();
    expect(spy).toHaveBeenCalledWith('userId');
    service.removeEmail();
    expect(spy).toHaveBeenCalledWith('email');
    service.removeToken();
    expect(spy).toHaveBeenCalledWith('token');
  });

  it('should remove items from local storage', () => {
    const spy = spyOn(localStorage, 'clear');
    service.removeAll();
    expect(spy).toHaveBeenCalled();
  });

});
