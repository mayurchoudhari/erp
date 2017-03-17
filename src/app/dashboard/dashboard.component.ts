import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { MyService } from '../my.service';

import { CoolLocalStorage } from 'angular2-cool-storage';

declare var jQuery:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [MyService],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  data: any = [];
  name: any = "";
  role: any = "";
//   subs: any;
//   parent: any;
//   ischild: boolean = false;

  constructor(private http: Http, private localStorage: CoolLocalStorage, router: Router,
                      private myservice: MyService) {
      if(!localStorage.getItem("user")) {
          router.navigate(['login']);
      }
      this.myservice.getUser().subscribe(data => {
          if(typeof data.json()[0] != 'undefined') {
              this.role = data.json()[0].role;
              this.name = data.json()[0].name;
          }
      });
   }

  ngOnInit() {
    //   jQuery("div.spinner").center(true);
      jQuery("div.loader").show();
      this.myservice.getModules()
        .subscribe(data => {
            let i = 0;
            for(let val of data.json()){
                if(typeof val.roles != 'undefined'){
                    if(val.roles.indexOf(this.role) > -1){
                        this.data[i] = val;
                        i++;
                    }
                }
            }
        }, err => {},() => {
            jQuery("div.loader").hide();
        });
  }

//   doctypes(name: any, i: any) {
//       this.parent = name;
//       this.subs = this.data[i].sub;
//       jQuery("div#child").show();
//   }

//   addModule() {
//       jQuery("div#new").show();
//   }

//   newModule() {
//       let sub = [];
//       let name = jQuery("#name").val();
//       var body = "data=[" + JSON.stringify({"module": name,"settings":{"cols":3,"rows":20}}) + "]";
//       var list = "data=[" + JSON.stringify({"name": name,"part":"info"}) + "]";
//       var ulist = "data=[" + JSON.stringify({"sub": [name]}) + "]";
//       if(this.ischild) {
//           let id = jQuery("#parent").find(":selected").attr('id');
//           this.myservice.updateData("modules.list", id, 'push', ulist).subscribe(data => {
//               console.log(data);
//           });
//       } else {
//           this.myservice.insertData("modules.list", list).subscribe(data => {
//             //   console.log(data);
//           },err => {},() => {
//               this.myservice.insertData("modules.settings", body).subscribe(data => {
//                   this.data.push({"name": name,"part":"info"});
//               },err => {},() => {
//                   jQuery('div.modal').hide();
//               });
//           });
//       }
//   }

}
