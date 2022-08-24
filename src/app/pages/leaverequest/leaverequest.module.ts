import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaverequestPageRoutingModule } from './leaverequest-routing.module';

import { LeaverequestPage } from './leaverequest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaverequestPageRoutingModule
  ],
  declarations: [LeaverequestPage]
})
export class LeaverequestPageModule {}
