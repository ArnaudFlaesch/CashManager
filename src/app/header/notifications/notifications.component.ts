import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { isToday } from 'date-fns';

import { INotification, INotificationToDisplay, NotificationTypeEnum } from '@model/INotification';
import { ErrorHandlerService } from '@services/error.handler.service';
import { NotificationService } from '@services/notification.service/NotificationService';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { NgClass } from '@angular/common';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatMiniFabButton,
    MatTooltip,
    MatMenuTrigger,
    MatIcon,
    MatBadge,
    MatMenu,
    MatIconButton,
    NgClass,
    DateFormatPipe
  ]
})
export class NotificationsComponent implements OnInit {
  public notificationsFromDatabase = signal<INotification[]>([]);
  public notificationsToDisplay = computed<INotificationToDisplay[]>(() =>
    this.computeNotificationsToDisplay(this.notificationsFromDatabase())
  );
  public unreadNotificationsForBadge = computed(() =>
    this.computeUnreadNotificationsBadge(this.notificationsFromDatabase())
  );
  public readonly notificationTypeEnum = NotificationTypeEnum;

  private readonly ERROR_MARKING_NOTIFICATION_AS_READ = 'Erreur lors du traitement de la requête.';
  private readonly notificationService = inject(NotificationService);
  private readonly errorHandlerService = inject(ErrorHandlerService);

  public ngOnInit(): void {
    this.fetchNotificationsFromDatabase();
  }

  public markNotificationAsRead(notificationId: number, event: Event): void {
    event.stopPropagation();
    this.markNotificationsAsRead([notificationId]);
  }

  public markAllNotificationsAsRead(event: Event): void {
    event.stopPropagation();
    this.markNotificationsAsRead(this.notificationsFromDatabase().map((notif) => notif.id));
  }

  private markNotificationsAsRead(notificationIds: number[]): void {
    this.notificationService.markNotificationAsRead(notificationIds).subscribe({
      next: (updatedNotifications) => {
        this.notificationsFromDatabase.update((notifications) =>
          [
            ...notifications.filter(
              (notification) =>
                !updatedNotifications.map((notif) => notif.id).includes(notification.id)
            ),
            ...updatedNotifications
          ].sort((timeA, timeB) => {
            if (timeA === timeB) return 0;
            return Date.parse(timeB.notificationDate) - Date.parse(timeA.notificationDate);
          })
        );
      },
      error: (error) =>
        this.errorHandlerService.handleError(error, this.ERROR_MARKING_NOTIFICATION_AS_READ)
    });
  }

  private fetchNotificationsFromDatabase(): void {
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => this.notificationsFromDatabase.set(notifications.content)
    });
  }

  private computeDateToDisplay(date: string): string {
    const parsedDate = new Date(Date.parse(date));
    if (isToday(parsedDate)) {
      return parsedDate.toLocaleTimeString('fr', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return parsedDate.toLocaleString('fr', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  }

  private computeTypeToDisplay(notificationType: NotificationTypeEnum): string {
    switch (notificationType) {
      case NotificationTypeEnum.INFO:
        return 'info';
      case NotificationTypeEnum.WARN:
        return 'warning';
    }
  }

  private computeNotificationsToDisplay(
    notificationsFromDatabase: INotification[]
  ): INotificationToDisplay[] {
    return notificationsFromDatabase.map((notification) => {
      return {
        ...notification,
        ...{
          notificationDateToDisplay: this.computeDateToDisplay(notification.notificationDate),
          notificationTypeToDisplay: this.computeTypeToDisplay(notification.notificationType)
        }
      };
    });
  }

  private computeUnreadNotificationsBadge(notificationsFromDatabase: INotification[]): string {
    const unreadNotificationsCount = notificationsFromDatabase.filter(
      (notif) => !notif.isRead
    ).length;
    return unreadNotificationsCount > 0 ? unreadNotificationsCount.toString() : '';
  }
}
