import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/common/constants';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-leavedetails',
  templateUrl: './leavedetails.page.html',
  styleUrls: ['./leavedetails.page.scss'],
})
export class LeavedetailsPage implements OnInit {
  detailsList: any = [];
  requestType: any;
  isShownPermission = false;
    constructor(public httpclientSer: HttpclientService,
     public router: Router,
     public toastSer: ToastService
      ) {
        this.requestType = Constants.reqType;
         console.log('type',Constants.reqType);
        this.callLeaverequestDetails();
        this.inputValidation();
       }

    ngOnInit() {
    }
    callLeaverequestDetails(){
      this.httpclientSer.leaveRequestDetials(Constants.lrid).subscribe((reponse: any)=>{
        console.log('response',reponse);
        if(reponse.error === false){
          this.detailsList = [reponse.data.ldetails];
        }
      });
    }

    inputValidation(){

    }

  }
