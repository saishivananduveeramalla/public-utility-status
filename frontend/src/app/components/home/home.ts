import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { AnnouncementService } from '../../services/announcement.service';
import { Utility } from '../../models/utility.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  private utilityService = inject(UtilityService);
  private announcementService = inject(AnnouncementService);

  // Dynamic signals from services
  utilities = this.utilityService.utilities;
  stats = this.utilityService.stats;
  isLoading = this.utilityService.isLoading;
  error = this.utilityService.error;
  isBackendConnected = this.utilityService.isBackendConnected;
  announcements = this.announcementService.announcements;

  // Selected utility for quick modal view
  selectedUtility: Utility | null = null;

  refreshData(): void {
    this.utilityService.loadUtilities();
    this.announcementService.loadAnnouncements();
  }

  openQuickDetails(utility: Utility): void {
    this.selectedUtility = utility;
  }

  closeQuickDetails(): void {
    this.selectedUtility = null;
  }

  /**
   * Helper to return CSS class for status badge
   */
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'operational';
      case 'maintenance':
        return 'maintenance';
      case 'service disruption':
      case 'disruption':
        return 'disruption';
      default:
        return 'operational';
    }
  }
}
