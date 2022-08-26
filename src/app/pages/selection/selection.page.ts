import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Constants } from 'src/app/common/constants';
import { DatabaseService } from 'src/app/services/database.service';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.page.html',
  styleUrls: ['./selection.page.scss'],
})
export class SelectionPage implements OnInit {

  constructor(public router: Router,
    private platform: Platform,
    public alertCtrl: AlertController,
    public toaseSer: ToastService,
    public database: DatabaseService,
    public httpser: HttpclientService,
) { }

  ngOnInit() {
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


  getResubmissionDates(){
    this. platform.ready().then(() => {
      if (this.platform.is('android')) {
        if(window.navigator.connection.type === 'none'){
          this.toaseSer.presentError('Please check your internet connection');
        }else{
          this.datesServiceCall();
        }

      }else{
        this.datesServiceCall();
      }
    });

  }

  datesServiceCall(){
    this.httpser.rejectedattendance(Constants.userid).subscribe((response: any)=>{
     console.log('response',response);
     if(response.error === false){
       Constants.resubmissinDatelist = response.data.rejections;
      this.router.navigate(['resubmission']);

     }
    });
  }


}
