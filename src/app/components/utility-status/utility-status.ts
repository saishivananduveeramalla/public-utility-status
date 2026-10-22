import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { Utility, UtilityStatus } from '../../models/utility.model';

@Component({
  selector: 'app-utility-status',
  imports: [FormsModule, RouterLink],
  templateUrl: './utility-status.html',
  styleUrl: './utility-status.css'
})
export class UtilityStatusComponent {
  private utilityService = inject(UtilityService);

  // Search & Filter state
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('All');
  selectedStatus = signal<string>('All');
  viewMode = signal<'grid' | 'table'>('grid');

  // Active data source: 'json' | 'xml'
  dataSource = signal<'JSON (Fetch API)' | 'XML (DOMParser)'>('JSON (Fetch API)');
  xmlLoadMessage = signal<string | null>(null);

  // Underlying data
  rawUtilities = signal<Utility[]>([]);
  isLoading = signal<boolean>(false);
  selectedUtility = signal<Utility | null>(null);

  readonly categories: string[] = [
    'All',
    'Electricity',
    'Water Supply',
    'Public Transportation',
    'Internet Services',
    'Garbage Collection',
    'Road Maintenance'
  ];

  readonly statuses: string[] = [
    'All',
    'Operational',
    'Maintenance',
    'Service Disruption'
  ];

  constructor() {
    this.loadInitialData();
  }

  async loadInitialData(): Promise<void> {
    this.isLoading.set(true);
    const data = await this.utilityService.loadUtilitiesFromJson();
    this.rawUtilities.set(data);
    this.dataSource.set('JSON (Fetch API)');
    this.isLoading.set(false);
  }

  /**
   * Demonstrates loading directly from utilities.xml via Fetch API & DOMParser
   */
  async loadFromXml(): Promise<void> {
    this.isLoading.set(true);
    try {
      const result = await this.utilityService.fetchUtilitiesFromXml();
      this.rawUtilities.set(result.utilities);
      this.dataSource.set('XML (DOMParser)');
      this.xmlLoadMessage.set('Successfully loaded and parsed 6 records from utilities.xml using DOMParser!');
      setTimeout(() => this.xmlLoadMessage.set(null), 5000);
    } catch (err: any) {
      alert('Failed to load XML: ' + err.message);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Filtered utilities list dynamically computed
   */
  filteredUtilities = computed<Utility[]>(() => {
    const list = this.rawUtilities();
    const q = this.searchQuery().trim().toLowerCase();
    const cat = this.selectedCategory();
    const stat = this.selectedStatus();

    return list.filter(u => {
      const matchesSearch = !q ||
        u.name.toLowerCase().includes(q) ||
        u.area.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.category.toLowerCase().includes(q);

      const matchesCat = cat === 'All' || u.category === cat;
      const matchesStat = stat === 'All' || u.status === stat;

      return matchesSearch && matchesCat && matchesStat;
    });
  });

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('All');
    this.selectedStatus.set('All');
  }

  openDetails(item: Utility): void {
    this.selectedUtility.set(item);
  }

  closeDetails(): void {
    this.selectedUtility.set(null);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'operational': return 'operational';
      case 'maintenance': return 'maintenance';
      case 'service disruption':
      case 'disruption': return 'disruption';
      default: return 'operational';
    }
  }
}
