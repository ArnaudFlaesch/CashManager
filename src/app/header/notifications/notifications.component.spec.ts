import { startOfYesterday } from "date-fns";

import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IPage } from "@model/IPage";
import { environment } from "../../../environments/environment";
import { INotification, NotificationTypeEnum } from "@model/INotification";
import { NotificationsComponent } from "./notifications.component";

import { provideHttpClient } from "@angular/common/http";

describe("NotificationsComponent", () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
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
    expect(component.unreadNotificationsForBadge()).toEqual("2");
  });

  it("Should mark all notifications as read", async () => {
    TestBed.tick();
    const notificationsRequest = httpTestingController.expectOne(
      environment.backend_url + "/notifications/"
    );
    notificationsRequest.flush(notificationsData);
    await fixture.whenStable();

    component.markAllNotificationsAsRead(new Event("click"));

    const markNotificationAsReadRequest = httpTestingController.expectOne(
      environment.backend_url + "/notifications/markNotificationAsRead"
    );
    const updatedNotificationsData = notificationsData.content.map((notif) => {
      return { ...notif, ...{ isRead: true } };
    });
    markNotificationAsReadRequest.flush(updatedNotificationsData);

    expect(component.unreadNotificationsForBadge()).toEqual("");
  });
});
