import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { MyService } from '../my.service';

import { CoolLocalStorage } from 'angular2-cool-storage';

declare var jQuery: any;

@Component({
	selector: 'app-formbuilder',
	templateUrl: './formbuilder.component.html',
	providers: [MyService],
	styleUrls: ['./formbuilder.component.css']
})
export class FormbuilderComponent implements OnInit {

	transferData: Object = { id: 1, msg: 'Hello' };
	receivedData: Array<any> = [];
	prams: any;
	collection: any;
	mindisable: boolean = false;
	maxdisable: boolean = false;
	regexdisable: boolean = false;

	// form values
	minLen: number = 0;
	maxLen: number = 0;
	req: boolean = false;
	widget: any;
	regex: any;
	id: any;
	title: any;
	default: any = false;
	doc: any;
	column: any;
	optons: any = [];
	col: any = false;
	field: any = {};
	msg: any;
	form: any;

	private mySchema: any = null;
	mysch: boolean = false;

	constructor(route: ActivatedRoute, private localStorage: CoolLocalStorage, router: Router,
		private myService: MyService) {
		route.params.subscribe(p => {
			this.prams = p;
			this.collection = p['collection'];
		});

		if (!localStorage.getItem("user")) {
			router.navigate(['login']);
		}

		jQuery("div.loader").show();
		this.myService.getSchema(this.collection).subscribe(data => {
			if (typeof data.json()[0] != 'undefined') {
				var array = jQuery.map(data.json()[0].schema.properties, function (value, index) {
					return [[index, value]];
				});
				this.receivedData.push(array);
			}
		}, err => { }, () => {
			this.mysch = true;
			jQuery("div.loader").hide();
		});
	}

	ngOnInit() {
	}

	regexGenerator() {
		if (!this.req) {
			if (this.minLen != 0 && this.maxLen != 0) {
				this.regex = "^[a-zA-Z0-9 @#$%_-]{" + this.minLen + "," + this.maxLen + "}$";
			}
			if (this.minLen == 0 && this.maxLen != 0) {
				this.regex = "^[a-zA-Z0-9 @#$%_-]{1," + this.maxLen + "}$";
			}
			if (this.minLen != 0 && this.maxLen == 0) {
				this.regex = "^[a-zA-Z0-9 @#$%_-]{" + this.minLen + ",}$";
			}
			if (this.minLen == 0 && this.maxLen == 0) {
				this.regex = "^[a-zA-Z0-9 @#$%_-]$";
			}
			if (this.widget == 'tel') {
				this.regex = "^[0-9]{6,12}$";
			}
		} else {
			if (this.minLen != 0 && this.maxLen != 0) {
				this.regex = "(^[a-zA-Z0-9 @#$%_-]{" + this.minLen + "," + this.maxLen + "}$)|(^$)";
			}
			if (this.minLen == 0 && this.maxLen != 0) {
				this.regex = "(^[a-zA-Z0-9 @#$%_-]{1," + this.maxLen + "}$)|(^$)";
			}
			if (this.minLen != 0 && this.maxLen == 0) {
				this.regex = "(^[a-zA-Z0-9 @#$%_-]{" + this.minLen + ",}$)|(^$)";
			}
			if (this.minLen == 0 && this.maxLen == 0) {
				this.regex = "(^[a-zA-Z0-9 @#$%_-]$)|(^$)";
			}
			if (this.widget == 'tel') {
				this.regex = "(^[0-9]{6,12}$)|(^$)";
			}
		}
	}

	options(value: any) {
		this.alldisable(false);
		if (value.srcElement.value == 'email') {
			this.minLen = 6;
			this.mindisable = true;
			this.regexdisable = true
		}
		if (value.srcElement.value == 'password') {
			this.req = true;
			this.minLen = 1;
		}
		if (value.srcElement.value == 'tel') {
			this.alldisable(true);
			this.minLen = 6;
			this.maxLen = 10;
			this.regex = "(^[0-9]{6,12}$)|(^$)";
		}
	}

