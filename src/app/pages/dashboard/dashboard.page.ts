import { HttpclientService } from './../../services/httpclient.service';
import { DatabaseService } from './../../services/database.service';
import { ToastService } from './../../services/toast.service';
import { AlertController, Platform } from '@ionic/angular';

import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/common/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  empName: any;
  constructor(public router: Router,
    private platform: Platform,
    public alertCtrl: AlertController,
    public toaseSer: ToastService,
    public database: DatabaseService,
    public httpser: HttpclientService

) {
    console.log('username',Constants.username);
    this.empName ='   '+ Constants.username;
  }

  ngOnInit() {
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
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {

        if(window.navigator.connection.type === 'none'){
          this.toaseSer.presentError('Please check your internet connection');
        }else{
          this.webserCall(Constants.loginUserName,Constants.loginPassword);

        }

      }else{
        this.webserCall(Constants.loginUserName,Constants.loginPassword);

      }
    });

  }

  movetoLeaveRequests(){
    this.router.navigate(['leaverequest']);

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
