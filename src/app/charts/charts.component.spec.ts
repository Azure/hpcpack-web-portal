import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentFactoryResolver } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { UserService } from 'src/app/services/user.service';
import { ClusterMetricService } from 'src/app/services/cluster-metric.service';
import { ChartsComponent } from './charts.component';

describe('ChartsComponent', () => {
  let component: ChartsComponent;
  let fixture: ComponentFixture<ChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NoopAnimationsModule, MaterialModule ],
      providers: [
        { provide: UserService, useValue: { chartOptions: [] } },
        { provide: ClusterMetricService, useValue: {} },
        { provide: ComponentFactoryResolver, useValue: {} },
      ],
      declarations: [ ChartsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsComponent);
    component = fixture.componentInstance;
    //TODO: Uncomment the following line.
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
