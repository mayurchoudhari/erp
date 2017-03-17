import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { PathLocationStrategy, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CoolStorageModule } from 'angular2-cool-storage';
import { DndModule } from 'ng2-dnd';
import { ToastyModule } from 'ng2-toasty';
import { NgUploaderModule } from 'ngx-uploader';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from "angular2-schema-form";
// import {Ng2PaginationModule} from 'ng2-pagination';

import { AppRoutingModule } from './routes';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErpmoduleComponent } from './erpmodule/erpmodule.component';
import { DoctypeComponent } from './doctype/doctype.component';
import { FormbuilderComponent } from './formbuilder/formbuilder.component';
import { MapToIterablePipe } from './map-to-iterable.pipe';
import { MenuComponent } from './menu/menu.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		LogoutComponent,
		DashboardComponent,
		ErpmoduleComponent,
		DoctypeComponent,
		FormbuilderComponent,
		MapToIterablePipe,
		MenuComponent,
		NotFoundComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		JsonpModule,
		CoolStorageModule,
		AppRoutingModule,
		DndModule.forRoot(),
		ToastyModule.forRoot(),
		SchemaFormModule,
		NgUploaderModule
	],
	providers: [{provide: LocationStrategy, useClass: HashLocationStrategy},
				{ provide: WidgetRegistry, useClass: DefaultWidgetRegistry }],
	bootstrap: [AppComponent]
})
export class AppModule { }
