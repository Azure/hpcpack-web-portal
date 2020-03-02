import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { MaterialModule } from '../material.module'
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { OperationLogsComponent } from './operation-logs.component';

describe('OperationLogsComponent', () => {
  let component: OperationLogsComponent;
  let fixture: ComponentFixture<OperationLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MaterialModule,
        SharedComponentsModule,
      ],
      providers: [
        { provide: UserService, useValue: { userOptions: {} } },
        { provide: ApiService, useValue: {} },
      ],
      declarations: [ OperationLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationLogsComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
