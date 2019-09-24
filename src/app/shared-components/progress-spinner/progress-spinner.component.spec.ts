import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Overlay } from '@angular/cdk/overlay';

import { MaterialModule } from '../../material.module'
import { ProgressSpinnerComponent } from './progress-spinner.component';

describe('ProgressSpinnerComponent', () => {
  let component: ProgressSpinnerComponent;
  let fixture: ComponentFixture<ProgressSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
      declarations: [
        ProgressSpinnerComponent,
      ],
      providers: [
        { provide: Overlay, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressSpinnerComponent);
    component = fixture.componentInstance;
    //TODO: uncomment this!
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
