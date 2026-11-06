import { Component, input, output } from "@angular/core";
import { MatBadge } from "@angular/material/badge";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { MatTooltip } from "@angular/material/tooltip";
import {
  NotificationToDisplay,
  NotificationType
} from "@core/layout/header/notifications/notification";
import { DateFormatPipe } from "@shared/date-format-pipe";

@Component({
  selector: "cash-manager-notifications-list",
  templateUrl: "./notifications-list.html",
  styleUrl: "./notifications-list.scss",
  imports: [MatTooltip, MatIcon, MatIconButton, MatMenuTrigger, MatBadge, MatMenu, DateFormatPipe]
})
export class NotificationsList {
  public readonly notificationsList = input.required<NotificationToDisplay[]>();
  public readonly unreadNotificationsForBadge = input<number>(0);
  public readonly notificationRead = output<number>();
  public readonly allNotificationsRead = output();

  protected readonly labels = {
    notifications: "Notifications",
    markAllAsRead: "Marquer tout comme lu",
    markAsRead: "Marquer comme lu"
  };

  protected readonly NotificationType = NotificationType;

  protected markNotificationAsRead(notificationId: number, event: Event): void {
    // Keeps the menu open
    event.stopPropagation();
    this.notificationRead.emit(notificationId);
  }

  protected markAllNotificationsAsRead(event: Event): void {
    // Keeps the menu open
    event.stopPropagation();
    this.allNotificationsRead.emit();
  }
}
