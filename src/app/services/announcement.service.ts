import { Injectable, signal } from '@angular/core';
import { Announcement } from '../models/announcement.model';

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
   * Loads announcements asynchronously using the Fetch API
   */
  async loadAnnouncements(): Promise<Announcement[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const response = await fetch('/data/announcements.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch announcements.json`);
      }
      const data: Announcement[] = await response.json();
      this.announcementsSignal.set(data);
      this.loadingSignal.set(false);
      return data;
    } catch (err: any) {
      console.error('Error fetching announcements:', err);
      this.errorSignal.set(err.message || 'Failed to load announcements');
      this.loadingSignal.set(false);
      return [];
    }
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
