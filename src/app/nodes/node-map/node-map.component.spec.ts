import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeMapComponent } from './node-map.component';

describe('NodeMapComponent', () => {
  let component: NodeMapComponent;
  let fixture: ComponentFixture<NodeMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
