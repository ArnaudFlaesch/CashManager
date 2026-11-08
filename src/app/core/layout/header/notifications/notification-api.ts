import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "@environments/environment";
import { AppNotification } from "./notification";
import { Page } from "@shared/page";

@Service()
export class NotificationApi {
  private readonly http = inject(HttpClient);
  private readonly notificationsUrl = `${environment.backend_url}/notifications`;

  public getNotifications(): Observable<Page<AppNotification>> {
    return this.http.get<Page<AppNotification>>(this.notificationsUrl);
  }

  public markNotificationAsRead(notificationIds: number[]): Observable<AppNotification[]> {
    return this.http.put<AppNotification[]>(`${this.notificationsUrl}/read`, {
      notificationIds
    });
  }
}
