import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { isToday } from 'date-fns';
import { Subject } from 'rxjs';

import {
  INotification,
  INotificationToDisplay,
  NotificationTypeEnum
} from '../model/INotification';
import { ErrorHandlerService } from '../services/error.handler.service';
import { NotificationService } from '../services/notification.service/NotificationService';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { NgClass } from '@angular/common';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMiniFabButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
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
export class NotificationsComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private errorHandlerService = inject(ErrorHandlerService);

  public notificationsFromDatabase: INotification[] = [];
  public notificationsToDisplay: INotificationToDisplay[] = [];
  public unreadNotificationsForBadge = '';
  public notificationTypeEnum = NotificationTypeEnum;

  private destroy$: Subject<unknown> = new Subject();

  private ERROR_MARKING_NOTIFICATION_AS_READ =
    'Erreur lors du traitement de la requête.';

  ngOnInit(): void {
    this.fetchNotificationsFromDatabase();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  public markNotificationAsRead(notificationId: number, event: Event): void {
    event.stopPropagation();
    this.markNotificationsAsRead([notificationId]);
  }

  public markAllNotificationsAsRead(event: Event): void {
    event.stopPropagation();
    this.markNotificationsAsRead(
      this.notificationsFromDatabase.map((notif) => notif.id)
    );
  }

  private markNotificationsAsRead(notificationIds: number[]): void {
    this.notificationService.markNotificationAsRead(notificationIds).subscribe({
      next: (updatedNotifications) => {
        this.notificationsFromDatabase = this.notificationsFromDatabase.filter(
          (notification) =>
            !updatedNotifications
              .map((notif) => notif.id)
              .includes(notification.id)
        );
        this.notificationsFromDatabase = [
          ...this.notificationsFromDatabase,
          ...updatedNotifications
        ].sort((timeA, timeB) => {
          if (timeA === timeB) return 0;
          return (
            Date.parse(timeB.notificationDate) -
            Date.parse(timeA.notificationDate)
          );
        });
        this.computeNotificationsToDisplay();
      },
      error: (error) =>
        this.errorHandlerService.handleError(
          error,
          this.ERROR_MARKING_NOTIFICATION_AS_READ
        )
    });
  }

  private fetchNotificationsFromDatabase(): void {
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.notificationsFromDatabase = notifications.content;
        this.computeNotificationsToDisplay();
      }
    });
  }

  private computeNotificationsToDisplay(): void {
    this.notificationsToDisplay = this.notificationsFromDatabase.map(
      (notification) => {
        return {
          ...notification,
          ...{
            notificationDateToDisplay: this.computeDateToDisplay(
              notification.notificationDate
            ),
            notificationTypeToDisplay: this.computeTypeToDisplay(
              notification.notificationType
            )
          }
        };
      }
    );
    this.unreadNotificationsForBadge = this.computeUnreadNotificationsBadge();
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

  private computeUnreadNotificationsBadge(): string {
    const unreadNotificationsCount = this.notificationsFromDatabase.filter(
      (notif) => !notif.isRead
    ).length;
    return unreadNotificationsCount > 0
      ? unreadNotificationsCount.toString()
      : '';
  }
}
