import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { Push, PushObject, PushOptions } from '@awesome-cordova-plugins/push/ngx';
import { ForegroundService } from '@awesome-cordova-plugins/foreground-service/ngx';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [HttpClientModule,BrowserModule, IonicModule.forRoot({
    backButtonText: '' // Set an empty string to have no text next to the back icon
  }), AppRoutingModule],
  providers: [Push,ForegroundService,Geolocation,BackgroundMode,
    Camera,SQLite,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
