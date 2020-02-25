import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRefStub } from 'src/test-stubs';
import { GroupEditorComponent } from './group-editor.component';
import { MaterialModule } from 'src/app/material.module';


describe('GroupEditorComponent', () => {
  let component: GroupEditorComponent;
  let fixture: ComponentFixture<GroupEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MaterialModule
      ],
      declarations: [ GroupEditorComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useClass: MatDialogRefStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
