import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/common/constants';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-myleaves',
  templateUrl: './myleaves.page.html',
  styleUrls: ['./myleaves.page.scss'],
})
export class MyleavesPage implements OnInit {
  myleavesList: any = [];
  pending: any;
  approved: any;
  rejected: any;
  cancel: any;
  isShown = false;
    constructor(public httpclientSer: HttpclientService,
      public toastSer: ToastService,
      public router: Router) {
        this.callMyLeaveRequest();
      }

    ngOnInit() {
    }

    callMyLeaveRequest(){
      this.httpclientSer.myLeaveRequests(Constants.userid).subscribe((response: any)=>{
       console.log('response',response);
       if(response.error === false){
         this.pending = response.data.counts.Pending;
         this.approved = response.data.counts.Approved;
         this.rejected = response.data.counts.Rejected;
         this.cancel = response.data.counts.Cancel;

         this.myleavesList = response.data.list;
         this.isShown = false;

       }else{
         this.isShown = true;
       }
      });
    }
    onPending(){
      this.myleavesList = [];
      this.callMyLeaveRequestByStatus(Constants.userid,'Pending');

    }
    onCancel(){
      this.myleavesList = [];
      this.callMyLeaveRequestByStatus(Constants.userid,'Cancelled');

    }
    onApproved(){
      this.myleavesList = [];
      this.callMyLeaveRequestByStatus(Constants.userid,'Approved');

    }
    onRejected(){
      this.myleavesList = [];
      this.callMyLeaveRequestByStatus(Constants.userid,'Rejected');

    }

    callMyLeaveRequestByStatus(userid: any,statuss: any){
      this.httpclientSer.myLeaveRequestsbyStatus(userid,statuss).subscribe((response: any)=>{
       console.log('response',response);
       if(response.error === false){

         this.myleavesList = response.data.list;
         this.isShown = false;

       }else{
         this.isShown = true;
       }
      });
    }

    onClick(lrid: any,reqtype: any) {
      Constants.lrid = lrid;
      Constants.reqType = reqtype;

      this.router.navigate(['leavedetails']);
    }

  }
