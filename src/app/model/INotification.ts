export type INotification = {
  id: number;
  message: string;
  notificationDate: string;
  notificationType: NotificationTypeEnum;
  isRead: boolean;
};

export type INotificationToDisplay = INotification & {
  notificationDateToDisplay: string;
  notificationTypeToDisplay: string;
};

export enum NotificationTypeEnum {
  INFO = "INFO",
  WARN = "WARN"
}
