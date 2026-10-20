import { computed, DOCUMENT, inject, Service, signal } from "@angular/core";

const DARK_MODE_CLASS_NAME = "dark-mode";
const PREFERRED_THEME_LOCALSTORAGE_KEY = "preferredTheme";

@Service()
export class ThemeService {
  public readonly isDarkMode = computed(() => this.darkMode());

  private readonly document = inject(DOCUMENT);
  private readonly darkMode = signal(
    localStorage.getItem(PREFERRED_THEME_LOCALSTORAGE_KEY) === "dark"
  );

  public constructor() {
    this.applyTheme();
  }

  public selectDarkMode(isDarkModeEnabled: boolean): void {
    this.darkMode.set(isDarkModeEnabled);
    localStorage.setItem(PREFERRED_THEME_LOCALSTORAGE_KEY, isDarkModeEnabled ? "dark" : "light");
    this.applyTheme();
  }

  private applyTheme(): void {
    this.document.body.classList.toggle(DARK_MODE_CLASS_NAME, this.darkMode());
  }
}
