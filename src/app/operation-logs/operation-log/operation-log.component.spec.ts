import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationLogComponent } from './operation-log.component';

describe('OperationLogComponent', () => {
  let component: OperationLogComponent;
  let fixture: ComponentFixture<OperationLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
