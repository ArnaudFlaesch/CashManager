import { getElement, queryElement } from "@testing/dom";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  NotificationToDisplay,
  NotificationType
} from "@core/layout/header/notifications/notification";
import { NotificationsList } from "./notifications-list";

describe("NotificationsList", () => {
  let component: NotificationsList;
  let fixture: ComponentFixture<NotificationsList>;

  const notifications: NotificationToDisplay[] = [
    {
      id: 1,
      message: "username: Connexion utilisateur",
      notificationType: NotificationType.WARN,
      notificationDate: "2026-11-04T09:30:00",
      isRead: false,
      notificationDateToDisplay: "09:30",
      notificationTypeToDisplay: "warning"
    },
    {
      id: 2,
      message: "username: Action user",
      notificationType: NotificationType.INFO,
      notificationDate: "2026-11-02T18:15:00",
      isRead: true,
      notificationDateToDisplay: "02/11",
      notificationTypeToDisplay: "info"
    }
  ];

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("notificationsList", notifications);
  });

  afterEach(() => {
    // The menu is rendered in an overlay attached to the body
    document.querySelector(".cdk-overlay-container")?.replaceChildren();
  });

  /** Opens the notifications menu, rendered in an overlay. */
  async function openMenu(): Promise<void> {
    await fixture.whenStable();
    getElement(fixture, "#display-notifications-button", HTMLButtonElement).click();
    await fixture.whenStable();
  }

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Should hide the badge when there is no unread notification", async () => {
    await fixture.whenStable();
    expect(getElement(fixture, "mat-icon", HTMLElement).getAttribute("title")).toBe(
      "Notifications"
    );
    expect(queryElement(fixture, ".mat-badge-hidden")).not.toBeNull();
  });

  it("Should display the number of unread notifications in the badge", async () => {
    fixture.componentRef.setInput("unreadNotificationsForBadge", 1);
    await fixture.whenStable();
    expect(queryElement(fixture, ".mat-badge-hidden")).toBeNull();
    expect(getElement(fixture, ".mat-badge-content", HTMLElement).textContent.trim()).toBe("1");
  });

  it("Should list the notifications in the menu", async () => {
    await openMenu();
    const containers = Array.from(document.querySelectorAll(".notification-container"));
    expect(containers).toHaveLength(2);
    expect(containers.map((container) => container.querySelector("span")?.textContent)).toEqual(
      notifications.map((notification) => notification.message)
    );
    expect(
      containers.map((container) =>
        container.querySelector(".notification-date")?.textContent.trim()
      )
    ).toEqual(["09:30", "02/11"]);
    expect(containers.map((container) => container.querySelector("mat-icon")?.textContent)).toEqual(
      ["warning", "info"]
    );
    expect(containers[0].classList).toContain("unread-notification");
    expect(containers[0].classList).toContain("warn");
    expect(containers[1].classList).not.toContain("unread-notification");
    expect(containers[1].classList).toContain("info");
    expect(containers[0].querySelector(".mark-notification-as-read-button")).not.toBeNull();
    expect(containers[1].querySelector(".mark-notification-as-read-button")).toBeNull();
    expect(containers[1].querySelector(".mark-notification-as-read-placeholder")).not.toBeNull();
    expect(document.querySelector("#mark-all-notifications-as-read-button")).toBeNull();
  });

  it("Should ask to mark a notification as read", async () => {
    const markAsReadSpy = vi.spyOn(component.notificationRead, "emit");
    await openMenu();
    document.querySelector<HTMLButtonElement>(".mark-notification-as-read-button")?.click();
    expect(markAsReadSpy).toHaveBeenCalledWith(1);
  });

  it("Should ask to mark all the notifications as read", async () => {
    const markAllAsReadSpy = vi.spyOn(component.allNotificationsRead, "emit");
    fixture.componentRef.setInput("unreadNotificationsForBadge", 1);
    await openMenu();
    document.querySelector<HTMLButtonElement>("#mark-all-notifications-as-read-button")?.click();
    expect(markAllAsReadSpy).toHaveBeenCalled();
  });
});
