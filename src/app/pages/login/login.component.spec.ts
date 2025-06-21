import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service/auth.service';
import { ErrorHandlerService } from '../../services/error.handler.service';
import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';
import { routes } from '../../../main';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
      providers: [AuthService, ErrorHandlerService]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Should prevent login', () => {
    const loginSpy = jest.spyOn(component.authService, 'login');
    expect(component.inputUsername).toBe('');
    expect(component.inputPassword).toBe('');
    component.handleLogin();
    expect(loginSpy).toHaveBeenCalledTimes(0);
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
    const loginSpy = jest.spyOn(component.authService, 'login');
    component.inputUsername = 'username';
    component.inputPassword = 'password';
    component.handleLogin();
    const request = httpTestingController.expectOne(environment.backend_url + '/auth/login');
    request.flush(userData);
    expect(loginSpy).toHaveBeenCalledWith('username', 'password');
  });
});
