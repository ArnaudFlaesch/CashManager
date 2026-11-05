import { HttpClient } from "@angular/common/http";
import { computed, inject, Service, signal } from "@angular/core";
import { Observable, tap } from "rxjs";

import { environment } from "@environments/environment";
import { IJwt } from "@model/IJwt";
import { IUser } from "@model/IUser";
import { RoleEnum } from "@model/RoleEnum";

@Service()
export class AuthService {
  private readonly USER_STORAGE_KEY = "user";

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
            localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
            this.currentUser.set(user);
          }
        })
      );
  }

  public logout(): void {
    localStorage.removeItem(this.USER_STORAGE_KEY);
    this.currentUser.set(null);
  }

  /** Token of the logged in user, read from the storage as it can be removed outside of this service. */
  public getAccessToken(): string | undefined {
    return this.readStoredUser()?.accessToken || undefined;
  }

  public userHasValidToken(): boolean {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return false;
    }
    try {
      return Date.now() < this.decodeJwtPayload(accessToken).exp * 1000;
    } catch {
      return false;
    }
  }

  /** Reads the payload of a JWT, without verifying it. Throws if the token is malformed. */
  private decodeJwtPayload(token: string): IJwt {
    const payload = token.split(".")[1];
    if (!payload) {
      throw new Error("Invalid token");
    }
    // The payload is encoded in base64url
    return JSON.parse(atob(payload.replaceAll("-", "+").replaceAll("_", "/")));
  }

  /** User saved in the storage, null when there is none or when the entry is corrupted. */
  private readStoredUser(): IUser | null {
    const userData = localStorage.getItem(this.USER_STORAGE_KEY);
    try {
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }
}
