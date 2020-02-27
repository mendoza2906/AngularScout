import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';
// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { RegisterComponent } from './views/register/register.component';
import { jqxTreeGridModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxtreegrid';
import { jqxTreeModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxtree';
import { jqxTreeGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtreegrid';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ControlAutenticacion } from './security/control-autenticacion';
import { FormsModule } from '@angular/forms';
import { jqxInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxinput';
import { FileService } from './services/file/file.service';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput'
import { jqxDropDownListComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import { jqxPasswordInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpasswordinput';
import { jqxCheckBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcheckbox';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { jqxDropDownButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownbutton';
import { jqxTreeComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtree';

import { jqxExpanderComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxexpander';
;
import { ControlComponent } from './components/control/control.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PlantillaComponent } from './components/plantilla/plantilla.component';
import { AppLayoutComponent } from './components/panel/app-layout.component';
import { PanelComponent } from './components/panel/panel.component';

import { jqxFileUploadComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxfileupload';
import { jqxTabsComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtabs';
import { jqxBarGaugeComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbargauge';
import { jqxRadioButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxradiobutton';
import { jqxDataTableComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxDataTable';
import { LoginComponent } from './views/login/login.component';
import { EasyUIModule } from 'ng-easyui';
import { jqxFormattedInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxformattedinput';
import { jqxMenuModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxmenu';
import { ModalViewModule } from './views/modal-view/modal-view.module';

import { jqxPanelComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxPanel';
import { jqxPanelModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxPanel';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { Base64Util } from './util/base-64-util';
import { AuthService } from './services/auth/auth.service';
import { AccountService } from './services/auth/account.service';
import { TokenService } from './services/auth/token.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { CacheService } from './services/auth/cache.service';
import { LogoutComponent } from './views/logout/logout.component';
import { ScoutModule } from './views/scout/scout.module';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    EasyUIModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ScoutModule,
    jqxTreeGridModule,
    jqxTreeModule,
    jqxInputModule,
    jqxFormattedInputModule,
    jqxMenuModule,
    jqxPanelModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    //ModalViewModule

  ],
  declarations: [
    AppComponent,
    APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    jqxTreeGridComponent,
    jqxValidatorComponent,
    jqxGridComponent,
    jqxTreeGridComponent,
    jqxDateTimeInputComponent,
    jqxDropDownListComponent,
    jqxTextAreaComponent,
    jqxPasswordInputComponent,
    jqxCheckBoxComponent,
    jqxComboBoxComponent,
    jqxDropDownButtonComponent,
    jqxTreeComponent,
    jqxExpanderComponent,
    jqxPasswordInputComponent,
    jqxPanelComponent,
    ControlComponent,
    InicioComponent,
    PlantillaComponent,
    AppLayoutComponent,
    PanelComponent,
    jqxTreeGridComponent,
    jqxFileUploadComponent,
    jqxTabsComponent,
    jqxBarGaugeComponent,
    jqxRadioButtonComponent,
    jqxDataTableComponent,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
    Base64Util, AuthService, AccountService, TokenService, AuthGuardService, CacheService,
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ControlAutenticacion,
    FileService,
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
