import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErpmoduleComponent } from './erpmodule/erpmodule.component';
import { DoctypeComponent } from './doctype/doctype.component';
import { FormbuilderComponent } from './formbuilder/formbuilder.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
	imports: [
		RouterModule.forRoot([
			{ path: '', component: LoginComponent },
			{ path: 'login', component: LoginComponent },
			{ path: 'logout', component: LogoutComponent },
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'erp/:module/:part', component: ErpmoduleComponent },
			{ path: 'admin/:collection', component: FormbuilderComponent },
			{ path: 'erp/:type/:collection/:id', component: DoctypeComponent },
			{ path: 'erp/:type/:collection/:id/:copy', component: DoctypeComponent },
			{ path: 'new/:type/:collection', component: DoctypeComponent },
			{ path: 'script/:type/:collection/:id', component: DoctypeComponent },
			{ path: 'script/:type/:collection', component: DoctypeComponent },
			{ path: '404', component: NotFoundComponent },
			{ path: '**', redirectTo: '/404' }
		])
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }