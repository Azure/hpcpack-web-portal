import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ApiModule, DefaultService, Configuration, ConfigurationParameters, BASE_PATH } from './api-client';

import { MaterialModule } from './material.module'
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { ApiConfigService } from './api-config.service';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule),
      canLoad: [AuthGuardService],
    },
    {
      path: 'nodes',
      loadChildren: () => import('./nodes/nodes.module').then(mod => mod.NodesModule),
      canLoad: [AuthGuardService],
    },
    {
      path: 'jobs',
      loadChildren: () => import('./jobs/jobs.module').then(mod => mod.JobsModule),
      canLoad: [AuthGuardService],
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module').then(mod => mod.ChartsModule),
      canLoad: [AuthGuardService],
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
  ]
}];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
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
