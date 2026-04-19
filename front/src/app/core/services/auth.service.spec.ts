import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isAuthenticated() should be false initially', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('login() should store token and set isAuthenticated to true', () => {
    service.login({ identifier: 'alice@test.com', password: 'Password1!' }).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ token: 'jwt-token' });
    expect(service.isAuthenticated()).toBe(true);
    expect(localStorage.getItem('mdd_token')).toBe('jwt-token');
  });

  it('register() should store token and set isAuthenticated to true', () => {
    service.register({ username: 'alice', email: 'alice@test.com', password: 'Password1!' }).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/auth/register`);
    req.flush({ token: 'jwt-token' });
    expect(service.isAuthenticated()).toBe(true);
  });

  it('logout() should clear token and set isAuthenticated to false', () => {
    service.login({ identifier: 'alice@test.com', password: 'Password1!' }).subscribe();
    http.expectOne(`${environment.apiUrl}/auth/login`).flush({ token: 'jwt-token' });
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('mdd_token')).toBeNull();
  });

  it('getToken() should return stored token', () => {
    service.login({ identifier: 'alice@test.com', password: 'Password1!' }).subscribe();
    http.expectOne(`${environment.apiUrl}/auth/login`).flush({ token: 'my-token' });
    expect(service.getToken()).toBe('my-token');
  });
});
