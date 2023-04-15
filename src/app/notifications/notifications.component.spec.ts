import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  createComponentFactory,
  createHttpFactory,
  HttpMethod,
  Spectator,
  SpectatorHttp
} from '@ngneat/spectator/jest';
import { startOfYesterday } from 'date-fns';

import { IPage } from '../../app/model/IPage';
import { environment } from '../../environments/environment';
import { INotification, NotificationTypeEnum } from '../model/INotification';
import { ErrorHandlerService } from '../services/error.handler.service';
import { NotificationService } from '../services/notification.service/NotificationService';
import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
  let spectator: Spectator<NotificationsComponent>;
  let notificationsService: SpectatorHttp<NotificationService>;

  const createComponent = createComponentFactory({
    component: NotificationsComponent,
    imports: [MatSnackBarModule, MatMenuModule],
    providers: [ErrorHandlerService],
    schemas: []
  });
  const createHttp = createHttpFactory(NotificationService);

  const notificationDate = new Date();
  const notificationsData = {
    content: [
      {
        id: 1,
        message: 'username: Connexion utilisateur',
        notificationType: NotificationTypeEnum.WARN,
        notificationDate: notificationDate.toString(),
        isRead: false
      },
      {
        id: 2,
        message: 'username: Action user',
        notificationType: NotificationTypeEnum.INFO,
        notificationDate: notificationDate.toString(),
        isRead: false
      },
      {
        id: 3,
        message: 'username: Action user',
        notificationType: NotificationTypeEnum.INFO,
        notificationDate: startOfYesterday(),
        isRead: true
      }
    ],
    totalPages: 1,
    totalElements: 3,
    last: true,
    size: 1,
    number: 0
  } as IPage<INotification>;

  beforeEach(() => {
    spectator = createComponent();
    notificationsService = createHttp();
  });

  it('should create component and get notifications', () => {
    const notificationsRequest = notificationsService.expectOne(
      environment.backend_url + '/notifications/',
      HttpMethod.GET
    );
    notificationsRequest.flush(notificationsData);

    expect(spectator.component.notificationsFromDatabase).toEqual(
      notificationsData.content
    );
    expect(
      spectator.component.notificationsToDisplay[0].notificationTypeToDisplay
    ).toEqual('warning');
    expect(
      spectator.component.notificationsToDisplay[1].notificationTypeToDisplay
    ).toEqual('info');
    expect(
      spectator.component.notificationsToDisplay[1].notificationTypeToDisplay
    ).toEqual('info');
    expect(spectator.component.unreadNotificationsForBadge).toEqual('2');
  });

  it('Should mark all notifications as read', () => {
    const notificationsRequest = notificationsService.expectOne(
      environment.backend_url + '/notifications/',
      HttpMethod.GET
    );
    notificationsRequest.flush(notificationsData);

    spectator.component.markAllNotificationsAsRead(new Event('click'));

    const markNotificationAsReadRequest = notificationsService.expectOne(
      environment.backend_url + '/notifications/markNotificationAsRead',
      HttpMethod.PUT
    );
    const updatedNotificationsData = notificationsData.content.map((notif) => {
      return { ...notif, ...{ isRead: true } };
    });
    markNotificationAsReadRequest.flush(updatedNotificationsData);

    expect(spectator.component.unreadNotificationsForBadge).toEqual('');
  });
});