	save() {
		//   this.regexGenerator();
		if (jQuery("#myForm .ng-invalid").length !== 0) {
			this.msg = "Invalid Form";
		} else {
			this.msg = "Save Successfull";
			if (this.widget == 'email') {
				this.field[this.id] = {};
				this.field[this.id].type = "string";
				if (this.title != "" && this.title != undefined) {
					this.field[this.id].title = this.title;
				}
				if (this.req) {
					this.field[this.id].minLength = 6;
				}
				if (this.maxLen != 0 && this.req) {
					this.field[this.id].maxLength = Number(this.maxLen);
				}
				this.field[this.id].format = "email";
			}
			if (this.widget == 'password') {
				this.field[this.id] = {};
				this.field[this.id].type = "string";
				if (this.title != "" && this.title != undefined) {
					this.field[this.id].title = this.title;
				}
				this.field[this.id].pattern = this.regex;
				this.field[this.id].widget = "password";
			}
			if (this.widget == 'tel') {
				this.field[this.id] = {};
				this.field[this.id].type = "string";
				if (this.title != "" && this.title != undefined) {
					this.field[this.id].title = this.title;
				}
				this.field[this.id].pattern = this.regex;
			}
			if (this.widget == 'date') {
				this.field[this.id] = {};
				this.field[this.id].type = "string";
				if (this.title != "" && this.title != undefined) {
					this.field[this.id].title = this.title;
				}
				this.field[this.id].widget = "date";
			}
			if (this.widget == 'select') {
				this.field[this.id] = {};
				this.field[this.id].type = "string";
				if (this.title != "" && this.title != undefined) {
					this.field[this.id].title = this.title;
				}
				let i = 0; this.field[this.id].oneOf = [];
				for (let val of jQuery("#selectopts").val().split("\n")) {
					this.field[this.id].oneOf[i] = {
						"description": val,
						"enum": [val.toLowerCase()]
					};
					i++;
				}
				this.field[this.id].default = jQuery("#selectopts").val().split("\n")[0];
				this.field[this.id].widget = "select";
			}
			if (this.widget == 'checkbox') {
				this.field[this.id] = {};
				this.field[this.id].type = "boolean";
				if (this.title != "" && this.title != undefined) {
					this.field[this.id].description = this.title;
				}
				this.field[this.id].default = this.default;
			}
			if (this.widget == 'string') {
				this.field[this.id] = {};
				this.field[this.id].type = "string";
				if (this.title != "" && this.title != undefined) {
					this.field[this.id].description = this.title;
				}
				if (this.minLen != 0 && this.req) {
					this.field[this.id].minLength = Number(this.minLen);
				}
				if (this.maxLen != 0 && this.req) {
					this.field[this.id].maxLength = Number(this.maxLen);
				}
				this.field[this.id].pattern = this.regex;
			}
			console.log(JSON.stringify(this.field));
			jQuery('#string').modal("hide");
		}
	}

	savelink() {
		if (jQuery("#myForm3 .ng-invalid").length !== 0) {
			this.msg = "Invalid Form";
		} else {
			this.msg = "Save Successfull";
			this.field[this.id] = {};
			this.field[this.id].type = "string";
			if (this.title != "" && this.title != undefined) {
				this.field[this.id].title = this.title;
			}
			if (this.req) {
				this.field[this.id].readOnly = true;
			}
			this.field[this.id].document = this.doc;
			this.field[this.id].column = this.column;
			this.field[this.id].widget = 'link';
			this.receivedData[0].push([this.id, this.field[this.id]]);
			jQuery('div.modal').hide();
		}
		console.log(this.receivedData);
	}

	getColumn() {
		this.col = true;
		this.myService.countRows(this.doc).subscribe(data => {
			if (data.json() > 0) {
				this.myService.getModuleData(this.doc, '', data.json() - 1, 1).subscribe(dta => {
					let info = dta.json()[0]; var i = 0;
					this.optons = [];
					for (let key in info) {
						if (!(key == "_id" || key == "timestamp" || key == "createdBy")) {
							this.optons[i] = key;
							i++;
						}
					}
				});
			}
		});
	}

	alldisable(t: boolean) {
		//reset
		this.minLen = 0;
		this.maxLen = 0;
		this.req = false;
		//disabled fields enable
		this.mindisable = t;
		this.maxdisable = t;
		this.regexdisable = t;
	}

	/**
	* The $event is a structure:
	* {
	*   dragData: any,
	*   mouseEvent: MouseEvent
	* }
	*/
	transferDataSuccess($event) {
		//   this.receivedData.push($event.dragData.id);
		if ($event.dragData.id == 'string') {
			this.widget = 'string';
			jQuery('#string').modal({ show: true });
			//   jQuery("div#string").show();
		}
		if ($event.dragData.id == 'number') {
			this.widget = 'number';
			jQuery("div#number").show();
		}
		if ($event.dragData.id == 'link') {
			//   this.mysch = false;
			jQuery("div#link").show();
		}
	}

}
