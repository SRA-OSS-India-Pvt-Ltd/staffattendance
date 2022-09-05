/* eslint-disable radix */
/* eslint-disable no-var */
import { AlertController } from '@ionic/angular';
import { Constants } from 'src/app/common/constants';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';

@Component({
  selector: 'app-mycalendar',
  templateUrl: './mycalendar.page.html',
  styleUrls: ['./mycalendar.page.scss'],
})
export class MycalendarPage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  colors: string[] = ['primary', 'warning', 'danger', 'success'];
  isCal= false;

  viewTitle ='';
  eventSource = [];
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
  month1: any;
  year: any;
  month: any;
  attedanceList: any = [];
  tit: any;
  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false,
  };
  minDate = new Date().toISOString;

  constructor(private httpClientSer: HttpclientService,
    public alertCtrl: AlertController) {
    this.getCurrentDate();
    this.getEmpAttendence(Constants.userid,this.month,this.year);
   }

  ngOnInit() {
    this.resetEvent();
  }

  next() {
    this.myCal.slideNext();
    var monthstr = this.viewTitle.replace(/[^a-z]/gi, '');
    var yearstr = this.viewTitle.replace(/\D/g, '');
    console.log('month',monthstr);
    console.log('year',yearstr);


    if(monthstr === 'January'){
      this.month = 2;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'February'){
      this.month = 3;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'March'){
      this.month = 4;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'April'){
      this.month = 5;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'May'){
      this.month = 6;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'June'){
      this.month = 7;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'July'){
      this.month = 8;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'August'){
      this.month = 9;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'September'){
      this.month = 10;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'October'){
      this.month = 11;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'November'){
      this.month = 12;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'December'){
      this.month = 1;
      this.getEmpAttendence(Constants.userid,this.month,parseInt(yearstr)+1);

    }




  }

  back() {
    this.myCal.slidePrev();
    var monthstr = this.viewTitle.replace(/[^a-z]/gi, '');
    var yearstr = this.viewTitle.replace(/\D/g, '');
    console.log('month',monthstr);
    console.log('year',yearstr);

    if(monthstr === 'January'){
      this.month = 12;
      this.getEmpAttendence(Constants.userid,this.month,parseInt(yearstr)-1);

    }else if(monthstr === 'February'){
      this.month = 1;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'March'){
      this.month = 2;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'April'){
      this.month = 3;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'May'){
      this.month = 4;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'June'){
      this.month = 5;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'July'){
      this.month = 6;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'August'){
      this.month = 7;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'September'){
      this.month = 8;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'October'){
      this.month = 9;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'November'){
      this.month = 10;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);

    }else if(monthstr === 'December'){
      this.month = 11;
      this.getEmpAttendence(Constants.userid,this.month,yearstr);


    }


  }
  async onEventSelected(event) {

    if(event.logntime === undefined){
      var ltime = '';
      var lotime = '';
      var hrs = '';
    }else{
      ltime = event.logntime;
      lotime = event.logouttime;
      hrs = event.hours;
    }
    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'Login Time: ' + ltime + '<br><br>Logout Time: ' + lotime
      + '<br><br>Hours: ' + hrs

    });
    alert.present();

  }
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
  onTimeSelected(ev) {
  }


  getEmpAttendence(userid: any,month: any,year: any){
    this.eventSource = [];
    this.httpClientSer.staffMonthlyattendance(userid,month,year).
    subscribe((response: any)=>{
      console.log('response',response);

      this.attedanceList = response.data;
      console.log('attedanceList',this.attedanceList);
      console.log('attedanceListsize',this.attedanceList.length);

      if(this.attedanceList.length>0){
        for (const value of this.attedanceList) {
          const date11 = Object.values(value)[0];
          const att=Object.values(value)[1];
          const hrs=Object.values(value)[4];
          const lntime=Object.values(value)[2];
          const lotime=Object.values(value)[3];
          console.log('date',date11);
          console.log('attend',att);


          this.loadEmployeeEvents(att,date11,date11,hrs,lntime,lotime);
        }

        console.log('ifff','gggg');



      }

    });
  }



  loadEmployeeEvents(task: any, startdate: any, enddate: any,hrs: any,lntime: any,lotime: any ) {
    this.tit= task;
    let color45 = 'green';
if(this.tit === 'NE'){
  color45='red';
  task = 'No Entry';
}else if(this.tit ==='P'){
  color45 ='green';
  task = 'Present';
}else if(this.tit ==='CR'){
  color45 ='blue';
  task = 'CR';
}else if(this.tit ==='L'){
  color45 ='orange';
  task = 'Leave';
}else if(this.tit ==='A'){
  color45 ='purple';
  task = 'Absent';
}

    const eventCopy1 = {
      title: task,
      startTime: new Date(startdate),
      endTime: new Date(enddate),
      allDay: this.event.allDay,
      desc: this.event.desc ,
      eventColor: color45,
      hours: hrs,
      logntime: lntime,
      logouttime: lotime
    };


    this.eventSource.push(eventCopy1);
    this.myCal.loadEvents();

    this.resetEvent();
  }

  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false,
    };
  }


  monthChange($event) {
    this.eventSource =[];
    console.log($event.target.value);
    this.month1 = $event.target.value;
   this.getEmpAttendence(Constants.userid,$event.target.value,this.year);
  }
  yearChange($event) {
    this.eventSource =[];

    console.log($event.target.value);
    this.year = $event.target.value;
   this.getEmpAttendence(Constants.userid,this.month1,this.year);
  }

  getCurrentDate() {
    const now = new Date();
    const date = now.toISOString();
    this.year = date.substring(0,4);
    this.month = date.substring(5,7);

    console.log('today', date);
    console.log('year', this.year);
    console.log('month', this.month);

  }








}
