/* eslint-disable use-isnan */
import { DatabaseService } from './../../services/database.service';
/* eslint-disable no-var */
import { HttpclientService } from './../../services/httpclient.service';
import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { Constants } from 'src/app/common/constants';

@Component({
  selector: 'app-leaverequest',
  templateUrl: './leaverequest.page.html',
  styleUrls: ['./leaverequest.page.scss'],
})
export class LeaverequestPage implements OnInit {
  leaveFor: any;
  minDate = new Date().toISOString();
  startDate: any;
  endDate: any;
  fromTime: any;
  toTime: any;

  leaveTypeId: any;
  days: any;
  isShownFromDate = false;
  isShownToDate = false;
  isShownDays = false;

  isShownFromTime = false;
  isShownTotime = false;
  projectList: any = [];
  project: any;
  requestType: any;
  requestTypeId: any;

  isLeave = false;
  isPermission = false;
  from: any;
  to: any;
  reason: any;
  reportingmanager: any;
  isbtn1 = true;
  isbtn2 = false;
  rmid: any;
  selectedItem: any = [];
  isproject = false;
  constructor(
    public toastSer: ToastService,
    public httpser: HttpclientService,
    public router: Router,
    public loadingController: LoadingController,
    public platform: Platform,
    public database: DatabaseService

  ) {

    this. platform.ready().then(() => {

    if (this.platform.is('android')) {
      this.database.getProjects().then((data) => {
        this.projectList = [];
        console.log('size',data.rows.length);
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.projectList.push(data.rows.item(i));
          }
          console.log('packageList',this.projectList);
        }});
    }else{
      this.projectList = Constants.projectList;

    }
  });

  }

  ngOnInit() {}

  requestChange($event) {
    this.requestType = $event.target.value;
    console.log($event.target.value);
    if (this.requestType === 'Leave') {
      this.isLeave = true;
      this.isPermission = false;
      this.isbtn1 = false;
      this.isbtn2 = true;
      this.requestTypeId = 1;
    } else if (this.requestType === 'Permission') {
      this.isLeave = false;
      this.isPermission = true;
      this.isbtn1 = true;
      this.isbtn2 = false;
      this.requestTypeId = 2;
      this.isShownToDate = false;
      this.isShownFromDate = false;
      this.isShownFromTime = false;
      this.isShownTotime = false;

      this.isShownDays = false;

    }
  }
  projectChange($event) {
    this.selectedItem = [$event.target.value];

      if(this.selectedItem[0].reporting_manager !== ''){
      this.project = this.selectedItem[0].project_id;
      this.reportingmanager = this.selectedItem[0].reporting_manager;
      this.rmid = this.selectedItem[0].rep_mang_id;
      this.isproject = true;

      }else{
        this.project = null;
        this.isproject = false;

        this.toastSer.presentError('Please select another Project, this projects dont have RM');
      }
      console.log('selectedItem',this.selectedItem);
  }

  leaveChange($event) {
    this.leaveFor = $event.target.value;
    console.log('leave for', $event.target.value);
    if (this.leaveFor === 'Half Day') {
      this.leaveTypeId = 2;
      this.days = 0.5;
      this.isShownToDate = false;
      this.isShownFromDate = false;
      this.isShownFromTime = true;
      this.isShownTotime = true;
      this.isShownDays = true;
      this.startDate = this.minDate;
      this.endDate = this.minDate;
    } else {
      this.leaveTypeId = 1;

      this.days = 1;
      this.isShownToDate = true;
      this.isShownFromDate = true;
      this.isShownFromTime = false;
      this.isShownTotime = false;
      this.fromTime = '';
      this.toTime = '';
      this.startDate = '';
      this.endDate = '';

    }
  }
  getResopnseWithDates() {
    var date1 = new Date(this.startDate);
    var date2 = new Date(this.endDate);
    console.log('date1 ', date1, 'date2 ', date2);
    console.log('startDate ', this.startDate, 'endDate ', this.endDate);
    if(this.endDate !== undefined || this.endDate !== '' ||this.endDate !== null){

    if (date1 > date2) {
      this.startDate = '';
      this.days = '';
      this.toastSer.presentError('From Date should be less than To date.');
    } else {
      if (this.leaveFor !== 'Half Day') {
        if(this.endDate!== undefined || this.endDate !== '' || this.endDate !== null ){
        const time = date2.getTime() - date1.getTime();
        var day = time / (1000 * 3600 * 24); //Diference in Days.
        this.days = day + 1;
        this.isShownDays = true;
        console.log('days', this.days);
      }
      }
    }
  }
  }
  getResopnseWithDates1() {
    var date1 = new Date(this.startDate);
    var date2 = new Date(this.endDate);

    console.log('date1 ', date1, 'date2 ', date2);
    if(this.startDate !== undefined || this.startDate !== '' || this.startDate !== null){
    if (date2 < date1) {
      this.endDate = '';
      this.days = '';
      this.toastSer.presentError('To Date should be greater than From date.');
    } else {
      if (this.leaveFor !== 'Half Day') {
        if(this.startDate !== undefined || this.startDate !== '',this.startDate !== null){
        const time = date2.getTime() - date1.getTime();
        var day = time / (1000 * 3600 * 24); //Diference in Days.
        this.days = day + 1;
        console.log('daysssss ', this.days);

        this.isShownDays = true;

        console.log('days', day + 1);
        }
      }
    }
  }
  }

  getResopnseWithTimes() {
    var date1 = new Date(this.fromTime);
    var date2 = new Date(this.toTime);
    console.log('date1 ', date1, 'date2 ', date2);
    if(this.toTime !== undefined  || this.toTime !== null || this.toTime !== ''){

    if (date1 > date2) {
      this.fromTime = '';
      this.toastSer.presentError('From Time should be less than To Time.');
    } else {
      const time = date2.getTime() - date1.getTime();
      var hrs = time / 3600000;
      console.log('hours', hrs);
      if (hrs > 4) {
        this.toastSer.presentError('time Should not exceed 4 hours');

        this.fromTime = '';
        this.toTime = '';
      } else {
        this.isShownDays = true;
      }
    }
  }
  }
  getResopnseWithTimes1() {
    var date1 = new Date(this.fromTime);
    var date2 = new Date(this.toTime);
    console.log('date1 ', date1, 'date2 ', date2);
    if(this.fromTime !== undefined || this.fromTime !== '' || this.fromTime !== null){

    if (date2 < date1) {
      this.toTime = '';
      this.toastSer.presentError('To Time should be greater than From Time.');
    } else {
      if (this.leaveFor === 'Half Day') {
        const time = date2.getTime() - date1.getTime();
        var hrs = time / 3600000;
        console.log('hours', hrs);
        if (hrs > 4) {
          this.toastSer.presentError('time Should not exceed 4 hours');

          this.fromTime = '';
          this.toTime = '';
        } else {
          this.isShownDays = true;
        }
      }
    }
  }
  }

  getResopnseWithPermission() {
    var date1 = new Date(this.from);
    var date2 = new Date(this.to);
    console.log('date1 ', date1, 'date2 ', date2);
    if(this.to !== undefined || this.to !== '' || this.to !== null){

    if (date1 > date2) {
      this.fromTime = '';
      this.toastSer.presentError('From Time should be less than To Time.');
    } else {
      const time = date2.getTime() - date1.getTime();
      var hrs = time / 3600000;
      console.log('hours', hrs);
      if (hrs > 7) {
        this.toastSer.presentError('time Should not exceed 7 hours');

        this.fromTime = '';
        this.toTime = '';
      } else {
      }
    }
  }
  }
  getResopnseWithPermission1() {
    var date1 = new Date(this.from);
    var date2 = new Date(this.to);
    console.log('date1 ', date1, 'date2 ', date2);
    if(this.from !== undefined && this.from !== '',this.from !== null){

    if (date2 < date1) {
      this.toTime = '';
      this.toastSer.presentError('To Time should be greater than From Time.');
    } else {

        const time = date2.getTime() - date1.getTime();
        var hrs = time / 3600000;
        console.log('hours', hrs);
        if (hrs > 7) {
          this.toastSer.presentError('time Should not exceed 7 hours');

          this.fromTime = '';
          this.toTime = '';
        } else {
        }
      }
    }
  }



  submitLeave() {
    if (this.project === undefined) {
      this.toastSer.presentError('Please Select Project	');
    } else if (this.project === null) {
      this.toastSer.presentError('Please Select Project	');
    } else if (this.project === '') {
      this.toastSer.presentError('Please Select Project	');
    } else if (this.requestType === undefined) {
      this.toastSer.presentError('Please Select Request Type	');
    } else if (this.requestType === null) {
      this.toastSer.presentError('Please Select  Request Type	');
    } else if (this.requestType === '') {
      this.toastSer.presentError('Please Select Request Type	');
    } else if (this.leaveFor === undefined) {
      this.toastSer.presentError('Please Select Leave For	');
    } else if (this.leaveFor === null) {
      this.toastSer.presentError('Please Select Leave For	');
    } else if (this.leaveFor === '') {
      this.toastSer.presentError('Please Select Leave For	');
    } else if (this.leaveFor === 'Full Day' && this.startDate === undefined) {
      this.toastSer.presentError('Please Select From Date	');
    } else if (this.leaveFor === 'Full Day' && this.startDate === '') {
      this.toastSer.presentError('Please Select From Date	');
    } else if (this.leaveFor === 'Full Day' && this.startDate === null) {
      this.toastSer.presentError('Please Select From Date	');
    } else if (this.leaveFor === 'Full Day' && this.endDate === undefined) {
      this.toastSer.presentError('Please Select To Date	');
    } else if (this.leaveFor === 'Full Day' && this.endDate === '') {
      this.toastSer.presentError('Please Select To Date	');
    } else if (this.leaveFor === 'Full Day' && this.endDate === null) {
      this.toastSer.presentError('Please Select To Date	');
    } else if (this.leaveFor === 'Half Day' && this.fromTime === undefined) {
      this.toastSer.presentError('Please Select From Time	');
    } else if (this.leaveFor === 'Half Day' && this.fromTime === '') {
      this.toastSer.presentError('Please Select From Time	');
    } else if (this.leaveFor === 'Half Day' && this.fromTime === null) {
      this.toastSer.presentError('Please Select From Time	');
    } else if (this.leaveFor === 'Half Day' && this.toTime === undefined) {
      this.toastSer.presentError('Please Select To Time	');
    } else if (this.leaveFor === 'Half Day' && this.toTime === '') {
      this.toastSer.presentError('Please Select To Time	');
    } else if (this.leaveFor === 'Half Day' && this.toTime === null) {
      this.toastSer.presentError('Please Select To Time	');
    } else if (this.reason === undefined) {
      this.toastSer.presentError('Please Select Reason	');
    } else if (this.reason === null) {
      this.toastSer.presentError('Please Select  Reason	');
    } else if (this.reason === '') {
      this.toastSer.presentError('Please Select Reason	');
    } else {
      this.autoLoader();

      this. platform.ready().then(() => {

        if (this.platform.is('android')) {
          if(window.navigator.connection.type === 'none'){
            this.toastSer.presentError('Please check your internet connection');
          }else{

          this.leaveSubmit();
          }

        }else{
          this.leaveSubmit();

        }
      });

    }
  }

  leaveSubmit() {


    if (this.leaveFor === 'Full Day') {
      this.httpser
        .leaveRequest(
          Constants.userid,
          this.reason,
          this.requestTypeId,
          this.leaveTypeId,
          this.startDate,
          this.endDate,
          this.rmid,
          this.days,
          '',
          '',
          this.project
        )
        .subscribe((response1: any) => {
          if (response1.error === false) {
            this.toastSer.presentSuccess(response1.msg);
            this.router.navigate(['dashboard']);
          } else {
            this.toastSer.presentError(response1.msg);
          }
        });
    } else {

      this.httpser
        .leaveRequest(
          Constants.userid,
          this.reason,
          this.requestTypeId,
          this.leaveTypeId,
          this.fromTime.substring(0, 10),
          this.toTime.substring(0, 10),
          this.rmid,
          this.days,
          this.fromTime,
          this.toTime,
          this.project
        )
        .subscribe((response1: any) => {
          if (response1.error === false) {
            this.toastSer.presentSuccess(response1.msg);
            this.router.navigate(['dashboard']);
          } else {
            this.toastSer.presentError(response1.msg);
          }
        });
    }
  }

  cancel() {}
  submitPermission() {
    if (this.project === undefined) {
      this.toastSer.presentError('Please Select Project	');
    } else if (this.project === null) {
      this.toastSer.presentError('Please Select Project	');
    } else if (this.project === '') {
      this.toastSer.presentError('Please Select Project	');
    } else if (this.requestType === undefined) {
      this.toastSer.presentError('Please Select Request Type	');
    } else if (this.requestType === null) {
      this.toastSer.presentError('Please Select  Request Type	');
    } else if (this.requestType === '') {
      this.toastSer.presentError('Please Select Request Type	');
    } else if (this.from === undefined) {
      this.toastSer.presentError('Please Select From	');
    } else if (this.from === null) {
      this.toastSer.presentError('Please Select  From	');
    } else if (this.from === '') {
      this.toastSer.presentError('Please Select From	');
    } else if (this.to === undefined) {
      this.toastSer.presentError('Please Select To	');
    } else if (this.to === null) {
      this.toastSer.presentError('Please Select  To	');
    } else if (this.to === '') {
      this.toastSer.presentError('Please Select To	');
    } else if (this.reason === undefined) {
      this.toastSer.presentError('Please Select Reason	');
    } else if (this.reason === null) {
      this.toastSer.presentError('Please Select  Reason	');
    } else if (this.reason === '') {
      this.toastSer.presentError('Please Select Reason	');
    } else {
      this.autoLoader();

      this. platform.ready().then(() => {

        if (this.platform.is('android')) {
          if(window.navigator.connection.type === 'none'){
            this.toastSer.presentError('Please check your internet connection');
          }else{
           this.submitcall();
          }
        }else{
           this.submitcall();

        }
        });



    }
  }


  submitcall(){
    this.httpser
    .leaveRequest(
      Constants.userid,
      this.reason,
      this.requestTypeId,
      '',
      this.from.substring(0, 10),
      this.to.substring(0, 10),
      this.rmid,
      '',
      this.from,
      this.to,
      this.project
    )
    .subscribe((response: any) => {
      console.log('response', response);
      if (response.error === false) {
        this.toastSer.presentSuccess(response.msg);
        this.router.navigate(['dashboard']);
      } else {
        this.toastSer.presentError(response.msg);
      }
    });

  }

  autoLoader() {
    this.loadingController.create({
      spinner:'lines',
      message: 'Uploading, Please wait...',
      duration: 8000
    }).then((response) => {
      response.present();
      response.onDidDismiss().then((response1) => {
        console.log('Loader dismissed', response);
      });
    });
  }
}
