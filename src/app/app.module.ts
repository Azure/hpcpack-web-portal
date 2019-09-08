import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ApiModule, DefaultService, Configuration, ConfigurationParameters, BASE_PATH } from './api-client';

import { MaterialModule } from './material.module'
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { ApiConfigService } from './api-config.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
      { path: 'login', component: LoginComponent },
    ]),
    ApiModule,
    MaterialModule,
  ],
  providers: [
    AuthService,
    UserService,
    { provide: BASE_PATH, useValue: environment.API_BASE_PATH },
    { provide: Configuration, useClass: ApiConfigService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
