import { ErrorHandlerService } from './../services/error.handler.service';
import { AuthService } from './../services/auth.service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createComponentFactory,
  createHttpFactory,
  HttpMethod,
  Spectator,
  SpectatorHttp
} from '@ngneat/spectator/jest';
import { LoginComponent } from './login.component';
import { environment } from '../../environments/environment';

describe('LoginComponent', () => {
  let spectator: Spectator<LoginComponent>;
  let authService: SpectatorHttp<AuthService>;

  const createComponent = createComponentFactory({
    component: LoginComponent,
    imports: [HttpClientModule, FormsModule, MatSnackBarModule, RouterTestingModule],
    providers: [AuthService, ErrorHandlerService]
  });
  const createHttp = createHttpFactory(AuthService);

  beforeEach(() => {
    spectator = createComponent();
    authService = createHttp();
  });

  it('Should display the title', () => {
    spectator.fixture.detectChanges();
    expect(spectator.query('h1')?.textContent).toEqual('Dash');
  });

  it('Should prevent login', () => {
    const loginSpy = jest.spyOn(authService.service, 'login');
    expect(spectator.component.inputUsername).toBe('');
    expect(spectator.component.inputPassword).toBe('');
    spectator.component.handleLogin();
    expect(loginSpy).toBeCalledTimes(0);
    spectator.fixture.detectChanges();
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
    const loginSpy = jest.spyOn(authService.service, 'login');
    spectator.component.inputUsername = 'username';
    spectator.component.inputPassword = 'password';
    spectator.component.handleLogin();
    const request = authService.expectOne(environment.backend_url + '/auth/login', HttpMethod.POST);
    request.flush(userData);
    spectator.fixture.detectChanges();
    expect(loginSpy).toHaveBeenCalledWith('username', 'password');
  });
});
