import { Injectable, signal } from '@angular/core';
import { AppSettings, defaults } from '../modules/interfaces/app_settings';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private optionsSignal = signal<AppSettings>(defaults);

  getOptions() {
    return this.optionsSignal();
  }

  setOptions(options: Partial<AppSettings>) {
    this.optionsSignal.update((current) => ({
      ...current,
      ...options,
    }));
  }

  setLanguage(lang: string) {
    this.setOptions({ language: lang });
  }

  getLanguage() {
    return this.getOptions().language;
  }

  getUserRole(): string {
    return sessionStorage.getItem('userRole') || 'guest';
  }
}
