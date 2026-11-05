import { startOfYesterday } from "date-fns";

import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IPage } from "@model/IPage";
import { environment } from "@environments/environment";
import { INotification, NotificationTypeEnum } from "@model/INotification";
import { NotificationsComponent } from "./notifications.component";

import { ErrorHandlerService } from "@services/error-handler.service";

describe("NotificationsComponent", () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  const notificationDate = new Date();
  const notificationsData = {
    content: [
      {
        id: 1,
        message: "username: Connexion utilisateur",
        notificationType: NotificationTypeEnum.WARN,
        notificationDate: notificationDate.toString(),
        isRead: false
      },
      {
        id: 2,
        message: "username: Action user",
        notificationType: NotificationTypeEnum.INFO,
        notificationDate: notificationDate.toString(),
        isRead: false
      },
      {
        id: 3,
        message: "username: Action user",
        notificationType: NotificationTypeEnum.INFO,
        notificationDate: startOfYesterday(),
        isRead: true
      }
    ],
    totalPages: 1,
    totalElements: 3,
    last: true,
    size: 1,
    number: 0
  } as IPage<INotification>;

  it("should create component and get notifications", async () => {
    TestBed.tick();
    const notificationsRequest = httpTestingController.expectOne(
      environment.backend_url + "/notifications/"
    );
    notificationsRequest.flush(notificationsData);
    await fixture.whenStable();

    expect(component.notifications.value()).toEqual(notificationsData.content);
    expect(component.notificationsToDisplay()[0].notificationTypeToDisplay).toEqual("warning");
    expect(component.notificationsToDisplay()[1].notificationTypeToDisplay).toEqual("info");
    expect(component.notificationsToDisplay()[1].notificationTypeToDisplay).toEqual("info");
    expect(component.unreadNotificationsForBadge()).toEqual(2);
  });

  it("Should mark all notifications as read", async () => {
    TestBed.tick();
    const notificationsRequest = httpTestingController.expectOne(
      environment.backend_url + "/notifications/"
    );
    notificationsRequest.flush(notificationsData);
    await fixture.whenStable();

    component.markAllNotificationsAsRead();

    const markNotificationAsReadRequest = httpTestingController.expectOne(
      environment.backend_url + "/notifications/markNotificationAsRead"
    );
    const updatedNotificationsData = notificationsData.content.map((notif) => {
      return { ...notif, ...{ isRead: true } };
    });
    markNotificationAsReadRequest.flush(updatedNotificationsData);

    expect(component.unreadNotificationsForBadge()).toEqual(0);
  });

  it("Should mark a notification as read and keep them sorted by date", async () => {
    TestBed.tick();
    httpTestingController
      .expectOne(environment.backend_url + "/notifications/")
      .flush(notificationsData);
    await fixture.whenStable();

    component.markNotificationAsRead(1);
    const request = httpTestingController.expectOne(
      environment.backend_url + "/notifications/markNotificationAsRead"
    );
    expect(request.request.body).toEqual({ notificationIds: [1] });
    request.flush([{ ...notificationsData.content[0], isRead: true }]);

    expect(component.unreadNotificationsForBadge()).toEqual(1);
    expect(component.notifications.value().map((notification) => notification.id)).toEqual([
      2, 1, 3
    ]);
  });

  it("Should display the time of the notifications of the day, and the date of the others", async () => {
    TestBed.tick();
    httpTestingController
      .expectOne(environment.backend_url + "/notifications/")
      .flush(notificationsData);
    await fixture.whenStable();

    const [today, , yesterday] = component.notificationsToDisplay();
    expect(today.notificationDateToDisplay).toMatch(/^\d{2}:\d{2}$/);
    expect(yesterday.notificationDateToDisplay).toMatch(/^\d{2}\/\d{2}$/);
  });

  it("Should display no notification when they cannot be loaded", async () => {
    TestBed.tick();
    httpTestingController
      .expectOne(environment.backend_url + "/notifications/")
      .flush(null, { status: 500, statusText: "Server error" });
    await fixture.whenStable();

    expect(component.notificationsToDisplay()).toEqual([]);
    expect(component.unreadNotificationsForBadge()).toEqual(0);
  });

  it("Should display an error when the notifications cannot be marked as read", async () => {
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(ErrorHandlerService), "handleError")
      .mockImplementation(() => undefined);
    TestBed.tick();
    httpTestingController
      .expectOne(environment.backend_url + "/notifications/")
      .flush(notificationsData);
    await fixture.whenStable();

    component.markAllNotificationsAsRead();
    httpTestingController
      .expectOne(environment.backend_url + "/notifications/markNotificationAsRead")
      .flush(null, { status: 500, statusText: "Server error" });

    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors du traitement de la requête."
    );
    expect(component.unreadNotificationsForBadge()).toEqual(2);
  });
});
