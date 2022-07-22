import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyleavesPageRoutingModule } from './myleaves-routing.module';

import { MyleavesPage } from './myleaves.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyleavesPageRoutingModule
  ],
  declarations: [MyleavesPage]
})
export class MyleavesPageModule {}
