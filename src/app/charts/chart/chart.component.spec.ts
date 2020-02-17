import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BaseChartDirectiveStub } from 'src/test-stubs'
import { MaterialModule } from 'src/app/material.module';
import { ClusterMetricService } from 'src/app/services/cluster-metric.service';
import { ApiService } from 'src/app/services/api.service';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MaterialModule
      ],
      providers: [
        { provide: ApiService, useValue: {} },
        { provide: ClusterMetricService, useValue: {} },
        { provide: MediaQueryService, useValue: {} },
      ],
      declarations: [
        BaseChartDirectiveStub,
        ChartComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    //TODO: Uncomment the following line.
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
