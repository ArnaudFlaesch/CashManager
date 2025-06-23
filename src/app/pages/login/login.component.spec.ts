import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthService } from '@services/auth.service/auth.service';
import { ErrorHandlerService } from '@services/error.handler.service';
import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';
import { routes } from '../../../main';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        AuthService,
        ErrorHandlerService,
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Should prevent login', () => {
    expect(component.inputUsername).toBe('');
    expect(component.inputPassword).toBe('');
    component.handleLogin();
  });

  it('Should login', () => {
    const userData = {
      accessToken: 'accessToken',
      id: 2,
      username: 'admintest',
      email: 'admin@email.com',
      roles: ['ROLE_ADMIN'],
      tokenType: 'Bearer'
    };
    component.inputUsername = 'username';
    component.inputPassword = 'password';
    component.handleLogin();
    const request = httpTestingController.expectOne(environment.backend_url + '/auth/login');
    request.flush(userData);
  });
});
