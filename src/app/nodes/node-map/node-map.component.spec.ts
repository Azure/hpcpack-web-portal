import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module'
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service'
import { NodeMapComponent } from './node-map.component';

describe('NodeMapComponent', () => {
  let component: NodeMapComponent;
  let fixture: ComponentFixture<NodeMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, MaterialModule ],
      declarations: [ NodeMapComponent ],
      providers: [
        { provide: UserService, useValue: { userOptions: { nodeMetricOptions: { metricRanges: {} } } } },
        { provide: ApiService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeMapComponent);
    component = fixture.componentInstance;
    //TODO: uncomment the following line.
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
