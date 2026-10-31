import { Component, computed, DestroyRef, inject } from "@angular/core";
import { rxResource, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { isToday } from "date-fns";
import { catchError, map, of } from "rxjs";

import { INotification, INotificationToDisplay, NotificationTypeEnum } from "@model/INotification";
import { ErrorHandlerService } from "@services/error.handler.service";
import { NotificationService } from "@services/notification.service/NotificationService";
import { DateFormatPipe } from "../../pipes/date-format.pipe";
import { MatBadge } from "@angular/material/badge";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { MatTooltip } from "@angular/material/tooltip";
import { MatIconButton } from "@angular/material/button";

const ERROR_MARKING_NOTIFICATION_AS_READ = "Erreur lors du traitement de la requête.";

const NOTIFICATION_TYPE_ICONS: Record<NotificationTypeEnum, string> = {
  [NotificationTypeEnum.INFO]: "info",
  [NotificationTypeEnum.WARN]: "warning"
};

@Component({
  selector: "cash-manager-notifications",
  templateUrl: "./notifications.component.html",
  styleUrl: "./notifications.component.scss",
  imports: [MatTooltip, MatMenuTrigger, MatIcon, MatBadge, MatMenu, MatIconButton, DateFormatPipe]
})
export class NotificationsComponent {
  public readonly notifications = rxResource({
    stream: () =>
      this.notificationService.getNotifications().pipe(
        map((page) => page.content),
        catchError(() => of([]))
      ),
    defaultValue: [] as INotification[]
  });
  public readonly notificationsToDisplay = computed<INotificationToDisplay[]>(() =>
    this.notifications.value().map((notification) => ({
      ...notification,
      notificationDateToDisplay: computeDateToDisplay(notification.notificationDate),
      notificationTypeToDisplay: NOTIFICATION_TYPE_ICONS[notification.notificationType]
    }))
  );
  public readonly unreadNotificationsForBadge = computed(() => {
    const unreadCount = this.notifications.value().filter((notif) => !notif.isRead).length;
    return unreadCount > 0 ? unreadCount.toString() : "";
  });

  private readonly notificationService = inject(NotificationService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly destroyRef = inject(DestroyRef);

  public markNotificationAsRead(notificationId: number, event: Event): void {
    event.stopPropagation();
    this.markNotificationsAsRead([notificationId]);
  }

  public markAllNotificationsAsRead(event: Event): void {
    event.stopPropagation();
    this.markNotificationsAsRead(this.notifications.value().map((notif) => notif.id));
  }

  private markNotificationsAsRead(notificationIds: number[]): void {
    this.notificationService
      .markNotificationAsRead(notificationIds)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedNotifications) => {
          const updatedIds = new Set(updatedNotifications.map((notif) => notif.id));
          this.notifications.value.update((notifications) =>
            [
              ...notifications.filter((notification) => !updatedIds.has(notification.id)),
              ...updatedNotifications
            ].sort(
              (notifA, notifB) =>
                Date.parse(notifB.notificationDate) - Date.parse(notifA.notificationDate)
            )
          );
        },
        error: (error) =>
          this.errorHandlerService.handleError(error, ERROR_MARKING_NOTIFICATION_AS_READ)
      });
  }
}

function computeDateToDisplay(date: string): string {
  const parsedDate = new Date(date);
  return isToday(parsedDate)
    ? parsedDate.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })
    : parsedDate.toLocaleString("fr", { day: "2-digit", month: "2-digit" });
}
