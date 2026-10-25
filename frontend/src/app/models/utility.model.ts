/**
 * Utility Interface and Type Definitions
 * Course: Essentials of Web Programming (EWP) Lab
 */

export type UtilityStatus = 'Operational' | 'Maintenance' | 'Service Disruption';

export type UtilityCategory =
  | 'Electricity'
  | 'Water Supply'
  | 'Public Transportation'
  | 'Internet Services'
  | 'Garbage Collection'
  | 'Road Maintenance';

export interface Utility {
  id: string;
  name: string;
  category: UtilityCategory | string;
  area: string;
  status: UtilityStatus;
  description: string;
  lastUpdated: string;
  expectedRestoration?: string;
  helpline?: string;
  department?: string;
  uptime?: string;
  coverage?: string;
}

export interface DashboardStats {
  total: number;
  operational: number;
  maintenance: number;
  disrupted: number;
}
