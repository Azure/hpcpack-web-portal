import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { MaterialModule } from 'src/app/material.module';
import { MatDialogRefStub } from 'src/test-stubs';
import { GroupSelectorComponent } from './group-selector.component';

describe('GroupSelectorComponent', () => {
  let component: GroupSelectorComponent;
  let fixture: ComponentFixture<GroupSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
      declarations: [ GroupSelectorComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialogRef, useClass: MatDialogRefStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
