import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationLogsComponent } from './operation-logs.component';

describe('OperationLogsComponent', () => {
  let component: OperationLogsComponent;
  let fixture: ComponentFixture<OperationLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
