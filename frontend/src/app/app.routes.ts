import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { UtilityStatusComponent } from './components/utility-status/utility-status';
import { ComplaintRegistrationComponent } from './components/complaint-registration/complaint-registration';
import { ComplaintStatusComponent } from './components/complaint-status/complaint-status';
import { AnnouncementsComponent } from './components/announcements/announcements';
import { AboutComponent } from './components/about/about';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Dashboard | Public Utility Status' },
  { path: 'utilities', component: UtilityStatusComponent, title: 'Utility Status Directory | Public Utility Status' },
  { path: 'register-complaint', component: ComplaintRegistrationComponent, title: 'Report a Problem | Public Utility Status' },
  { path: 'complaint-status', component: ComplaintStatusComponent, title: 'Track Grievance Status | Public Utility Status' },
  { path: 'announcements', component: AnnouncementsComponent, title: 'Public Announcements | Public Utility Status' },
  { path: 'about', component: AboutComponent, title: 'About & Lab Demo | Public Utility Status' },
  { path: '**', redirectTo: '' }
];
