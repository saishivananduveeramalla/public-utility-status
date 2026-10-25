import { Injectable, signal } from '@angular/core';
import { Announcement } from '../models/announcement.model';

const BACKEND_URL = 'http://localhost:3000/api/announcements';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private announcementsSignal = signal<Announcement[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly announcements = this.announcementsSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    this.loadAnnouncements();
  }

  /**
   * Loads announcements asynchronously using the Fetch API from Express backend
   */
  async loadAnnouncements(): Promise<Announcement[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // 1. Try Express backend
    try {
      const response = await fetch(BACKEND_URL);
      if (response.ok) {
        const data: Announcement[] = await response.json();
        this.announcementsSignal.set(data);
        this.loadingSignal.set(false);
        return data;
      }
    } catch (e) {
      console.warn('Backend unavailable for announcements, trying local fallback:', e);
    }

    // 2. Fallback to local announcements.json
    try {
      const fallbackRes = await fetch('/data/announcements.json');
      if (fallbackRes.ok) {
        const fallbackData: Announcement[] = await fallbackRes.json();
        this.announcementsSignal.set(fallbackData);
        this.loadingSignal.set(false);
        return fallbackData;
      }
    } catch (err: any) {
      this.errorSignal.set('Failed to load announcements from backend and local file.');
    }

    this.loadingSignal.set(false);
    return [];
  }

  /**
   * Filter announcements by category
   */
  filterByCategory(category: string): Announcement[] {
    const list = this.announcementsSignal();
    if (!category || category === 'All') {
      return list;
    }
    return list.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }
}
