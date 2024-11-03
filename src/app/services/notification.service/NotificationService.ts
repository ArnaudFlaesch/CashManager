import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import authorizationBearer from '../authorizationBearer/authorizationBearer';
import { INotification } from '../../../app/model/INotification';
import { IPage } from '../../../app/model/IPage';

@Injectable()
export class NotificationService {
  private http = inject(HttpClient);

  public getNotifications(): Observable<IPage<INotification>> {
    return this.http.get<IPage<INotification>>(`${environment.backend_url}/notifications/`, {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      }
    });
  }

  public markNotificationAsRead(notificationIds: number[]): Observable<INotification[]> {
    return this.http.put<INotification[]>(
      `${environment.backend_url}/notifications/markNotificationAsRead`,
      {
        notificationIds: notificationIds
      },
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }
}
