import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResubmissionPage } from './resubmission.page';

const routes: Routes = [
  {
    path: '',
    component: ResubmissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResubmissionPageRoutingModule {}
