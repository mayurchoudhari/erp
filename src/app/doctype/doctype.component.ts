import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { MyService } from '../my.service';

import * as io from 'socket.io-client';
import { Md5 } from '../../md5/dist/md5';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

declare var jQuery: any;
declare var ace: any;

@Component({
	selector: 'app-doctype',
	templateUrl: './doctype.component.html',
	providers: [MyService],
	styleUrls: ['./doctype.component.css']
})
export class DoctypeComponent implements OnInit, AfterViewInit {

	prams: any;
	private mySchema: any = null;
	private children: any = null;
	private myActions: any = {};
	private myModel: any = {};
	toast: EventEmitter<any> = new EventEmitter();
	error: EventEmitter<any> = new EventEmitter();

	title: any;
	formData: any;
	updateId: any = "";
	edit: boolean = false;
	editor: any;
	module: any;
	script: boolean = false;
	socket: any;
	query: any;

	constructor(private route: ActivatedRoute, private localStorage: CoolLocalStorage, private router: Router,
		private myservice: MyService, private toastyService: ToastyService,
		private toastyConfig: ToastyConfig) {
		if (!localStorage.getItem("user")) {
			router.navigate(['login']);
		}
		this.socket = io("http://138.197.220.205:5000");

		route.queryParams.subscribe(q => {
			this.query = q;
		});

		route.params.subscribe(p => {
			this.prams = p;
		});

		// router.events.subscribe(path => {
		// 	this.socket.disconnect();
		// });
		// this.socket = io("http://138.197.220.205:5000");
	}

	ngOnInit() {
		jQuery("div.loader").show();
		this.toast.subscribe(data => {
			this.addToast("Success", String(data), "success");
		});
		this.error.subscribe(data => {
			this.addToast("Error", String(data), "error");
		});
		this.socket.removeListener('get').on('get', (info) => {
			// console.log(info);
			info = JSON.parse(info.text);
			// console.log(jQuery("select."+info.field+" option").last()[0].value.split(':')[0]);
			var num = Number(jQuery("select."+info.field+" option").last()[0].value.split(':')[0]) + 1;
			jQuery("select."+info.field).append('<option value="'+num+': '+info.value+'" ng-reflect-ng-value="'+info.value+'">'+info.value+'</option>');
		});

		if (this.prams['type'] == "edit") {
			if (this.prams['collection'] == 'profile') {
				this.mySchema = {
					"properties": {
						"curpass": { "type": "string", "title": "Current Password", "widget": "password", "pattern": "^([a-zA-Z0-9@ ]{1,})+$", "show": true },
						"pass": { "type": "string", "title": "Password", "widget": "password", "pattern": "^([a-zA-Z0-9@ ]{1,})+$", "show": true },
						"cpass": { "type": "string", "title": "Confirm Password", "widget": "password", "pattern": "^([a-zA-Z0-9@ ]{1,})+$", "show": true }
					},
					"required": ["pass", "cpass"],
					"buttons": [{ "label": "Submit", id: "submit" }]
				};
			} else {
				this.myservice.getItemData(this.prams['collection'], this.prams['id']).subscribe(data => {
					this.formData = data.json();
				}, err => { }, () => {
					this.myservice.getSchema(this.prams['collection']).subscribe(data => {
						data = data.json();
						if(typeof data[0] != 'undefined'){
							this.mySchema = data[0].schema;
						}
					}, err => { }, () => {
						for (let key in this.mySchema.properties) {
							if (typeof this.formData[0][key] != 'undefined') {
								this.mySchema.properties[key].default = this.formData[0][key];
							}
						}
						if (this.prams['collection'] == 'users.info') {
							this.mySchema.properties['user'].default = this.formData[0]['email'];
						}
					});
				});
			}
		} else if (this.prams['type'] == "add") {
			this.myservice.getSchema(this.prams['collection']).subscribe(data => {
				data = data.json();
				if (typeof data[0] != 'undefined') {
					this.mySchema = data[0].schema;
				}
			}, err => { }, () => {
				//   this.mySchema.properties['test'] = {"type":"string","title":"mylink","document":"masters.city","column":"city","widget":"link"};
			});
		} else if (this.prams['type'] == 'editor') {
			this.edit = true;
			if (this.route.url['value'][0].path == 'script') {
				this.script = true;
			}
		} else {
			console.log("Invalid Request");
		}

		var this_ref = this;
		this.myActions = {
			"submit": function (form) {
				// console.log(form);
				if (form.valid) {
					if(!(typeof this_ref.query.field == 'undefined')){
						this_ref.socket.emit('add', JSON.stringify({field: this_ref.query.field, value: form.value[this_ref.query.col]}));
					}
					if (this_ref.prams['collection'] == 'profile') {
						this_ref.updateProfile(form.value);
					} else {
						form.value.locate = jQuery("input.addr").eq(0).val();
						this_ref.insertMe(form.value);
					}
					// console.log(form.value);
				} else {
					this_ref.error.emit("Invalid Input");
					console.log("Ohh...!");
				}
			},
			"reset": function (form) {
				form.reset();
			}
		};

		this.title = this.prams['collection'].replace(".", " / ");
	}

