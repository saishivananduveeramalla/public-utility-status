import { Injectable, signal, computed } from '@angular/core';
import { Utility, UtilityStatus, DashboardStats } from '../models/utility.model';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  // Reactive signals for modern Angular state management
  private utilitiesSignal = signal<Utility[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Public readonly signals
  readonly utilities = this.utilitiesSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // Dynamically computed statistics
  readonly stats = computed<DashboardStats>(() => {
    const list = this.utilitiesSignal();
    return {
      total: list.length,
      operational: list.filter(u => u.status === 'Operational').length,
      maintenance: list.filter(u => u.status === 'Maintenance').length,
      disrupted: list.filter(u => u.status === 'Service Disruption').length
    };
  });

  constructor() {
    this.loadUtilitiesFromJson();
  }

  /**
   * Fetches utility data from local JSON using Fetch API and response.json()
   * As required by EWP syllabus.
   */
  async loadUtilitiesFromJson(): Promise<Utility[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const response = await fetch('/data/utilities.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} while fetching utilities.json`);
      }
      const data: Utility[] = await response.json();
      this.utilitiesSignal.set(data);
      this.loadingSignal.set(false);
      return data;
    } catch (err: any) {
      console.error('Error fetching utilities via Fetch API:', err);
      this.errorSignal.set(err.message || 'Failed to load utilities');
      this.loadingSignal.set(false);
      return [];
    }
  }

  /**
   * Fetches utilities from XML file and parses it using DOMParser
   * Demonstrates XML + DOMParser integration in modern web applications.
   */
  async fetchUtilitiesFromXml(): Promise<{ utilities: Utility[]; rawXml: string }> {
    try {
      const response = await fetch('/data/utilities.xml');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} while fetching utilities.xml`);
      }
      const rawXml = await response.text();

      // Parse XML string into a DOM Document using DOMParser
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(rawXml, 'text/xml');

      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        throw new Error('XML parsing error: ' + parseError[0].textContent);
      }

      const utilityNodes = xmlDoc.getElementsByTagName('utility');
      const parsedList: Utility[] = [];

      for (let i = 0; i < utilityNodes.length; i++) {
        const node = utilityNodes[i];
        const getText = (tagName: string) => node.getElementsByTagName(tagName)[0]?.textContent?.trim() || '';

        parsedList.push({
          id: getText('id'),
          name: getText('name'),
          category: getText('category'),
          area: getText('area'),
          status: getText('status') as UtilityStatus,
          description: getText('description'),
          lastUpdated: getText('lastUpdated'),
          expectedRestoration: getText('expectedRestoration'),
          helpline: getText('helpline')
        });
      }

      return { utilities: parsedList, rawXml };
    } catch (err: any) {
      console.error('Error parsing utilities XML:', err);
      throw err;
    }
  }

  /**
   * Fetches raw DTD file text for lab code inspection
   */
  async fetchDtdRawText(): Promise<string> {
    try {
      const response = await fetch('/data/utilities.dtd');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status} loading utilities.dtd`);
      }
      return await response.text();
    } catch (err: any) {
      return `<!-- Error loading DTD: ${err.message} -->`;
    }
  }

  /**
   * Get single utility by ID
   */
  getUtilityById(id: string): Utility | undefined {
    return this.utilitiesSignal().find(u => u.id.toLowerCase() === id.toLowerCase());
  }

  /**
   * Filter and search utilities
   */
  filterUtilities(query: string, category: string, status: string): Utility[] {
    const list = this.utilitiesSignal();
    const q = query.trim().toLowerCase();

    return list.filter(u => {
      const matchesQuery = !q ||
        u.name.toLowerCase().includes(q) ||
        u.area.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.description.toLowerCase().includes(q);

      const matchesCategory = !category || category === 'All' || u.category === category;
      const matchesStatus = !status || status === 'All' || u.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }
}
