
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  empName: any;
  constructor(public router: Router) { }

  ngOnInit() {
  }
  logOut(){}
  movetoLeaves(){
    this.router.navigate(['myleaves']);
  }
  movetoCalendar(){
    this.router.navigate(['mycalendar']);

  }
  movetoAttendance(){
    this.router.navigate(['myattendance']);

  }

}
