import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class MyService {
	private ip = 'http://138.197.220.205';

	constructor(private localStorage: CoolLocalStorage, private http: Http) { }

	getModules() {
		let options = this.authHeaderGet();
		return this.http.get(this.ip + '/api/api.php/modules.list', options);
	}

	getAll(collection: any) {
		let options = this.authHeaderGet();
		return this.http.get(this.ip + '/api/api.php/' + collection, options);
	}

	getModuleData(collection: any, search = '', skip = 0, limit = 15) {
		let options = this.authHeaderGet();
		return this.http.get(this.ip + '/api/api.php/' + collection + '?search=' + search + '&limit=' + limit + '&skip=' + skip, options);
	}

	getModuleSettings(collection: any) {
		let options = this.authHeaderGet();
		return this.http.get(this.ip + '/api/api.php/modules.settings?filters[]=module,eq,' + collection, options);
	}

	deleteItem(collection: any, id: any) {
		let options = this.authHeaderGet();
		return this.http.delete(this.ip + '/api/api.php/' + collection + '/' + id, options);
	}

	getItemData(collection: any, id: any) {
		let options = this.authHeaderGet();
		return this.http.get(this.ip + '/api/api.php/' + collection + '/' + id, options);
	}

	countRows(collection: any, search = '') {
		let options = this.authHeaderGet();
		return this.http.get(this.ip + '/api/api.php/' + collection + '?count=true&search=' + search, options);
	}

	getSchema(mod: any) {
		let options = this.authHeaderGet();
		return this.http.get(this.ip + '/api/api.php/modules.forms?filters[]=module,eq,' + mod, options);
	}

	getScript(module: any) {
		let options = this.authHeaderGet();
		return this.http.get(this.ip + '/api/api.php/scripts?module=' + module, options);
	}

	insertData(collection: any, data: any) {
		let options = this.authHeaderPost();
		return this.http.post(this.ip + '/api/api.php/' + collection, data, options);
	}

	insertScript(data: any) {
		let options = this.authHeaderPost();
		return this.http.post(this.ip + '/api/api.php/scripts', data, options);
	}

	updateData(collection: any, id: any, type = 'set', data: any) {
		let options = this.authHeaderPost();
		return this.http.put(this.ip + '/api/api.php/' + type + '/' + collection + '/' + id, data, options);
	}

	private authHeaderGet() {
		let auth = JSON.parse(this.localStorage.getItem('user'))['_id'] + ':' + this.localStorage.getItem('x-hash2');
		let headers = new Headers({ 'X-Custom-Auth': auth });
		let options = new RequestOptions({ headers: headers });
		return options;
	}

	private authHeaderPost() {
		let auth = JSON.parse(this.localStorage.getItem('user'))['_id'] + ':' + this.localStorage.getItem('x-hash2');
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'X-Custom-Auth': auth });
		let options = new RequestOptions({ headers: headers });
		return options;
	}

	getUser() {
		let options = this.authHeaderGet();
		let id = JSON.parse(this.localStorage.getItem('user'))['_id'];
		return this.http.get(this.ip + '/api/api.php/users.info?filters[]=uid,eq,' + id, options);
	}

	logout() {
		let options = this.authHeaderGet();
		return this.http.get(this.ip + '/api/api.php', options);
	}

}
