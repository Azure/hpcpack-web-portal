import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseChartDirectiveStub } from '../../test-stubs'
import { ApiService } from '../services/api.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        BaseChartDirectiveStub,
      ],
      providers: [
        { provide: ApiService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    //TODO: Uncomment the following line.
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
