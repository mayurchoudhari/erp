import { Component, OnInit, ViewContainerRef, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { CoolLocalStorage } from 'angular2-cool-storage';
import { Md5 } from '../../md5/dist/md5';
import { Cookie } from 'ng2-cookies';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

declare var jQuery: any;

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	headers: Headers;
	hash: any;
	msg = "";
	toast: EventEmitter<any> = new EventEmitter();

	constructor(private fb: FormBuilder, private localStore: CoolLocalStorage,
		private http: Http, private router: Router, public toastyService: ToastyService) {

		if (localStore.getItem("user")) {
			router.navigate(['dashboard']);
		}
	}

	ngOnInit() {
		this.buildForm();
		jQuery("div.loader").hide();
		this.toast.subscribe(data => {
			this.addToast("Error", String(data), "error");
		});
	}
	login: any;

	onSubmit() {
		var this_ref = this;
		jQuery("div.loader").show();
		var finalHash = this.localStore.getItem('preHash') + ':' + this.loginForm.value.email + ':' + Md5.hashStr(btoa(this.loginForm.value.password));
		let body = 'userpass=' + finalHash;
		let dta = {};
		this.hash = Md5.hashStr(finalHash);
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'X-Hash2': this.hash });
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://138.197.220.205/api/api.php/users.login', body, options)
			.subscribe(data => {
				dta = data.json();
			}, err => { }, () => {
				if (dta['error']) {
					jQuery("div.loader").hide();
					this.msg = dta['error'];
					this.toast.emit(this.msg);
					//   jQuery("div.modal").show();
				} else {
					this.localStore.setItem("x-hash2", this.hash);
					this.localStore.setItem("user", JSON.stringify(dta));
					Cookie.set("x-hash2", this.hash);
					Cookie.set("user", JSON.stringify(dta));
					this.localStore.removeItem("preHash");
					this.router.navigate(['dashboard']);
				}
			});
	}

	buildForm(): void {
		this.loginForm = this.fb.group({
			'email': ['E-mail address', [
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(30)
			]
			],
			'password': ['Password', [
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(30)
			]]
		});
	}

	addToast(head: string, mesg: string, type = "default", time = 5000) {
		// create the instance of ToastOptions
		var toastOptions: ToastOptions = {
			title: head,
			msg: mesg,
			showClose: true,
			timeout: time,
			theme: 'default',
			onAdd: (toast: ToastData) => {
				// console.log('Toast ' + toast.id + ' has been added!');
			},
			onRemove: function (toast: ToastData) {
				// console.log('Toast ' + toast.id + ' has been removed!');
			}
		};
		switch (type) {
			case "info":
				this.toastyService.info(toastOptions);
				break;
			case "success":
				this.toastyService.success(toastOptions);
				break;
			case "wait":
				this.toastyService.wait(toastOptions);
				break;
			case "error":
				this.toastyService.error(toastOptions);
				break;
			case "warning":
				this.toastyService.warning(toastOptions);
				break;
			default:
				this.toastyService.default(toastOptions);
		}
	}

}
