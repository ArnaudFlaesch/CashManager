import { computed, DOCUMENT, inject, Service, signal } from "@angular/core";

@Service()
export class Theme {
  private readonly DARK_MODE_CLASS_NAME = "dark-mode";
  private readonly PREFERRED_THEME_STORAGE_KEY = "preferredTheme";

  public readonly isDarkMode = computed(() => this.darkMode());

  private readonly document = inject(DOCUMENT);
  private readonly darkMode = signal(
    localStorage.getItem(this.PREFERRED_THEME_STORAGE_KEY) === "dark"
  );

  public constructor() {
    this.applyTheme();
  }

  public selectDarkMode(isDarkModeEnabled: boolean): void {
    this.darkMode.set(isDarkModeEnabled);
    localStorage.setItem(this.PREFERRED_THEME_STORAGE_KEY, isDarkModeEnabled ? "dark" : "light");
    this.applyTheme();
  }

  private applyTheme(): void {
    this.document.body.classList.toggle(this.DARK_MODE_CLASS_NAME, this.darkMode());
  }
}
