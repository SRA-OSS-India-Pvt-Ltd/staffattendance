import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

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

  constructor(public router: Router,
    private database: DatabaseService,
    private platform: Platform) {
      this.database.createDatabase();
    }
  callloginservice(){
    this.router.navigate(['dashboard']);
  }
}
