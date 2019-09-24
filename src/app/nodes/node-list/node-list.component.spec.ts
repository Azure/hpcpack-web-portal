import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '../../material.module'
import { DefaultService as ApiService } from '../../api-client';
import { UserService } from '../../user.service'
import { NodeListComponent } from './node-list.component';

describe('NodeListComponent', () => {
  let component: NodeListComponent;
  let fixture: ComponentFixture<NodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
      declarations: [ NodeListComponent ],
      providers: [
        { provide: UserService, useValue: { userOptions: { nodeOptions: {} } } },
        { provide: ApiService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeListComponent);
    component = fixture.componentInstance;
    //TODO: uncomment this the following line.
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
