import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Jsonp } from '@angular/http';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { CoolLocalStorage } from 'angular2-cool-storage';

import { MyService } from './my.service';

declare var jQuery: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	providers: [MyService],
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
	title = 'app works!';
	data: any;
	status = false;
	scripty: any;
	i = 0;
	constructor(private http: Http, private localStorage: CoolLocalStorage, private router: Router,
		private myservice: MyService) {

		this.http.get('http://138.197.220.205/api/api.php')
			.subscribe(data => {
				localStorage.setItem('preHash', data.headers.get('x-pre-hash')); // store hash in local storage
			});
	}

	ngOnInit() {
		jQuery("div.loader").hide();
		this.router.events.subscribe(path => {
			this.status = this.loggedIn();
			//   if(this.i == 0){
			if (this.status) {
				let scrpt: any = "";
				this.myservice.getAll('modules.scripts').subscribe(resp => {
					this.scripty = resp.json();
				}, err => { }, () => {
					for (let item of this.scripty) {
						var script = 'http://138.197.220.205/api/scripts/' + item.module + '.js';
						scrpt = scrpt + '<script src="' + script + '"></script>';
					}
					jQuery("div#scripts").html(scrpt);
					scrpt = "";
				});
			}
		});
	}

	ngAfterViewInit() {
	}

	loggedIn() {
		if (localStorage.getItem("user")) {
			return true;
		} else {
			return false;
		}
	}

}
