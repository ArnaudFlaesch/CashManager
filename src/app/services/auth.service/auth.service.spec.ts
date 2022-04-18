import { IJWTResponse } from './../../model/IUser';
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp
} from '@ngneat/spectator/jest';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

describe('ApiService tests', () => {
  let spectator: SpectatorHttp<AuthService>;
  const createSpectator = createHttpFactory({
    service: AuthService
  });

  const expectedUserData: IJWTResponse = {
    accessToken: 'access_token',
    id: 2,
    email: 'admin@email.com',
    roles: ['ROLE_ADMIN'],
    tokenType: 'Bearer'
  };

  const loginPath = '/auth/login';

  beforeEach(() => (spectator = createSpectator()));

  it('Should send user data and disconnect him', () => {
    spectator.service
      .login('login', 'password')
      .subscribe((response) => expect(response).toEqual(expectedUserData));

    const request = spectator.expectOne(
      environment.backend_url + loginPath,
      HttpMethod.POST
    );
    request.flush(expectedUserData);

    expect(localStorage.getItem('user')).toBeTruthy();
    spectator.service.logout();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('Should not send anything', () => {
    spectator.service
      .login('login', 'password')
      .subscribe((response) => expect(response).toBeNull());
    const request = spectator.expectOne(
      environment.backend_url + loginPath,
      HttpMethod.POST
    );
    request.flush(null);
  });

  it('Should fail to parse token', () => {
    const userData: Record<string, unknown> = {
      accessToken: 'access_token'
    };
    localStorage.setItem('user', JSON.stringify(userData));
    expect(spectator.service.userHasValidToken()).toBe(false);
  });
});
