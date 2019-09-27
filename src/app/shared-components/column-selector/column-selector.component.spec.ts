import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ColumnSelectorComponent, ColumnSelectorInput } from './column-selector.component';
import { MaterialModule } from '../../material.module'
import { ListItemSelectorComponentStub, MatDialogRefStub } from '../../../test-stubs'

describe('ColumnSelectorComponent', () => {
  let component: ColumnSelectorComponent;
  let fixture: ComponentFixture<ColumnSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
      declarations: [
        ListItemSelectorComponentStub,
        ColumnSelectorComponent
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { selected: [], columns: [] } as ColumnSelectorInput },
        { provide: MatDialogRef, useClass: MatDialogRefStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
