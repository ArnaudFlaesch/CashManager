import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { environment } from "@environments/environment";
import { AppNotification, NotificationType } from "./notification";
import { Page } from "@shared/page";
import { NotificationApi } from "./notification-api";

describe("NotificationApi", () => {
  let service: NotificationApi;
  let httpTestingController: HttpTestingController;

  const notificationsUrl = `${environment.backend_url}/notifications`;
  const notification: AppNotification = {
    id: 1,
    message: "username: Connexion utilisateur",
    notificationDate: "2022-03-05T10:00:00",
    notificationType: NotificationType.INFO,
    isRead: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(NotificationApi);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("Should get the notifications", async () => {
    const page: Page<AppNotification> = {
      content: [notification],
      totalPages: 1,
      totalElements: 1,
      last: true,
      size: 1,
      number: 0
    };
    const notifications = firstValueFrom(service.getNotifications());
    httpTestingController.expectOne(notificationsUrl).flush(page);
    expect(await notifications).toEqual(page);
  });

  it("Should mark notifications as read", async () => {
    const readNotification = { ...notification, isRead: true };
    const updated = firstValueFrom(service.markNotificationAsRead([1]));
    const request = httpTestingController.expectOne(`${notificationsUrl}/read`);
    expect(request.request.method).toBe("PUT");
    expect(request.request.body).toEqual({ notificationIds: [1] });
    request.flush([readNotification]);
    expect(await updated).toEqual([readNotification]);
  });
});
