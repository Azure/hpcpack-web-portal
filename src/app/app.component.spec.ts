import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutletComponentStub, RouterLinkDirectiveStub } from '../test-stubs'
import { MaterialModule } from './material.module'
import { AppComponent, UPDATE_URL } from './app.component';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { TrackingService, GA_TRACK_ID } from './services/tracking.service';

@Component({ selector: 'app-breadcrumb', template: '' })
class BreadcrumbStubComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
      ],
      declarations: [
        RouterOutletComponentStub,
        RouterLinkDirectiveStub,
        BreadcrumbStubComponent,
        AppComponent
      ],
      providers: [
        { provide: Router, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: ApiService, useValue: {} },
        { provide: TrackingService, useValue: {} },
        { provide: GA_TRACK_ID, useValue: 'id' },
        { provide: UPDATE_URL, useValue: 'url' },
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
