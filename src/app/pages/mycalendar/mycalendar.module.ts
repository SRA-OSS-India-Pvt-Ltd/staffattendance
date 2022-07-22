import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MycalendarPageRoutingModule } from './mycalendar-routing.module';

import { MycalendarPage } from './mycalendar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MycalendarPageRoutingModule
  ],
  declarations: [MycalendarPage]
})
export class MycalendarPageModule {}
