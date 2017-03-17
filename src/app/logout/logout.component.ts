import { Component, OnInit } from '@angular/core';
// import { Http, Response, Jsonp } from '@angular/http';

// import { MyService } from '../my.service';
import { Router } from "@angular/router";
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Cookie } from 'ng2-cookies';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

	constructor(private localStore: CoolLocalStorage, private router: Router) {

		// this.myservice.logout()
		//   .subscribe(data => {
		//       localStorage.setItem('preHash', data.headers.get('x-pre-hash')); // store hash in local storage
		//       this.router.navigate(['login']);
		//       console.log(data.json());
		//   });
		this.localStore.removeItem("x-hash2");
		this.localStore.removeItem("user");
		Cookie.delete("x-hash2");
		Cookie.delete("user");
	}

	ngOnInit() {
		this.router.navigate(['login']);
	}

}
