/* eslint-disable max-len */
import { HttpclientService } from './../../services/httpclient.service';
import { DatabaseService } from './../../services/database.service';
import { ToastService } from './../../services/toast.service';
import { AlertController, Platform } from '@ionic/angular';

import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/common/constants';
import { Push, PushObject, PushOptions } from '@awesome-cordova-plugins/push/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  empName: any;
   options1: PushOptions = {
    android: {},
    ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
    },
    windows: {},
    browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
    }
 };

  constructor(public router: Router,
    private platform: Platform,
    public alertCtrl: AlertController,
    public toaseSer: ToastService,
    public database: DatabaseService,
    public httpser: HttpclientService,
    private push: Push

) {
    console.log('username',Constants.username);
    this.empName ='   '+ Constants.username;
    this.pushNotification();

  }

  ngOnInit() {
  }
  pushNotification(){
    this.push.hasPermission()
  .then((res: any) => {

    if (res.isEnabled) {
      console.log('We have permission to send push notifications');
    } else {
      console.log('We do not have permission to send push notifications');
    }

  });

  // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
this.push.createChannel({
  id: 'testchannel1',
  description: 'My first test channel',
  // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
  importance: 3,
  //badge is used to if badge appears on the app icon see https://developer.android.com/reference/android/app/NotificationChannel.html#setShowBadge(boolean).
  //false = no badge on app icon.
  //true = badge on app icon
  badge: false
 }).then(() => console.log('Channel created'));

 // Delete a channel (Android O and above)
 this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));

 // Return a list of currently configured channels
 this.push.listChannels().then((channels) => console.log('List of channels', channels));

 // to initialize push notifications


 const pushObject: PushObject = this.push.init(this.options1);


 pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

 pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

 pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));


  }

  logOut(){
this.callalert();
  }
  movetoLeaves(){
    this.router.navigate(['myleaves']);
  }
  movetoCalendar(){
    this.router.navigate(['mycalendar']);

  }
  movetoAttendance(){

    this.router.navigate(['selection']);
    // this.platform.ready().then(() => {
    //   if (this.platform.is('android')) {

    //     if(window.navigator.connection.type === 'none'){
    //       this.toaseSer.presentError('Please check your internet connection');
    //     }else{
    //       this.webserCall(Constants.loginUserName,Constants.loginPassword);

    //     }

    //   }else{
    //     this.webserCall(Constants.loginUserName,Constants.loginPassword);

    //   }
    // });

  }

  movetoLeaveRequests(){

        this.platform.ready().then(() => {
      if (this.platform.is('android')) {

        if(window.navigator.connection.type === 'none'){
          this.toaseSer.presentError('Please check your internet connection');
        }else{

          this.crservicecall();
        }

      }else{
        this.crservicecall();

      }
    });


  }

crservicecall(){
 this.httpser.getmyCRs(Constants.userid).subscribe((response: any)=>{
if(response.error === false){
  Constants.crList = response.data.CRs;
  console.log('response',response.data.CRs);

  this.router.navigate(['leaverequest']);


}else{
  this.toaseSer.presentError(response.msg);
}

  });
}

  async callalert() {
    const alert = await this.alertCtrl.create({
      header: 'Log out',
      subHeader: 'Are you sure want to logout ?',
      buttons: [
        {
          text: 'Yes',
          handler: (redc) => {

            this. platform.ready().then(() => {
              if (this.platform.is('android')) {
                this.deleteTabledata();
                this.router.navigate(['home']);

              }else{
                this.router.navigate(['home']);

              }
            });

          },
        },
        {
          text: 'No',
        },
      ],
    });
    alert.present();
  }

  webserCall(username: any,password: any){
    this.httpser.logionService(username,password).subscribe((response: any)=>{
      console.log('response',response);

      if(response.error === false){

        Constants.userid = response.data.user_id;
        Constants.username = response.data.user_name;
        Constants.projectList = response.data.projects;
        Constants.logintime = response.data.log_in_time;
        Constants.logoutTime = response.data.log_out_time;
        Constants.amtype = response.data.am_type;
        Constants.pmtype = response.data.pm_type;
        Constants.reportingManager = response.data.reporting_manager;
        Constants.rmid = response.data.rep_mang_id;

        this.router.navigate(['myattendance']);


      }else{

      }
    });
  }

  deleteTabledata(){
    this.database.deleteUser();
    this.database.deleteProject();
  }

}
