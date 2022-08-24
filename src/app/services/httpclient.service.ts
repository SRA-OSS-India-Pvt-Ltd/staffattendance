/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpclientService {

  constructor(public httpclient: HttpClient) { }

  logionService(useri: any, paswrd: any) {
    const parameters = { username: useri, password: paswrd };
    console.log('JSON', JSON.stringify(parameters));

    return this.httpclient.post(  `${environment.apiUrl}/login_staff`,
      JSON.stringify(parameters)
    );
  }

  staffattendance(useri: any, proid: any,amphoto: any,amlat: any,amlng: any,pmphoto: any,pmlat: any,
    pmlng: any,tracino: any,comptrtim: any,amattendancty: any,pmatttype: any) {
    const parameters = { user_id: useri, project_id: proid,
      am_photo: amphoto,
      am_lat: amlat,
      am_lng: amlng,
      pm_photo: pmphoto,
      pm_lat:pmlat,
      pm_lng:pmlng,
      comp_track_info: tracino,
      comp_track_time: comptrtim,
      am_attendance_type: amattendancty,
      pm_attendance_type: pmatttype };
    console.log('JSON', JSON.stringify(parameters));

    return this.httpclient.post(  `${environment.apiUrl}/staff_attendance`,
      JSON.stringify(parameters)
    );
  }

  epmAttendance(empid: any,proid: any,amphoto: any,amtype: any,lat: any,longi: any){

    const parameters = {user_id: empid,
      project_id: proid,am_photo: amphoto,am_attendance_type: amtype,am_lat: lat,am_lng: longi};
    console.log('JSON', JSON.stringify(parameters));

    return this.httpclient.post(
      `${environment.apiUrl}/staff_attendance`,
      JSON.stringify(parameters)
    );

  }

  epmAttendancePM(empid: any,proid: any,pmphoto: any,comptracktime: any,
    amtype: any,lat: any,longi: any,trackinfo: any){

    const parameters = {user_id: empid,
      project_id: proid,pm_photo: pmphoto,
      comp_track_time: comptracktime,
      pm_attendance_type: amtype,pm_lat: lat,pm_lng: longi,comp_track_info: trackinfo};
    console.log('JSON', JSON.stringify(parameters));

    return this.httpclient.post(
      `${environment.apiUrl}/staff_attendance`,
      JSON.stringify(parameters)
    );

  }


  leaveRequest(userid: any,rean: any,reqtype: any,leaday: any,fdate: any, todat: any,rmid: any,leavecount: any,
    ftime: any,ttime: any,pid: any){

    const parameters = {user_id: userid,reason:rean,request_type:reqtype,leaveday: leaday,
      from_date: fdate,to_date:todat,rep_mang_id:rmid,appliedleavescount:leavecount,from_time:ftime,to_time:ttime,
      project_id:pid};
    console.log('JSON', JSON.stringify(parameters));

    return this.httpclient.post(
      `${environment.apiUrl}/leave_request `,
      JSON.stringify(parameters)
    );

  }
  myLeaveRequests(userid: any){
  const parameters = {user_id: userid};
  console.log('JSON', JSON.stringify(parameters));

  return this.httpclient.post(
    `${environment.apiUrl}/my_leave_requests `,
    JSON.stringify(parameters)
  );
  }

  myLeaveRequestsbyStatus(userid: any,levestatus: any){
    const parameters = {user_id: userid,leavestatus: levestatus};
    console.log('JSON', JSON.stringify(parameters));

    return this.httpclient.post(
      `${environment.apiUrl}/my_leave_requests_by_status `,
      JSON.stringify(parameters)
    );
    }

    leaveRequestDetials(leaveid: any){
      const parameters = {lr_id: leaveid};
      console.log('JSON', JSON.stringify(parameters));

      return this.httpclient.post(
        `${environment.apiUrl}/leave_request_details `,
        JSON.stringify(parameters)
      );
      }

      staffMonthlyattendance(userid: any,mon: any,yer: any){
        const parameters = {user_id: userid,month:mon,year:yer};
        console.log('JSON', JSON.stringify(parameters));

        return this.httpclient.post(
          `${environment.apiUrl}/staff_monthly_attendance `,
          JSON.stringify(parameters)
        );
        }


}
