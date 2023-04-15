import { Injectable } from '@angular/core';

@Injectable()
export class ThemeService {
  readonly DARK_MODE_CLASS_NAME = 'dark-mode';
  readonly PREFERRED_THEME_LOCALSTORAGE_KEY = 'preferredTheme';

  private isDarkModeEnabled = false;

  public selectDarkMode(isDarkModeEnabled: boolean): void {
    if (this.isDarkModeEnabled !== isDarkModeEnabled) {
      const preferredTheme = isDarkModeEnabled ? 'dark' : 'light';
      this.isDarkModeEnabled = isDarkModeEnabled;
      if (isDarkModeEnabled) {
        document.body.classList.add(this.DARK_MODE_CLASS_NAME);
      } else {
        document.body.classList.remove(this.DARK_MODE_CLASS_NAME);
      }
      localStorage.setItem(this.PREFERRED_THEME_LOCALSTORAGE_KEY, preferredTheme);
    }
  }

  public isPreferredThemeDarkMode(): boolean {
    const preferredTheme = localStorage.getItem(this.PREFERRED_THEME_LOCALSTORAGE_KEY);
    return preferredTheme !== null && preferredTheme === 'dark';
  }
}
