/* eslint-disable @typescript-eslint/prefer-for-of */
import { HttpclientService } from './../services/httpclient.service';
import { ToastService } from './../services/toast.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { Constants } from '../common/constants';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public postData = {
    employeeid: '',
    epassword: '',
  };
  private userList: any =[];

  constructor(public router: Router,
    private database: DatabaseService,
    private platform: Platform,
    private toastSer: ToastService,
    private httpser: HttpclientService,
    public loadingController: LoadingController) {
      this.platform.ready().then(() => {
        if (this.platform.is('android')) {
          this.database.createDatabase();
          this.getUserData();


        }
      });

  }

  ionViewDidEnter(){
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.getUserData();

      }
    });

   }

  callloginservice(){

    if(this.postData.employeeid.length<=0){
      this.toastSer.presentError('Please enter  Username');
    }else if(this.postData.epassword.length <=0){
      this.toastSer.presentError('Please enter  Password');

    }else{
      Constants.loginUserName = this.postData.employeeid;
      Constants.loginPassword = this.postData.epassword;


      this. platform.ready().then(() => {
        if (this.platform.is('android')) {
          this.checkUserExist();

        }else{

          this.webserCall(this.postData.employeeid,this.postData.epassword);




        }
      });


    }
  }


  webserCall(username: any,password: any){
    this.httpser.logionService(username,password).subscribe((response: any)=>{
      console.log('response',response);

      if(response.error === false){
        this.toastSer.presentSuccess(response.msg);
        Constants.userid = response.data.user_id;
        Constants.username = response.data.user_name;
        Constants.projectList = response.data.projects;
        Constants.logintime = response.data.log_in_time;
        Constants.logoutTime = response.data.log_out_time;
        Constants.amtype = response.data.am_type;
        Constants.pmtype = response.data.pm_type;
        Constants.reportingManager = response.data.reporting_manager;
        Constants.rmid = response.data.rep_mang_id;

        this.router.navigate(['dashboard']);
        this.postData.employeeid = '';
        this.postData.epassword = '';



      }else{
        this.toastSer.presentError(response.msg);
      }
    });
  }

  androidServicecall(username: any,password: any){
    this.httpser.logionService(username,password).subscribe((response: any)=>{
      console.log('response',response);

      if(response.error === false){
        this.toastSer.presentSuccess(response.msg);
        this.autoLoader();
        Constants.userid = response.data.user_id;
        Constants.username = response.data.user_name;
        Constants.projectList = response.data.projects;
        Constants.logintime = response.data.log_in_time;
        Constants.logoutTime = response.data.log_out_time;
        Constants.amtype = response.data.am_type;
        Constants.pmtype = response.data.pm_type;
        Constants.reportingManager = response.data.reporting_manager;
        Constants.rmid = response.data.rep_mang_id;


        this.database.deleteUser();
        this.database.deleteProject();

        this.database.addUser(response.data.user_id,response.data.user_name,username,password,
          response.data.reporting_manager,response.data.rep_mang_id);
        for (let i = 0; i < Constants.projectList.length; i++) {
          this.database.addProjects(Constants.projectList[i].project_id,
            Constants.projectList[i].project_name,
            Constants.projectList[i].rep_mang_id,
            Constants.projectList[i].reporting_manager

            );
         }
         this.router.navigate(['dashboard']);
         this.postData.employeeid = '';
         this.postData.epassword = '';




      }else{
        this.toastSer.presentError(response.msg);
      }
    });
  }


  getUserData(){
    this.database.getUser().then((data) => {
      this.userList = [];
      console.log('size',data.rows.length);
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.userList.push(data.rows.item(i));
        }
        console.log('userType',this.userList[0].userType);
        Constants.userid =this.userList[0].userId;
        Constants.username =this.userList[0].userName;
        Constants.loginUserName =this.userList[0].loginname;
        Constants.loginPassword =this.userList[0].password;
        Constants.reportingManager =this.userList[0].reporting_manager;
        Constants.rmid =this.userList[0].rmid;

        console.log('userlength',this.userList[0].userName.length);

        if(this.userList[0].userName.length > 0){
          this.router.navigate(['dashboard']);
        }

      }
    });
  }

  checkUserExist(){
    this.database.getUser().then((data) => {
      this.userList = [];
      console.log('size',data.rows.length);
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.userList.push(data.rows.item(i));
        }
        console.log('userType',this.userList[0].userType);
        Constants.userid =this.userList[0].userId;
        Constants.username =this.userList[0].userName;
        console.log('userlength',this.userList[0].userName.length);

        if(this.userList[0].userName.length > 0){
          this.router.navigate(['dashboard']);
        }else{

          if(window.navigator.connection.type === 'none'){
            this.toastSer.presentError('Please check your internet connection');
          }else{
            this.androidServicecall(this.postData.employeeid,this.postData.epassword);

          }


        }

      }else{
        if(window.navigator.connection.type === 'none'){
          this.toastSer.presentError('Please check your internet connection');
        }else{
          this.androidServicecall(this.postData.employeeid,this.postData.epassword);

        }
      }

    });
  }
  autoLoader() {
    this.loadingController.create({
      spinner:'lines',
      message: 'Loading required data. Please wait for a moment',
      duration: 30000
    }).then((response) => {
      response.present();
      response.onDidDismiss().then((response1) => {
        console.log('Loader dismissed', response);
      });
    });
  }
}
