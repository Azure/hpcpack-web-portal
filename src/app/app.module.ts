import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { MaterialModule } from './material.module'
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ApiService, BASE_PATH, Configuration } from './services/api.service';
import { ApiConfigService } from './services/api-config.service';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SharedComponents } from './shared-components/shared-components.module'

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
    SharedComponents,
  ],
  providers: [
    AuthService,
    UserService,
    ApiService,
    { provide: BASE_PATH, useValue: environment.API_BASE_PATH },
    { provide: Configuration, useClass: ApiConfigService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
