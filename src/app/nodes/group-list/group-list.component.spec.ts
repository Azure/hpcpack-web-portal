import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from 'src/app/material.module';
import { UserService } from 'src/app/services/user.service';
import { ApiService } from 'src/app/services/api.service';
import { RouterLinkDirectiveStub } from 'src/test-stubs';
import { GroupListComponent } from './group-list.component';
import { SharedComponents } from 'src/app/shared-components/shared-components.module';


describe('GroupListComponent', () => {
  let component: GroupListComponent;
  let fixture: ComponentFixture<GroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MaterialModule,
        SharedComponents,
      ],
      declarations: [
        RouterLinkDirectiveStub,
        GroupListComponent,
      ],
      providers: [
        { provide: UserService, useValue: { userOptions: { nodeGroupOptions: {} } } },
        { provide: ApiService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupListComponent);
    component = fixture.componentInstance;
    //TODO: uncomment the following line.
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
