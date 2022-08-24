import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'myleaves',
    loadChildren: () => import('./pages/myleaves/myleaves.module').then( m => m.MyleavesPageModule)
  },
  {
    path: 'myattendance',
    loadChildren: () => import('./pages/myattendance/myattendance.module').then( m => m.MyattendancePageModule)
  },
  {
    path: 'mycalendar',
    loadChildren: () => import('./pages/mycalendar/mycalendar.module').then( m => m.MycalendarPageModule)
  },
  {
    path: 'leaverequest',
    loadChildren: () => import('./pages/leaverequest/leaverequest.module').then( m => m.LeaverequestPageModule)
  },
  {
    path: 'leavedetails',
    loadChildren: () => import('./pages/leavedetails/leavedetails.module').then( m => m.LeavedetailsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
