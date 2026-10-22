import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnnouncementService } from '../../services/announcement.service';
import { Announcement } from '../../models/announcement.model';

@Component({
  selector: 'app-announcements',
  imports: [FormsModule],
  templateUrl: './announcements.html',
  styleUrl: './announcements.css'
})
export class AnnouncementsComponent {
  private announcementService = inject(AnnouncementService);

  announcements = this.announcementService.announcements;
  isLoading = this.announcementService.isLoading;
  error = this.announcementService.error;

  selectedCategory = signal<string>('All');
  searchQuery = signal<string>('');

  readonly categories: string[] = [
    'All',
    'Electricity',
    'Water Supply',
    'Public Transportation',
    'Internet Services',
    'Garbage Collection',
    'Road Maintenance'
  ];

  filteredAnnouncements = computed<Announcement[]>(() => {
    const list = this.announcements();
    const cat = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();

    return list.filter(item => {
      const matchesCat = cat === 'All' || item.category.toLowerCase() === cat.toLowerCase();
      const matchesQuery = !query ||
        item.title.toLowerCase().includes(query) ||
        item.affectedArea.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesCat && matchesQuery;
    });
  });

  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-normal';
    }
  }
}
