import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { MaterialModule } from '../../material.module'
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service'
import { NodeListComponent } from './node-list.component';
import { ActivatedRoute } from '@angular/router';

describe('NodeListComponent', () => {
  let component: NodeListComponent;
  let fixture: ComponentFixture<NodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NoopAnimationsModule, MaterialModule ],
      declarations: [ NodeListComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
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
