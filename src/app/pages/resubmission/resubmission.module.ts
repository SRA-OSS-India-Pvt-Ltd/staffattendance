import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResubmissionPageRoutingModule } from './resubmission-routing.module';

import { ResubmissionPage } from './resubmission.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResubmissionPageRoutingModule
  ],
  declarations: [ResubmissionPage]
})
export class ResubmissionPageModule {}
