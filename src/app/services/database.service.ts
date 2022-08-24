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

         db.executeSql('CREATE TABLE IF NOT EXISTS user(userId text, userName text,loginname text, password text,reportingManager text,rmid text)',[])
         .then(() => console.log('created User'))
         .catch(e => console.log(e));

         db.executeSql('CREATE TABLE IF NOT EXISTS projects(project_id text, project_name text)',[])
         .then(() => console.log('Created Package'))
         .catch(e => console.log(e));
      })
      .catch(e => console.log(e));

  }



  addProjects(pid: any,pname: any){
    this.databaseObj.executeSql(`INSERT INTO projects
    (project_id,project_name)
    VALUES
    ('${pid}',
    '${pname}'
    )`,[]);
  }

  addUser(uid: any,unmae: any,lname: any,paswrd: any,rmname: any,rmidd: any){
    this.databaseObj.executeSql(`INSERT INTO user
    (userId,userName,loginname,password,reportingManager,rmid)
    VALUES
    ('${uid}',
    '${unmae}',
    '${lname}',
    '${paswrd}',
    '${rmname}',
    '${rmidd}'
    )`,[]);
  }

  getUser() {
    return this.databaseObj
      .executeSql(`select * from user  `, [])
      .then((res) => {
        console.log('getting user');
        return res;
      })
      .catch((e) => {
        console.log('error on getting user ', JSON.stringify(e));
        return 'error on getting user ' + JSON.stringify(e);
      });
  }

  getProjects() {
    return this.databaseObj
      .executeSql(`select * from projects  `, [])
      .then((res) => {
        console.log('getting projects');
        return res;
      })
      .catch((e) => {
        console.log('error on getting projects ', JSON.stringify(e));
        return 'error on getting projects ' + JSON.stringify(e);
      });
  }


  deleteUser() {
    return this.databaseObj
      .executeSql(`DELETE FROM user`, [])
      .then((res) => {
        console.log('deleting user');
        return res;
      })
      .catch((e) => {
        console.log('error on deleting user ', JSON.stringify(e));
        return 'error on deleting user ' + JSON.stringify(e);
      });
  }
  deleteProject() {
    return this.databaseObj
      .executeSql(`DELETE FROM projects`, [])
      .then((res) => {
        console.log('deleting projects');
        return res;
      })
      .catch((e) => {
        console.log('error on deleting projects ', JSON.stringify(e));
        return 'error on deleting projects ' + JSON.stringify(e);
      });
  }
}