	ngAfterViewInit() {
		var this_ref = this;
		jQuery(".fa-eye").parent().mousedown(function () {
			jQuery(this).parent().find(".form-control1").attr("type", "text");
		});
		jQuery(".fa-eye").parent().mouseup(function () {
			jQuery(this).parent().find(".form-control1").attr("type", "password");
		});
		if (this.prams['type'] == 'editor') {
			this.edit = true;
			setTimeout(function () {
				this_ref.editor = ace.edit("editor");
				this_ref.editor.setTheme("ace/theme/eclipse");
				this_ref.editor.getSession().setTabSize(4);
				if (this_ref.route.url['value'][0].path == 'script') {
					this_ref.editor.getSession().setMode("ace/mode/javascript");
				} else {
					this_ref.editor.getSession().setMode("ace/mode/json");
				}
				this_ref.editor.$blockScrolling = Infinity;
			}, 100);
			if (this.route.url['value'][0].path == 'new') {
				console.log("Hie!!!");
			} else if (this.route.url['value'][0].path == 'erp') {
				this_ref.myservice.getItemData(this.prams['collection'], this.prams['id']).subscribe(data => {
					data = data.json();
					this_ref.module = data[0].module;
					this_ref.editor.setValue(JSON.stringify(data[0].schema, null, '\t'));
				});
			} else if (this.route.url['value'][0].path == 'script') {
				if (typeof this.prams['id'] === 'undefined') {
					console.log("bello...");
				} else {
					this_ref.myservice.getItemData(this.prams['collection'], this.prams['id']).subscribe(data => {
						data = data.json();
						this_ref.module = data[0].module;
					}, err => { }, () => {
						this_ref.myservice.getScript(this_ref.module).subscribe(resp => {
							this_ref.editor.setValue(resp['_body']);
							jQuery("div.loader").hide();
						});
					});
				}
			}
		}
		window.setTimeout(function () { jQuery("div.loader").hide(); }, 2000);
		jQuery("input").keyup(function () {
			var this_ref = this;
			if (jQuery(this_ref).hasClass("ng-invalid")) {
				jQuery(this_ref).css("box-shadow", "0px 0 3px red !important");
			}
		});
		// if(this.prams['collection'] == "Masters.comissionAgent"){
			// setTimeout(function(){
			// 	jQuery("div#google").html('<script>function initAutocomplete(){for(var address=$(".addr"),i=0;i<address.length;i++)new google.maps.places.Autocomplete(address[i],{types:["geocode"]});}</script>');
			// 	jQuery("div#google").append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDqgw69yW-Mry8DkQ9VI1gcD90BxKvSiSQ&libraries=places&callback=initAutocomplete" async defer></script>');
			// }, 2000);
		// }
	}

	insertMe(data: any) {
		var this_ref = this;
		let createdBy = JSON.parse(this.localStorage.getItem("user"))['user'];
		let dta = {};
		let dta2 = {};
		if (this.prams['collection'] == 'users.info') {
			if (this.prams['type'] == 'add') {
				dta['user'] = data['user'];
				dta['pwd'] = Md5.hashStr(btoa(data['pwd']));
				dta['active'] = data['active'];
				dta2['name'] = data['name'];
				dta2['email'] = data['user'];
				dta2['phone'] = data['phone'];
				dta2['role'] = data['role'];
				dta2['createdBy'] = createdBy;
				var body = "data=[" + JSON.stringify(dta) + "]";
				this.myservice.insertData('users.login', body).subscribe(resp => {
					dta2['uid'] = resp.json()['success'][0];
				}, err => { }, () => {
					body = "data=[" + JSON.stringify(dta2) + "]";
					this.myservice.insertData('users.info', body).subscribe(resp => {
						this.toast.emit("New Record Added");
					}, err => { }, () => {
						this.router.navigate(['erp/' + this.prams['collection'].replace(".", "/")]);
					});
				});
			} else {
				alert("Hello");
				// this.myservice.updateData('users.info', this.prams['id'], 'set', body).subscribe(data => {
				// 	this.toast.emit("Data Updated");
				// 	setTimeout(function () { this_ref.router.navigate(['erp/' + this_ref.prams['collection'].replace(".", "/")]) }, 1500);
				// });
			}
		} else {
			if (this.prams['type'] == "add") {
				if (this.prams['collection'] == 'Costing.details') {
					this.costing(data);
				}
				data['createdBy'] = JSON.parse(this.localStorage.getItem("user"))['user'];
				var body = "data=[" + JSON.stringify(data) + "]";
				this.myservice.insertData(this.prams['collection'], body).subscribe(resp => {
					this.toast.emit("New Record Added");
				}, err => { }, () => {
					if (this.prams['collection'] == 'users.roles') {
						this.router.navigate(['erp/users/info']);
					} else {
						if(!(typeof this_ref.query.field == 'undefined')){
							window.close();
						}
						this.router.navigate(['erp/' + this.prams['collection'].replace(".", "/")]);
					}
				});
			}
			if (this.prams['type'] == "edit") {
				if (this.prams['collection'] == 'Costing.details') {
					this.costing(data);
				}
				data['updatedBy'] = JSON.parse(this.localStorage.getItem("user"))['user'];
				var body = "data=[" + JSON.stringify(data) + "]";
				if (this.prams['copy'] == "copy") {
					this.myservice.insertData(this.prams['collection'], body).subscribe(resp => {
						this.toast.emit("New Record Added");
					}, err => { }, () => {
						if (this.prams['collection'] == 'users.roles') {
							this.router.navigate(['erp/users/info']);
						} else {
							this.router.navigate(['erp/' + this.prams['collection'].replace(".", "/")]);
						}
					});
				} else {
					this.myservice.updateData(this.prams['collection'], this.prams['id'], 'set', body).subscribe(data => {
						this.toast.emit("Data Updated");
						setTimeout(function () { this_ref.router.navigate(['erp/' + this_ref.prams['collection'].replace(".", "/")]) }, 1500);
					});
				}
			}
		}
	}

