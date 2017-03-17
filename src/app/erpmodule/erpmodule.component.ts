import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { MyService } from '../my.service';

import { CoolLocalStorage } from 'angular2-cool-storage';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

declare var jQuery: any;

@Component({
	selector: 'app-erpmodule',
	templateUrl: './erpmodule.component.html',
	providers: [MyService],
	styleUrls: ['./erpmodule.component.css']
})
export class ErpmoduleComponent implements OnInit {

	title = "Erp Module";
	subtitle = "";
	data: any;
	table: any;
	thead: any = [];
	set: any;
	view: any = [];
	cols: any = [];

	toast: EventEmitter<any> = new EventEmitter();
	msg: any;

	// pagination
	currentPage: number = 1;
	page: any;
	max: number;

	collection: any;
	eve: EventEmitter<any> = new EventEmitter();
	search: any = '';

	constructor(route: ActivatedRoute, localStore: CoolLocalStorage, private router: Router,
		private myservice: MyService,
		private toastyService: ToastyService, private toastyConfig: ToastyConfig) {

		route.params.subscribe(p => {
			this.title = p['module'];
			this.data = p;
			this.eve.emit(null);
		});
		if (!localStore.getItem("user")) {
			router.navigate(['login']);
		}
		this.myservice.getUser().subscribe(data => {
			let role = "";
			if (typeof data.json()[0] != 'undefined') {
				role = data.json()[0].role;
				//   console.log(role);
			}
		});
	}

	ngOnInit() {
		var this_ref = this;
		this.getData(this.data);
		this.eve.subscribe(data => {
			this.thead = [];
			this.cols = [];
			this.search = '';
			this.currentPage = 1;
			this.getData(this.data);
		});
		this.toast.subscribe(data => {
			//   console.log(data);
			this.addToast("Success", String(data), "success");
		});
		jQuery("select[name='cols']").select2({
			placeholder: "Columns"
		});
		jQuery("input.search").on("keyup", function () {
			this_ref.search = jQuery("input.search").val();
			this_ref.getData(this_ref.data);
		});
	}

	getData(name: any, page?: number) {
		//   jQuery("div.spinner").center(true);
		var this_ref = this;
		jQuery("div.loader").show();
		this.myservice.getModuleSettings(name['module']).subscribe(setting => {
			this.set = setting.json();
		}, err => { }, () => {
			this.collection = name['module'] + "." + name['part'];
			this.subtitle = name['part'];
			this.myservice.getModuleData(this.collection, this.search).subscribe(data => {
				this.table = data.json();
				if (this.table.length !== 0) {
					let i = 0;
					for (let itm of Object.keys(this.table[0])) {
						if (!(itm == 'timestamp')) {
							this.cols[i] = itm;
							i++;
						}
					}
					i = 0;
					for (let itm of Object.keys(this.table[0]).splice(1, this.set[0].settings.cols)) {
						if (!(itm == 'timestamp')) {
							this.thead[i] = itm;
							i++;
						}
					}
					//   this.thead = Object.keys(this.table[0]).splice(1, this.set[0].settings.cols);
				}
			}, err => { }, () => {
				this.myservice.countRows(this.collection, this.search).subscribe(cnt => {
					this.max = Math.ceil(Number(cnt.text()) / 15);
					if (this.max <= 5) {
						this.pagesCreate(1, this.max);
					} else {
						this.pagesCreate(1, 5);
					}
					jQuery("button.goto").click(function () {
						if (this_ref.currentPage == jQuery("input[name='goto']").val()) {
							this_ref.thead = jQuery("select[name='cols']").val();
						}
						this_ref.currentPage = jQuery("input[name='goto']").val();
						this_ref.getPageItems(this_ref.currentPage);
						jQuery("ul.pagination li").removeClass("active");
						jQuery("#" + this_ref.currentPage).addClass("active");
						this_ref.paginate(Number(this_ref.currentPage));
					});
				}, err => { }, () => {
					jQuery("div.loader").hide();
				});
			});
		});
	}

	delete(id: any, i: any) {
		jQuery("div.loader").show();
		let collection = this.data['module'] + "." + this.data['part'];
		this.myservice.deleteItem(collection, id).subscribe(data => {
			this.msg = data.json()['success'];
		}, err => { }, () => {
			this.table.splice(i, 1);
			if (!this.table[0]) {
				this.thead = undefined;
			}
			this.toast.emit(this.msg);
			jQuery("div.loader").hide();
		});
	}

	pagesCreate(min: number = 1, max: any) {
		let i = min;
		var this_ref = this;
		jQuery("ul.pagination").empty();
		while (i <= max) {
			jQuery("ul.pagination").append('<li style="cursor:pointer" id="' + i + '"><a>' + i + '</a></li>');
			jQuery("#" + i).click(function () {
				this_ref.changePage(Number(jQuery(this).find("a")[0].outerText));
			});
			i++;
		}
		jQuery("ul.pagination li").removeClass("active");
		jQuery("#" + this.currentPage).addClass("active");
	}

	getPageItems(pageNo: number) {
		if (pageNo == 1) {
			return;
		} else {
			let skip = 15 * pageNo - 15;
			let collection = this.data['module'] + "." + this.data['part'];
			jQuery("div.loader").show();
			this.myservice.getModuleData(collection, this.search, skip).subscribe(data => {
				this.table = data.json();
			}, err => { }, () => {
				jQuery("div.loader").hide();
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

	paginate(pageNo: number) {
		if (pageNo < 3) {
			if (this.max <= 5) {
				this.pagesCreate(1, this.max);
			} else {
				this.pagesCreate(1, 5);
			}
		} else if (pageNo > (this.max - 2)) {
			this.pagesCreate((this.max) - 4, this.max);
		} else {
			this.pagesCreate((pageNo - 2), (pageNo + 2));
		}
	}

	changePage(pageNo: number) {
		this.currentPage = pageNo;
		this.paginate(pageNo);
		this.getPageItems(pageNo);
	}

	show(id: any, index: any) {
		let arr: Object = {};
		this.view = [];
		for (let ind in this.table[index]) {
			//if(!(ind == 'timestamp' || ind == 'createdBy' || ind == '_id')){
			if (!(ind == 'timestamp')) {
				arr[ind] = this.table[index][ind];
			}
		}
		var array = jQuery.map(arr, function (value, index) {
			return [[index, value]];
		});
		this.view.push(array);
		jQuery('.modal').modal({ show: true });
	}

	isObject(val: any) {
		return typeof val === 'object';
	}

	isChildObj(val: any) {
		let obj = false;
		for (let key in val) {
			if (typeof val['key'] === 'object') {
				obj = true
			}
		}
		return obj;
	}

}
