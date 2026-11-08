import { startOfYesterday } from "date-fns";

import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Page } from "@shared/page";
import { environment } from "@environments/environment";
import { getElement, queryElement } from "@testing/dom";
import { AppNotification, NotificationType } from "./notification";
import { Notifications } from "./notifications";

import { HttpErrorHandler } from "@core/http-error-handler";

describe("Notifications", () => {
  let fixture: ComponentFixture<Notifications>;
  let httpTestingController: HttpTestingController;

  const notificationsUrl = environment.backend_url + "/notifications";
  const markAsReadUrl = environment.backend_url + "/notifications/read";

  const notificationDate = new Date();
  const notificationsData = {
    content: [
      {
        id: 1,
        message: "username: Connexion utilisateur",
        notificationType: NotificationType.WARN,
        notificationDate: notificationDate.toString(),
        isRead: false
      },
      {
        id: 2,
        message: "username: Action user",
        notificationType: NotificationType.INFO,
        notificationDate: notificationDate.toString(),
        isRead: false
      },
      {
        id: 3,
        message: "username: Action user",
        notificationType: NotificationType.INFO,
        notificationDate: startOfYesterday().toString(),
        isRead: true
      }
    ],
    totalPages: 1,
    totalElements: 3,
    last: true,
    size: 1,
    number: 0
  } satisfies Page<AppNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(Notifications);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.restoreAllMocks();
    // The menu is rendered in an overlay attached to the body
    document.querySelector(".cdk-overlay-container")?.replaceChildren();
  });

  /** Answers the request of the notifications, sent once the component is rendered. */
  async function loadNotifications(): Promise<void> {
    TestBed.tick();
    httpTestingController.expectOne(notificationsUrl).flush(notificationsData);
    await fixture.whenStable();
  }

  /** Number of unread notifications shown in the badge, null when the badge is hidden. */
  function unreadBadge(): string | null {
    return queryElement(fixture, ".mat-badge-hidden")
      ? null
      : getElement(fixture, ".mat-badge-content", HTMLElement).textContent.trim();
  }

  /** Opens the notifications menu, rendered in an overlay. */
  async function openMenu(): Promise<void> {
    getElement(fixture, "#display-notifications-button", HTMLButtonElement).click();
    await fixture.whenStable();
  }

  function displayedNotifications(): Element[] {
    return Array.from(document.querySelectorAll(".notification-container"));
  }

  function clickInMenu(selector: string): void {
    const button = document.querySelector(selector);
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error(`No button matches "${selector}"`);
    }
    button.click();
  }

  it("Should display the notifications with their type, and count the unread ones", async () => {
    await loadNotifications();
    expect(unreadBadge()).toBe("2");

    await openMenu();
    const notifications = displayedNotifications();
    expect(
      notifications.map(
        (notification) => notification.querySelector(".notification-message")?.textContent
      )
    ).toEqual(notificationsData.content.map((notification) => notification.message));
    expect(
      notifications.map(
        (notification) => notification.querySelector(".notification-type-icon")?.textContent
      )
    ).toEqual(["warning", "info", "info"]);
  });

  it("Should mark all notifications as read", async () => {
    await loadNotifications();
    await openMenu();

    clickInMenu("#mark-all-notifications-as-read-button");
    const request = httpTestingController.expectOne(markAsReadUrl);
    expect(request.request.body).toEqual({ notificationIds: [1, 2, 3] });
    request.flush(notificationsData.content.map((notif) => ({ ...notif, isRead: true })));
    await fixture.whenStable();

    expect(unreadBadge()).toBeNull();
  });

  it("Should mark a notification as read and keep them sorted by date", async () => {
    await loadNotifications();
    await openMenu();

    clickInMenu(".mark-notification-as-read-button");
    const request = httpTestingController.expectOne(markAsReadUrl);
    expect(request.request.body).toEqual({ notificationIds: [1] });
    request.flush([{ ...notificationsData.content[0], isRead: true }]);
    await fixture.whenStable();

    expect(unreadBadge()).toBe("1");
    expect(
      displayedNotifications().map(
        (notification) => notification.querySelector(".notification-type-icon")?.textContent
      )
    ).toEqual(["info", "warning", "info"]);
  });

  it("Should display the time of the notifications of the day, and the date of the others", async () => {
    await loadNotifications();
    await openMenu();

    const [today, , yesterday] = displayedNotifications().map((notification) =>
      notification.querySelector(".notification-date")?.textContent.trim()
    );
    expect(today).toMatch(/^\d{2}:\d{2}$/);
    expect(yesterday).toMatch(/^\d{2}\/\d{2}$/);
  });

  it("Should display no notification when they cannot be loaded", async () => {
    TestBed.tick();
    httpTestingController
      .expectOne(notificationsUrl)
      .flush(null, { status: 500, statusText: "Server error" });
    await fixture.whenStable();

    expect(unreadBadge()).toBeNull();
    await openMenu();
    expect(displayedNotifications()).toHaveLength(0);
  });

  it("Should display an error when the notifications cannot be marked as read", async () => {
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(HttpErrorHandler), "handleError")
      .mockImplementation(() => undefined);
    await loadNotifications();
    await openMenu();

    clickInMenu("#mark-all-notifications-as-read-button");
    httpTestingController
      .expectOne(markAsReadUrl)
      .flush(null, { status: 500, statusText: "Server error" });
    await fixture.whenStable();

    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors du traitement de la requête."
    );
    expect(unreadBadge()).toBe("2");
  });
});
