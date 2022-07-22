/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  databaseObj: SQLiteObject;

  constructor(public sqlite: SQLite) { }

  createDatabase(){
    this.sqlite.create({
      name: 'borelog.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

       this.databaseObj = db;

         db.executeSql('CREATE TABLE IF NOT EXISTS user(userId text, userName text, userType text,orgId text,orgName text,orgAddre text, orgLogo text,projectId text,projectName text,clentName text, projectLocation text,packageList text,fields text)',[])
         .then(() => console.log('Executed SQL'))
         .catch(e => console.log(e));
      })
      .catch(e => console.log(e));

  }
}