	updateProfile(data: any) {
		var this_ref = this;
		if (data['pass'] != data['cpass']) {
			this.error.emit("Passwords do not match");
		} else {
			this.myservice.getItemData('users.login', this.prams['id']).subscribe(dta => {
				if (dta.json()[0].pwd == Md5.hashStr(btoa(data['curpass']))) {
					let inf = { pwd: Md5.hashStr(btoa(data['pass'])) };
					var body = "data=[" + JSON.stringify(inf) + "]";
					this.myservice.updateData('users.login', this.prams['id'], 'set', body).subscribe(() => {
						jQuery(".form-control1").val("");
						this.toast.emit("Password Updated, Please logout & login again");
						setTimeout(function () { this_ref.router.navigate(['logout']) }, 3000);
					});
				} else {
					this.error.emit("Incorrect Password");
				}
			});
			//   this.toast.emit(JSON.stringify(data));
		}
	}

	saveform() {
		var this_ref = this;
		let data = {};
		if (this.route.url['value'][0].path == 'erp') {
			data['updatedBy'] = JSON.parse(this.localStorage.getItem("user"))['user'];
			data['module'] = this.module;
			data['schema'] = JSON.parse(this.editor.getValue());
			var body = "data=[" + JSON.stringify(data) + "]";
			this.myservice.updateData('modules.forms', this.prams['id'], 'set', body).subscribe(data => {
				this.toast.emit(data.json()['success']);
				this.toast.emit("Form Updated");
				setTimeout(function () { this_ref.router.navigate(['erp/' + this_ref.prams['collection'].replace(".", "/")]) }, 3000);
			});
		} else if (this.route.url['value'][0].path == 'new') {
			data['createdBy'] = JSON.parse(this.localStorage.getItem("user"))['user'];
			data['module'] = this.module;
			data['schema'] = JSON.parse(this.editor.getValue());
			var body = "data=[" + JSON.stringify(data) + "]";
			this.myservice.insertData('modules.forms', body).subscribe(data => {
				this.toast.emit("Form Created");
				setTimeout(function () { this_ref.router.navigate(['erp/' + this_ref.prams['collection'].replace(".", "/")]) }, 3000);
			});
		}
	}

