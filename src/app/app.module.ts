import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { MaterialModule } from './material.module'
import { AppComponent, UPDATE_URL } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ApiService, BASE_PATH, Configuration } from './services/api.service';
import { ApiConfigService } from './services/api-config.service';
import { RemoteCommandService } from './services/remote-command.service'
import { MediaQueryService } from './services/media-query.service'
import { ClusterMetricService } from './services/cluster-metric.service'
import { MesssageService } from './services/messsage.service';
import { GoogleAnalyticsService, GA_TRACK_ID } from './services/google-analytics.service';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SharedComponentsModule } from './shared-components/shared-components.module'

const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule),
      canLoad: [AuthGuardService],
      data: { breadcrumb: "Dashboard" }
    },
    {
      path: 'nodes',
      loadChildren: () => import('./nodes/nodes.module').then(mod => mod.NodesModule),
      canLoad: [AuthGuardService],
      data: { breadcrumb: "Nodes" }
    },
    {
      path: 'jobs',
      loadChildren: () => import('./jobs/jobs.module').then(mod => mod.JobsModule),
      canLoad: [AuthGuardService],
      data: { breadcrumb: "Jobs" }
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module').then(mod => mod.ChartsModule),
      canLoad: [AuthGuardService],
      data: { breadcrumb: "Charts" }
    },
    {
      path: 'logs',
      loadChildren: () => import('./operation-logs/operation-logs.module').then(mod => mod.OperationLogsModule),
      canLoad: [AuthGuardService],
      data: { breadcrumb: "Operation Logs" }
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
    BreadcrumbComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MaterialModule,
    SharedComponentsModule,
  ],
  providers: [
    AuthService,
    UserService,
    ApiService,
    RemoteCommandService,
    MediaQueryService,
    ClusterMetricService,
    MesssageService,
    GoogleAnalyticsService,
    { provide: UPDATE_URL, useValue: environment.UPDATE_URL },
    { provide: GA_TRACK_ID, useValue: environment.GA_TRACK_ID },
    { provide: BASE_PATH, useValue: environment.API_BASE_PATH },
    { provide: Configuration, useClass: ApiConfigService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
