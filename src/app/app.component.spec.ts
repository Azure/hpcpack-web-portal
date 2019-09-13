import { TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterOutletStubComponent, RouterLinkDirectiveStub } from '../test-stubs'
import { MaterialModule } from './material.module'
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
      ],
      declarations: [
        RouterOutletStubComponent,
        RouterLinkDirectiveStub,
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
