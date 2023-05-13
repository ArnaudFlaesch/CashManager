export interface INotification {
  id: number;
  message: string;
  notificationDate: string;
  notificationType: NotificationTypeEnum;
  isRead: boolean;
}

export interface INotificationToDisplay extends INotification {
  notificationDateToDisplay: string;
  notificationTypeToDisplay: string;
}

export enum NotificationTypeEnum {
  INFO = 'INFO',
  WARN = 'WARN'
}
