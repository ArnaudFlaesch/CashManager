import { HttpErrorResponse } from "@angular/common/http";
import { Component, computed, DestroyRef, inject } from "@angular/core";
import { rxResource, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { isToday } from "date-fns";
import { catchError, map, of } from "rxjs";

import { AppNotification, NotificationToDisplay, NotificationType } from "./notification";
import { HttpErrorHandler } from "@core/http-error-handler";
import { NotificationApi } from "./notification-api";
import { NotificationsList } from "./notifications-list/notifications-list";

@Component({
  selector: "cash-manager-notifications",
  templateUrl: "./notifications.html",
  imports: [NotificationsList]
})
export class Notifications {
  private readonly notificationApi = inject(NotificationApi);
  private readonly httpErrorHandler = inject(HttpErrorHandler);
  private readonly destroyRef = inject(DestroyRef);

  private readonly labels = {
    errors: {
      markingNotificationAsRead: "Erreur lors du traitement de la requête."
    }
  };

  private readonly NOTIFICATION_TYPE_ICONS: Record<NotificationType, string> = {
    [NotificationType.INFO]: "info",
    [NotificationType.WARN]: "warning"
  };

  protected readonly notifications = rxResource({
    stream: () =>
      this.notificationApi.getNotifications().pipe(
        map((page) => page.content),
        catchError(() => of([]))
      ),
    defaultValue: [] as AppNotification[]
  });
  protected readonly notificationsToDisplay = computed<NotificationToDisplay[]>(() =>
    this.notifications.value().map((notification) => ({
      ...notification,
      notificationDateToDisplay: this.computeDateToDisplay(notification.notificationDate),
      notificationTypeToDisplay: this.NOTIFICATION_TYPE_ICONS[notification.notificationType]
    }))
  );
  protected readonly unreadNotificationsForBadge = computed(
    () => this.notifications.value().filter((notification) => !notification.isRead).length
  );

  protected markNotificationAsRead(notificationId: number): void {
    this.markNotificationsAsRead([notificationId]);
  }

  protected markAllNotificationsAsRead(): void {
    this.markNotificationsAsRead(this.notifications.value().map((notif) => notif.id));
  }

  private markNotificationsAsRead(notificationIds: number[]): void {
    this.notificationApi
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
        error: (error: HttpErrorResponse) => {
          this.httpErrorHandler.handleError(error, this.labels.errors.markingNotificationAsRead);
        }
      });
  }

  private computeDateToDisplay(date: string): string {
    const parsedDate = new Date(date);
    return isToday(parsedDate)
      ? parsedDate.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })
      : parsedDate.toLocaleString("fr", { day: "2-digit", month: "2-digit" });
  }
}