	saveScript() {
		var this_ref = this;
		let data = {};
		let fdata = {};
		if (typeof this.prams['id'] === 'undefined') {
			data['module'] = this.module;
			fdata['module'] = this.module;
			fdata['content'] = this.editor.getValue().replace(/\+/g, "%2B");
			data['createdBy'] = JSON.parse(this.localStorage.getItem("user"))['user'];
			var body = "data=[" + JSON.stringify(data) + "]";
			this.myservice.insertData('modules.scripts', body).subscribe(resp => {
				body = "data=[" + JSON.stringify(fdata) + "]";
			}, err => { }, () => {
				this.myservice.insertScript(body).subscribe(res => {
					this.toast.emit(res.json()['success']);
					setTimeout(function () { this_ref.router.navigate(['erp/' + this_ref.prams['collection'].replace(".", "/")]) }, 3000);
				});
			});
		} else {
			data['module'] = this.module;
			fdata['module'] = this.module;
			fdata['content'] = this.editor.getValue().replace(/\+/g, "%2B");
			data['createdBy'] = JSON.parse(this.localStorage.getItem("user"))['user'];
			var body = "data=[" + JSON.stringify(data) + "]";
			this.myservice.updateData('modules.scripts', this.prams['id'], 'set', body).subscribe(resp => {
				body = "data=[" + JSON.stringify(fdata) + "]";
			}, err => { }, () => {
				this.myservice.insertScript(body).subscribe(res => {
					this.toast.emit(res.json()['success']);
					setTimeout(function () { this_ref.router.navigate(['erp/' + this_ref.prams['collection'].replace(".", "/")]) }, 3000);
				});
			});
		}
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

	costing(form) {
		jQuery("input.fconsume1").each(function (i, obj) {
			form.items.fabric[i].fconsume1 = obj.value;
		});
		jQuery("input.afconsume1").each(function (i, obj) {
			form.items.accessories[i].fconsume1 = obj.value;
		});
		jQuery("input.pfconsume1").each(function (i, obj) {
			form.items.process[i].fconsume1 = obj.value;
		});
		jQuery("input.fconsume2").each(function (i, obj) {
			form.items.fabric[i].fconsume2 = obj.value;
		});
		jQuery("input.afconsume2").each(function (i, obj) {
			form.items.accessories[i].fconsume2 = obj.value;
		});
		jQuery("input.pfconsume2").each(function (i, obj) {
			form.items.process[i].fconsume2 = obj.value;
		});

		jQuery("input.amount1").each(function (i, obj) {
			form.items.fabric[i].amount1 = obj.value;
		});
		jQuery("input.aamount1").each(function (i, obj) {
			form.items.accessories[i].amount1 = obj.value;
		});
		jQuery("input.pamount1").each(function (i, obj) {
			form.items.process[i].amount1 = obj.value;
		});
		jQuery("input.eamount1").each(function (i, obj) {
			form.expense[i].amount1 = obj.value;
		});
		jQuery("input.amount2").each(function (i, obj) {
			form.items.fabric[i].amount2 = obj.value;
		});
		jQuery("input.aamount2").each(function (i, obj) {
			form.items.accessories[i].amount2 = obj.value;
		});
		jQuery("input.pamount2").each(function (i, obj) {
			form.items.process[i].amount2 = obj.value;
		});
		jQuery("input.eamount2").each(function (i, obj) {
			form.expense[i].amount2 = obj.value;
		});
		form.cost.cost1 = Number(jQuery("input.cost1").eq(0).val()).toFixed(2);
		form.cost.cost2 = Number(jQuery("input.cost2").eq(0).val()).toFixed(2);
		form.cost.total1 = Number(jQuery("input.total1").eq(0).val()).toFixed(2);
		form.cost.total2 = Number(jQuery("input.total2").eq(0).val()).toFixed(2);
		form.cost.tcost1 = Number(jQuery("input.tcost1").eq(0).val()).toFixed(2);
		form.cost.tcost2 = Number(jQuery("input.tcost2").eq(0).val()).toFixed(2);
		form.cost.quoted = Number(jQuery("input.quoted").eq(0).val()).toFixed(2);
		form.cost.closed = Number(jQuery("input.closed").eq(0).val()).toFixed(2);
		form.cost.rej1 = Number(jQuery("input.rej1").eq(0).val()).toFixed(2);
		form.cost.rej2 = Number(jQuery("input.rej2").eq(0).val()).toFixed(2);
		form.cost.ovh1 = Number(jQuery("input.ovh1").eq(0).val()).toFixed(2);
		form.cost.ovh2 = Number(jQuery("input.ovh2").eq(0).val()).toFixed(2);
		form.cost.com1 = Number(jQuery("input.com1").eq(0).val()).toFixed(2);
		form.cost.com2 = Number(jQuery("input.com2").eq(0).val()).toFixed(2);
		form.cost.qo = Number(jQuery("input.qo").eq(0).val()).toFixed(2);
		form.cost.cl = Number(jQuery("input.cl").eq(0).val()).toFixed(2);
		form.cost.del1 = Number(jQuery("input.del1").eq(0).val()).toFixed(2);
		form.cost.del2 = Number(jQuery("input.del2").eq(0).val()).toFixed(2);
		form.cost.exr1 = Number(jQuery("input.exr1").eq(0).val()).toFixed(2);
		form.cost.exr2 = Number(jQuery("input.exr2").eq(0).val()).toFixed(2);
		form.cost.delc1 = Number(jQuery("input.delc1").eq(0).val()).toFixed(2);
		form.cost.delc2 = Number(jQuery("input.delc2").eq(0).val()).toFixed(2);
		form.pic = jQuery("input.pic").eq(1).val();
	}
}
