import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyleavesPage } from './myleaves.page';

const routes: Routes = [
  {
    path: '',
    component: MyleavesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyleavesPageRoutingModule {}
