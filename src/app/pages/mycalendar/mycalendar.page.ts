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

  constructor(private httpClientSer: HttpclientService) {
    this.getCurrentDate();
    this.getEmpAttendence(Constants.userid,this.month,this.year);
   }

  ngOnInit() {
    this.resetEvent();
  }

  next() {
    this.myCal.slideNext();
  }

  back() {
    this.myCal.slidePrev();
  }
  async onEventSelected(event) {
  }
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
  onTimeSelected(ev) {
  }


  getEmpAttendence(userid: any,month: any,year: any){
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
          console.log('date',date11);
          console.log('attend',att);


          this.loadEmployeeEvents(att,date11,date11);
        }

        console.log('ifff','gggg');



      }

    });
  }



  loadEmployeeEvents(task: any, startdate: any, enddate: any ) {
    this.tit= task;
    let color45 = 'green';
if(this.tit === 'NE'){
  color45='red';
}else if(this.tit ==='P'){
  color45 ='green';
}else if(this.tit ==='CR'){
  color45 ='blue';
}else if(this.tit ==='L'){
  color45 ='orange';
}

    const eventCopy1 = {
      title: task,
      startTime: new Date(startdate),
      endTime: new Date(enddate),
      allDay: this.event.allDay,
      desc: this.event.desc ,
      eventColor: color45
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
