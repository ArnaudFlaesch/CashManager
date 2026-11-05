import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { environment } from "@environments/environment";
import { INotification, NotificationTypeEnum } from "./notification.model";
import { IPage } from "@shared/page.model";
import { NotificationService } from "./notification-service";

describe("NotificationService", () => {
  let service: NotificationService;
  let httpTestingController: HttpTestingController;

  const notificationsUrl = `${environment.backend_url}/notifications`;
  const notification: INotification = {
    id: 1,
    message: "username: Connexion utilisateur",
    notificationDate: "2022-03-05T10:00:00",
    notificationType: NotificationTypeEnum.INFO,
    isRead: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(NotificationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("Should get the notifications", async () => {
    const page: IPage<INotification> = {
      content: [notification],
      totalPages: 1,
      totalElements: 1,
      last: true,
      size: 1,
      number: 0
    };
    const notifications = firstValueFrom(service.getNotifications());
    httpTestingController.expectOne(`${notificationsUrl}/`).flush(page);
    expect(await notifications).toEqual(page);
  });

  it("Should mark notifications as read", async () => {
    const readNotification = { ...notification, isRead: true };
    const updated = firstValueFrom(service.markNotificationAsRead([1]));
    const request = httpTestingController.expectOne(`${notificationsUrl}/markNotificationAsRead`);
    expect(request.request.method).toEqual("PUT");
    expect(request.request.body).toEqual({ notificationIds: [1] });
    request.flush([readNotification]);
    expect(await updated).toEqual([readNotification]);
  });
});
