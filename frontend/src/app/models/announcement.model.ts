/**
 * Announcement Interface
 * Course: Essentials of Web Programming (EWP) Lab
 */

export interface Announcement {
  id: string;
  title: string;
  category: string;
  affectedArea: string;
  description: string;
  publishedDate: string;
  expectedCompletion?: string;
  priority: 'High' | 'Medium' | 'Normal' | 'Low';
  issuer: string;
}
