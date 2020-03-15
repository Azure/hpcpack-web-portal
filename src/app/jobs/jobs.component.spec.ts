import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLinkDirectiveStub } from '../../test-stubs';
import { MaterialModule } from '../material.module';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { JobsComponent } from './jobs.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

describe('JobsComponent', () => {
  let component: JobsComponent;
  let fixture: ComponentFixture<JobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MaterialModule,
        SharedComponentsModule,
      ],
      declarations: [ RouterLinkDirectiveStub, JobsComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: UserService, useValue: { userOptions: { jobOptions: {} } } },
        { provide: ApiService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsComponent);
    component = fixture.componentInstance;
    //TODO: uncomment the following line.
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
