import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { MyService } from '../my.service';

import { CoolLocalStorage } from 'angular2-cool-storage';

declare var jQuery: any;

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	data: any = [];
	name: any = "";
	role: any = "";
	uid: any = "";
	hide: boolean = false;

	constructor(private localStorage: CoolLocalStorage, private router: Router, private myservice: MyService) {
		if (!localStorage.getItem("user")) {
			router.navigate(['login']);
		}

		this.myservice.getUser().subscribe(data => {
			if (typeof data.json()[0] != 'undefined') {
				this.role = data.json()[0].role;
				this.name = data.json()[0].name;
				this.uid = data.json()[0].uid;
			}
		});
	}

	ngOnInit() {
		this.router.events.subscribe(path => {
			if (!(path.url == '/login' || path.url == '/logout')) {
				this.showme();
			}
		});
	}

	showme() {
		jQuery("div.loader").show();
		this.myservice.getModules()
			.subscribe(data => {
				let i = 0;
				for (let val of data.json()) {
					if (typeof val.roles != 'undefined') {
						if (val.roles.indexOf(this.role) > -1) {
							this.data[i] = val;
							i++;
						}
					}
				}
			}, err => { }, () => {
				jQuery("div.loader").hide();
			});
		var toggle = false;
		jQuery(".sidebar-icon").click(function () {
			if (toggle) {
				jQuery(".page-container").addClass("sidebar-collapsed").removeClass("sidebar-collapsed-back");
				jQuery("#menu span").css({ "position": "absolute" });
			} else {
				jQuery(".page-container").removeClass("sidebar-collapsed").addClass("sidebar-collapsed-back");
				setTimeout(function () {
					jQuery("#menu span").css({ "position": "relative" });
				}, 400);
			}
			toggle = !toggle;
		});
	}

	profile() {
		this.router.navigate(['erp/edit/profile/' + this.uid]);
	}

}
