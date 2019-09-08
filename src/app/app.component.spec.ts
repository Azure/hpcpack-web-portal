import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from './material.module'
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';

@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
      ],
      declarations: [
        RouterOutletStubComponent,
        AppComponent
      ],
      providers: [
        { provide: Router, useValue: {} },
        { provide: AuthService, useValue: {} },
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
