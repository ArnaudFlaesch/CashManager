import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { IUser } from './../../model/User';
import { RoleEnum } from './../../model/RoleEnum';

interface IJwt {
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  private headers = {
    'Content-type': 'application/json'
  };

  constructor(private http: HttpClient) {}

  public login(username: string, password: string): Observable<IUser> {
    return this.http
      .post<IUser>(
        `${environment.backend_url}/auth/login`,
        {
          username,
          password
        },
        {
          headers: this.headers
        }
      )
      .pipe(
        map((response) => {
          if (response.accessToken) {
            localStorage.setItem('user', JSON.stringify(response));
          }
          return response;
        })
      );
  }

  public logout(): void {
    localStorage.removeItem('user');
  }

  public getCurrentUserData(): IUser | null {
    const userData = localStorage.getItem('user');
    if (!userData) {
      return null;
    } else {
      return JSON.parse(userData);
    }
  }

  public isUserAdmin(): boolean {
    const authenticatedUser = this.getCurrentUserData();
    return authenticatedUser?.roles.includes(RoleEnum.ROLE_ADMIN) ?? false;
  }

  public userHasValidToken(): boolean {
    const authenticatedUser = this.getCurrentUserData();
    let result = false;
    if (authenticatedUser?.accessToken) {
      try {
        result =
          Date.now() <
          jwt_decode<IJwt>(authenticatedUser.accessToken).exp * 1000;
      } catch (error) {
        result = false;
      }
    }
    return result;
  }
}
