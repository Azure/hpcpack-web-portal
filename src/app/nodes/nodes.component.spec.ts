import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '../material.module'
import { AngularStubs } from '../../test-stubs'
import { NodesComponent } from './nodes.component';

describe('NodesComponent', () => {
  let component: NodesComponent;
  let fixture: ComponentFixture<NodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        AngularStubs,
      ],
      declarations: [ NodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
