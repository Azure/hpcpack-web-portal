import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { RouterLinkDirectiveStub } from 'src/test-stubs';
import { MaterialModule } from '../../material.module'
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service'
import { NodeListComponent } from './node-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';

describe('NodeListComponent', () => {
  let component: NodeListComponent;
  let fixture: ComponentFixture<NodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MaterialModule,
        SharedComponentsModule,
      ],
      declarations: [
        RouterLinkDirectiveStub,
        NodeListComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: UserService, useValue: { userOptions: { nodeOptions: {} } } },
        { provide: ApiService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeListComponent);
    component = fixture.componentInstance;
    //TODO: uncomment the following line.
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
