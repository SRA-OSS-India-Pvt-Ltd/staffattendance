import { Router } from '@angular/router';
/* eslint-disable no-var */
import { ToastService } from 'src/app/services/toast.service';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { DatabaseService } from './../../services/database.service';
import { Platform } from '@ionic/angular';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Constants } from 'src/app/common/constants';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import * as watermark from 'watermarkjs';
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera,CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-resubmission',
  templateUrl: './resubmission.page.html',
  styleUrls: ['./resubmission.page.scss'],
})
export class ResubmissionPage implements OnInit {
  @ViewChild('previewimage') waterMarkImage: ElementRef;
  options1: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: true,
    allowEdit: true,
    sourceType:  this.camera.PictureSourceType.CAMERA ,


  };

  projectList: any =[];
  project: any;
  latitude: any;
  longitude: any;
  locationCordinates: any;
  loadingLocation: boolean;
  resubmissionDateList: any = [];
  resubmitDate: any;
  selecteditem: any;
  isdate = false;
  prvalu: any;
  loginTime: any;
  logoutTime: any;
  loginType: any;
  logoutType: any;
  item56: any;
  blobImage: any;
  originalImage: any;

  comments: any;
  selectedProject: any = [];
  constructor(public platform: Platform,
    public database: DatabaseService,
    private geolocation: Geolocation,
    private httpClientSer: HttpclientService,
    private toastSer: ToastService,
    public camera: Camera,
    public alertCtrl: AlertController,
public router: Router


    ) {
      this.resubmissionDateList = Constants.resubmissinDatelist;
    this. platform.ready().then(() => {

      this.getLatLong();
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

  resubDateChange($event){
    this.selecteditem = [$event.target.value];
    this.resubmitDate = this.selecteditem[0].tracking_date;
    this.project = this.selecteditem[0].project_id;
    this.comments = this.selecteditem[0].rejection_comments;
    if(this.project === '1'){
      this.prvalu = 'DFCCIL Package - 1';
    }else if(this.project === '2'){
      this.prvalu = 'DFCCIL Package - 2';
    }else if(this.project === '3'){
      this.prvalu = 'DFCCIL Package - 3';
    }



    console.log(this.resubmitDate,this.project,this.prvalu);
    this.isdate = true;


   }
  ngOnInit() {
  }

  logintypeChange($event){
    this.loginType = $event.target.value;
    console.log('loginTime',this.loginType);

  }
  logouttypeChange($event){
    this.logoutType = $event.target.value;
    console.log('logoutTime',this.logoutType);

  }



  datesServiceCall(){
    this.httpClientSer.rejectedattendance(Constants.userid).subscribe((response: any)=>{
     console.log('response',response);
    });
  }

  projectChange($event){
    this.selectedProject = [$event.target.value];

    if(this.selectedProject[0].reporting_manager !== ''){
      this.project = this.selectedProject[0].project_id;
      }else{
        this.project = null;
        this.toastSer.presentError('Please select another Project, this projects dont have RM');
      }



   }

   getLatLong() {
    console.log('Easting,northing');
    this.loadingLocation = true;

    this.geolocation.getCurrentPosition()
      .then((resp) => {
        console.log(resp);
        this.locationCordinates = resp.coords;
        this.loadingLocation = false;
        this.latitude = this.locationCordinates.latitude;
        this.longitude = this.locationCordinates.longitude;
        console.log('lati',this.latitude);
      });
    }

    getResopnseWithPermission() {
      var date1 = new Date(this.loginTime);
      var date2 = new Date(this.logoutTime);
      console.log('date1 ', date1, 'date2 ', date2);

      if (date1 > date2) {
        this.loginTime = '';
        this.toastSer.presentError('Login Time should be less than Logout Time.');
      } else {
        const time = date2.getTime() - date1.getTime();
        var hrs = time / 3600000;
        console.log('hours', hrs);

      }
    }
    getResopnseWithPermission1() {
      var date1 = new Date(this.loginTime);
      var date2 = new Date(this.logoutTime);
      console.log('date1 ', date1, 'date2 ', date2);

      if (date2 < date1) {
        this.logoutTime = '';
        this.toastSer.presentError('Logout Time Time should be greater than Login Time.');
      } else {

      }
    }

    locationcheck(){
      this.getLatLong();

      if(this.latitude === undefined || this.longitude === undefined
        ||this.latitude === null || this.longitude === null||
        this.latitude === '' || this.longitude === ''){
          this.getLatLong();
              this.toastSer.presentError('Please Turn On GPS.');


      }else if(this.loginTime === undefined || this.loginTime === null || this.loginTime === ''){
        this.toastSer.presentError('Please select Login Time.');

      }
      else if(this.logoutTime === undefined || this.logoutTime === null || this.logoutTime === ''){
        this.toastSer.presentError('Please select Logout Time.');

      }
      else{
        this.imageSelection();
      }
    }

    async imageSelection() {
      this.getLatLong();


      const alert = await this.alertCtrl.create({
        header: 'Choose Type',
        buttons: [
          {
            text: 'Camera',
            handler: (redc) => {

              this.platform.ready().then(() => {
                if (this.platform.is('android')) {
                  this.snap();
                } else {

                  this.takeSnap();
                }

            });

          },
          },
        ],
      });
      alert.present();
    }

    snap(){
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 320,
        targetWidth: 320,
        correctOrientation: true,

        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };

      this.camera.getPicture(options).then((imgFileUri) => {
       // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
       this.item56 = (<any>window).Ionic.WebView.convertFileSrc(imgFileUri);

       fetch(this.item56)
       .then((res) => res.blob())
       .then((blob) => {
         this.blobImage = blob;
         this.watermarkImage();
       });

      }, (err) => {
       console.log(err);
      });

    }

    takeSnap() {
      this.camera.getPicture(this.options1).then(
        (imageData) => {
          this.originalImage = 'data:image/jpeg;base64,' + imageData;

          fetch(this.originalImage)
            .then((res) => res.blob())
            .then((blob) => {
              this.blobImage = blob;
              this.watermarkImage();
            });
        },
        (error) => {
          console.log(error);
        }
      );
    }

    watermarkImage() {


      watermark([this.blobImage])
      .image(watermark.text.atPos(this.xy78,this.y63,'Latitude: '+this.latitude, '10px bold', '#FF0000', 0))
      .load('assets/icon/aarveicon.png')
    .image(watermark.text.atPos(this.xy78,this.y83,'Longitude: '+this.longitude, '10px bold', '#FF0000', 0, 48))
    .load('assets/icon/aarveicon.png')
    .image(watermark.text.atPos(this.xy78,this.y103,'Resubmission Date: '+this.resubmitDate, '10px bold', '#FF0000', 0, 48))
    .load('assets/icon/aarveicon.png')
    .image(watermark.text.atPos(this.xy78,this.y123,'Login Time: '+this.loginTime, '10px bold', '#FF0000', 0, 48))
    .load('assets/icon/aarveicon.png')
    .image(watermark.text.atPos(this.xy78,this.y143,'Logout Time: '+this.logoutTime, '10px bold', '#FF0000', 0, 48))


    .then((img)=> {
      console.log('Base 64 of one :', img);

    //document.getElementById('lower-left').appendChild(img);


          this.waterMarkImage.nativeElement.src = img.src;
        });
    }

    xy78(coffee, metrics, context) {
      return 28;
    };
    y63(coffee, metrics, context) {
      return 63;
    };
    y83(coffee, metrics, context) {
      return 73;
    };
    y103(coffee, metrics, context) {
      return 83;
    };
    y123(coffee, metrics, context) {
      return 93;
    };
    y143(coffee, metrics, context) {
      return 103;
    };


    submit(){
      if(this.resubmitDate === undefined){
        this.toastSer.presentError('Please select Resubmission Date');
      }else if(this.resubmitDate === ''){
        this.toastSer.presentError('Please select Resubmission Date');
      }else if(this.resubmitDate === null){
        this.toastSer.presentError('Please select Resubmission Date');
      }else if(this.project === undefined){
        this.toastSer.presentError('Please select Project');
      }else if(this.project === null){
        this.toastSer.presentError('Please select Project');
      }else if(this.project === ''){
        this.toastSer.presentError('Please select Project');
      }else if(this.loginTime === undefined){
        this.toastSer.presentError('Please select Login Time');
      }else if(this.loginTime === ''){
        this.toastSer.presentError('Please select Login Time');
      }else if(this.loginTime === null){
        this.toastSer.presentError('Please select Login Time');
      }
      else if(this.logoutTime === undefined){
        this.toastSer.presentError('Please select Logout Time');
      }else if(this.logoutTime === ''){
        this.toastSer.presentError('Please select Logout Time');
      }else if(this.logoutTime === null){
        this.toastSer.presentError('Please select Logout Time');
      }
      else if(this.loginType === undefined){
        this.toastSer.presentError('Please select Login Type');
      }else if(this.loginType === null){
        this.toastSer.presentError('Please select Login Type');
      }else if(this.loginType === ''){
        this.toastSer.presentError('Please select Login Type');
      }
      else if(this.logoutType === undefined){
        this.toastSer.presentError('Please select Logout Type');
      }else if(this.logoutType === null){
        this.toastSer.presentError('Please select Logout Type');
      }else if(this.logoutType === ''){
        this.toastSer.presentError('Please select Logout Type');
      }




      else if (this.waterMarkImage.nativeElement.src === null || this.waterMarkImage.nativeElement.src === '') {
        this.toastSer.presentError('Please upload Photo');
      }else{
        this.platform.ready().then(() => {
          if (this.platform.is('android')) {

            if(window.navigator.connection.type === 'none'){
              this.toastSer.presentError('Please check your internet connection');
            }else{
                this.servicecall();
            }



          }else{
            this.servicecall();

          }
        });
      }



    }
    cancel(){
      this.router.navigate(['selection']);
    }

    servicecall(){
      this.httpClientSer.staffresubmitattendance(Constants.userid,this.project,this.waterMarkImage.nativeElement.src,
        this.latitude,this.longitude,this.loginType,this.logoutType,this.resubmitDate,this.loginTime,this.logoutTime)
        .subscribe((response: any)=>{
          if(response.error === false){
            this.toastSer.presentSuccess(response.msg);
            this.router.navigate(['selection']);

          }else{
            this.toastSer.presentError(response.msg);

          }
        });
    }

}
