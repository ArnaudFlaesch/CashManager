import { HttpClient } from "@angular/common/http";
import { computed, inject, Service, signal } from "@angular/core";
import { Observable, tap } from "rxjs";

import { jwtDecode } from "jwt-decode";
import { environment } from "../../../environments/environment";
import { RoleEnum } from "@model/RoleEnum";
import { IUser } from "@model/User";

interface IJwt {
  sub: string;
  iat: number;
  exp: number;
}

const USER_LOCALSTORAGE_KEY = "user";

@Service()
export class AuthService {
  public readonly isUserAdmin = computed(
    () => this.currentUser()?.roles.includes(RoleEnum.ROLE_ADMIN) ?? false
  );

  private readonly http = inject(HttpClient);
  private readonly currentUser = signal<IUser | null>(this.readStoredUser());

  public login(username: string, password: string): Observable<IUser> {
    return this.http
      .post<IUser>(`${environment.backend_url}/auth/login`, { username, password })
      .pipe(
        tap((user) => {
          if (user.accessToken) {
            localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(user));
            this.currentUser.set(user);
          }
        })
      );
  }

  public logout(): void {
    localStorage.removeItem(USER_LOCALSTORAGE_KEY);
    this.currentUser.set(null);
  }

  public userHasValidToken(): boolean {
    const accessToken = this.readStoredUser()?.accessToken;
    if (!accessToken) {
      return false;
    }
    try {
      return Date.now() < jwtDecode<IJwt>(accessToken).exp * 1000;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  private readStoredUser(): IUser | null {
    const userData = localStorage.getItem(USER_LOCALSTORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
