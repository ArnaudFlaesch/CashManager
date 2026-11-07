export interface AppNotification {
  id: number;
  message: string;
  notificationDate: string;
  notificationType: NotificationType;
  isRead: boolean;
}

export type NotificationToDisplay = AppNotification & {
  notificationDateToDisplay: string;
  notificationTypeToDisplay: string;
};

export enum NotificationType {
  INFO = "INFO",
  WARN = "WARN"
}
