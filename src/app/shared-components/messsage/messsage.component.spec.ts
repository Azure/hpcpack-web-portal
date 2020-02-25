import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material';

import { MaterialModule } from '../../material.module'
import { MesssageComponent } from './messsage.component';

describe('MesssageComponent', () => {
  let component: MesssageComponent;
  let fixture: ComponentFixture<MesssageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
      declarations: [ MesssageComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesssageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
