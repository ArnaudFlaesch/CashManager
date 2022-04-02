import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../../..//app/model/IUser';
import { environment } from '../../../environments/environment';
interface IJwt {
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  private headers = {
    'Content-type': 'application/json'
  };

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

  public userHasValidToken(): boolean {
    const authenticatedUser = this.getCurrentUserData();
    let result = false;
    if (authenticatedUser && authenticatedUser.accessToken) {
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
