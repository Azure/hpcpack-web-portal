import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '../material.module'
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service'
import { JobsComponent } from './jobs.component';

describe('JobsComponent', () => {
  let component: JobsComponent;
  let fixture: ComponentFixture<JobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
      declarations: [ JobsComponent ],
      providers: [
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
