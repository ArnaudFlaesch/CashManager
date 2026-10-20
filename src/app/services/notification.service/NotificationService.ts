import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { INotification } from "@model/INotification";
import { IPage } from "@model/IPage";

@Service()
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly notificationsUrl = `${environment.backend_url}/notifications`;

  public getNotifications(): Observable<IPage<INotification>> {
    return this.http.get<IPage<INotification>>(`${this.notificationsUrl}/`);
  }

  public markNotificationAsRead(notificationIds: number[]): Observable<INotification[]> {
    return this.http.put<INotification[]>(`${this.notificationsUrl}/markNotificationAsRead`, {
      notificationIds
    });
  }
}
