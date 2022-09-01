import { Router } from '@angular/router';
/* eslint-disable max-len */
import { HttpclientService } from './../../services/httpclient.service';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/common/constants';
import { DatabaseService } from './../../services/database.service';
import { Camera,CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ToastService } from './../../services/toast.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import * as watermark from 'watermarkjs';
import { AlertController, Platform, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-myattendance',
  templateUrl: './myattendance.page.html',
  styleUrls: ['./myattendance.page.scss'],
})
export class MyattendancePage implements OnInit {
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

  isam = false;
  ispm = false;
  isType = true;
  isphoto = false;
  btnLayout = true;
  isdepend = false;
  btnLayout2 = false;
  latitude: any;
  longitude: any;
  locationCordinates: any;
  loadingLocation: boolean;
  item56: any;
  blobImage: any;
  originalImage: any;
  joindate: any;
newproje: any;
  type: any;
  projectList: any = [];
  project: any;

loginTime: any;
loginText: any;
logoutTime: any;
logoutText: any;
selectedItem: any = [];
  constructor(public toastSer: ToastService,
    private geolocation: Geolocation,
    public camera: Camera,
    public alertCtrl: AlertController,
    public platform: Platform,
    private database: DatabaseService,
    private httpServ: HttpclientService,
    private router: Router) {
      this.joindate =new Date().toLocaleString();

      this. platform.ready().then(() => {
        this.getLatLong();
        this.setViews();
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


    projectChange($event){
      this.selectedItem = [$event.target.value];
      if(this.selectedItem[0].reporting_manager !== ''){
      this.project = this.selectedItem[0].project_id;
      }else{
        this.project = null;
         this.newproje = null;
        this.toastSer.presentError('Please select another Project, this projects dont have RM');
      }
      console.log('selectedItem',this.selectedItem);


     }
     setViews(){
      if(Constants.amtype === 'Office' || Constants.amtype === 'Site'){
        this.isdepend = false;
      }else{
        this.isdepend = true;
      }
      if(Constants.amtype === 'Leave'){
        this.loginTime = 'On Leave';
        this.isam = true;
        this.ispm = true;
        this.isType = false;
        this.isphoto = false;
        this.btnLayout = false;
      }

      if(Constants.amtype === 'Office' || Constants.amtype === 'Site'){
        this.isType = true;
        if(Constants.logintime !== ''){
          this.loginTime = Constants.amtype + ' Log-in';
          this.loginText = Constants.logintime;
          this.isam = true;
          this.isType = true;
          this.btnLayout = true;

        }else{
          this.loginTime = '';
          this.loginText = '';
          this.isam = false;
        }

        if(Constants.logoutTime !== ''){
          if(Constants.logoutTime !== '00:00:00'){
            this.logoutTime = Constants.pmtype+' Log-out';
            this.logoutTime = Constants.logoutTime;
            this.ispm = true;
            this.loginTime = Constants.amtype + ' Log-in';
            this.loginText = Constants.logintime;
            this.isam = true;

            this.isType = false;
            this.btnLayout = false;

          }else{
            this.logoutTime = '';
            this.logoutText = '';
            this.ispm = false;
            this.isType = true;
            this.btnLayout = true;
          }
        }else{
          this.logoutTime = '';
          this.logoutText = '';
          this.ispm = false;
          this.btnLayout = true;
        }
      }

      if(Constants.logoutTime !== '' && Constants.logoutTime !== '00:00:00' && Constants.logintime !== ''){
        this.loginTime = Constants.amtype+' Log-in';
        this.loginText = Constants.logintime;
        this.isam = true;
        this.logoutTime = Constants.pmtype + ' Log-out';
        this.logoutText = Constants.logoutTime;
        this.ispm = true;
        this.isType = false;
        this.isphoto = false;
        this.btnLayout = false;
      }

    }

    typeChange($event){
      this.type = $event.target.value;
     console.log($event.target.value);
     if(this.type === 'Site'){
       this.isphoto = true;
       this.btnLayout = true;
       this.btnLayout2 = false;
     }else if(this.type === 'Office'){
       this.isphoto = true;
       this.btnLayout = true;
       this.btnLayout2 = false;

     }else if(this.type === 'Leave'){
      this.isphoto = false;
      this.btnLayout = false;
      this.btnLayout2 = true;

    }
    }

  ngOnInit() {
  }

  locationcheck(){
    this.getLatLong();

    if(this.latitude === undefined || this.longitude === undefined
      ||this.latitude === null || this.longitude === null||
      this.latitude === '' || this.longitude === ''){
        this.getLatLong();
            this.toastSer.presentError('Please Turn On GPS.');


    }else{
      this.imageSelection();
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
    .image(watermark.text.atPos(this.xy78,this.y103,'Date: '+this.joindate, '10px bold', '#FF0000', 0, 48))


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


  submit(){
    if(this.project === undefined){
      this.toastSer.presentError('Please Select Project	');

    }else if(this.project === null){
      this.toastSer.presentError('Please Select Project	');

    }else if(this.project === ''){
      this.toastSer.presentError('Please Select Project	');

    }else if(this.type === undefined){
      this.toastSer.presentError('Please Select Type	');

    }else if(this.type === null){
      this.toastSer.presentError('Please Select Type	');

    }else if(this.type === ''){
      this.toastSer.presentError('Please Select Type	');
    }else if (this.waterMarkImage.nativeElement.src === null || this.waterMarkImage.nativeElement.src === '') {
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
    this.router.navigate(['dashboard']);

  }
  submit1(){
    if(this.project === undefined){
      this.toastSer.presentError('Please Select Project	');

    }else if(this.project === null){
      this.toastSer.presentError('Please Select Project	');

    }else if(this.project === ''){
      this.toastSer.presentError('Please Select Project	');

    }else if(this.type === undefined){
      this.toastSer.presentError('Please Select Type	');

    }else if(this.type === null){
      this.toastSer.presentError('Please Select Type	');

    }else if(this.type === ''){
      this.toastSer.presentError('Please Select Type	');

    }else{

      this.platform.ready().then(() => {
        if (this.platform.is('android')) {

          if(window.navigator.connection.type === 'none'){
            this.toastSer.presentError('Please check your internet connection');
          }else{
              this.servicecall1();
          }



        }else{
          this.servicecall1();

        }
      });

    }


  }
  cancel1(){
    this.router.navigate(['dashboard']);

  }

  servicecall(){
    if(Constants.logintime === ''){
      this.httpServ.epmAttendance(Constants.userid, this.project,this.waterMarkImage.nativeElement.src,this.type,this.latitude,this.longitude).subscribe((response: any)=>{
        console.log('response',response);
        if(response.error === false){
          this.toastSer.presentSuccess(response.msg);
          this.router.navigate(['dashboard']);

        }else{
          this.toastSer.presentError(response.msg);

        }
      });

    } else if (Constants.logoutTime === '00:00:00') {
      this.httpServ.epmAttendancePM(Constants.userid,this.project,this.waterMarkImage.nativeElement.src,'',this.type,this.latitude,this.longitude,'').subscribe((response: any)=>{
        console.log('response',response);
        if(response.error === false){
          this.toastSer.presentSuccess(response.msg);
          this.router.navigate(['dashboard']);

        }else{
          this.toastSer.presentError(response.msg);

        }
      });

    }
  }

  servicecall1(){
    this.httpServ.epmAttendance(Constants.userid,this.project,'',this.type,this.latitude,this.longitude).subscribe((response: any)=>{
      console.log('response',response);
      if(response.error === false){
        this.toastSer.presentSuccess(response.msg);
        this.router.navigate(['dashboard']);

      }else{
        this.toastSer.presentError(response.msg);

      }
    });
  }


}
