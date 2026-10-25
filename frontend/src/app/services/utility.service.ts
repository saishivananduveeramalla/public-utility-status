import { Injectable, signal, computed } from '@angular/core';
import { Utility, UtilityStatus, DashboardStats } from '../models/utility.model';

const BACKEND_URL = 'http://localhost:3000/api/utilities';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  // Reactive signals for modern Angular state management
  private utilitiesSignal = signal<Utility[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private backendConnectedSignal = signal<boolean>(false);

  // Public readonly signals
  readonly utilities = this.utilitiesSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly isBackendConnected = this.backendConnectedSignal.asReadonly();

  // Dynamically computed statistics from utility data received from backend
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
    this.loadUtilities();
  }

  /**
   * Fetches utility data from Express backend (http://localhost:3000/api/utilities)
   * Falls back gracefully to local JSON if backend is not yet started.
   */
  async loadUtilities(): Promise<Utility[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      // 1. Try Express Backend
      const response = await fetch(BACKEND_URL);
      if (response.ok) {
        const data: Utility[] = await response.json();
        this.utilitiesSignal.set(data);
        this.backendConnectedSignal.set(true);
        this.loadingSignal.set(false);
        return data;
      }
      throw new Error(`Backend returned HTTP ${response.status}`);
    } catch (backendErr: any) {
      console.warn('Express backend at http://localhost:3000 unreachable, using local fallback:', backendErr);
      this.backendConnectedSignal.set(false);

      // 2. Fallback to local /data/utilities.json
      try {
        const fallbackRes = await fetch('/data/utilities.json');
        if (fallbackRes.ok) {
          const fallbackData: Utility[] = await fallbackRes.json();
          this.utilitiesSignal.set(fallbackData);
          this.errorSignal.set('Notice: Express backend at http://localhost:3000 is offline. Showing local sample data. Start backend with "npm start" in backend folder.');
          this.loadingSignal.set(false);
          return fallbackData;
        }
      } catch (err: any) {
        this.errorSignal.set('Failed to load utilities from backend and local data.');
      }

      this.loadingSignal.set(false);
      return [];
    }
  }

  /**
   * Get single utility by ID from Express backend
   */
  async getUtilityById(id: string): Promise<Utility | undefined> {
    try {
      const response = await fetch(`${BACKEND_URL}/${id.trim()}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Fallback to local search
    }
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

  /**
   * Load from local JSON (alias for loadUtilities)
   */
  async loadUtilitiesFromJson(): Promise<Utility[]> {
    return this.loadUtilities();
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
   * Demonstrates XML + DOMParser (EWP Syllabus requirement)
   */
  async fetchUtilitiesFromXml(): Promise<{ utilities: Utility[]; rawXml: string }> {
    const response = await fetch('/data/utilities.xml');
    const rawXml = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(rawXml, 'text/xml');
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
  }
}
