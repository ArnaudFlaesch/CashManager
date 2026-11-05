import { Component, computed, DestroyRef, inject } from "@angular/core";
import { rxResource, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { isToday } from "date-fns";
import { catchError, map, of } from "rxjs";

import { INotification, INotificationToDisplay, NotificationTypeEnum } from "./notification.model";
import { ErrorHandlerService } from "@core/error-handler.service";
import { NotificationService } from "./notification.service";
import { NotificationsListComponent } from "./notifications-list/notifications-list.component";

@Component({
  selector: "cash-manager-notifications",
  templateUrl: "./notifications.component.html",
  imports: [NotificationsListComponent]
})
export class NotificationsComponent {
  private readonly NOTIFICATION_TYPE_ICONS: Record<NotificationTypeEnum, string> = {
    [NotificationTypeEnum.INFO]: "info",
    [NotificationTypeEnum.WARN]: "warning"
  };

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
      notificationDateToDisplay: this.computeDateToDisplay(notification.notificationDate),
      notificationTypeToDisplay: this.NOTIFICATION_TYPE_ICONS[notification.notificationType]
    }))
  );
  public readonly unreadNotificationsForBadge = computed(
    () => this.notifications.value().filter((notification) => !notification.isRead).length
  );

  private readonly notificationService = inject(NotificationService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ERROR_MARKING_NOTIFICATION_AS_READ = "Erreur lors du traitement de la requête.";

  public markNotificationAsRead(notificationId: number): void {
    this.markNotificationsAsRead([notificationId]);
  }

  public markAllNotificationsAsRead(): void {
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
          this.errorHandlerService.handleError(error, this.ERROR_MARKING_NOTIFICATION_AS_READ)
      });
  }

  private computeDateToDisplay(date: string): string {
    const parsedDate = new Date(date);
    return isToday(parsedDate)
      ? parsedDate.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })
      : parsedDate.toLocaleString("fr", { day: "2-digit", month: "2-digit" });
  }
}
