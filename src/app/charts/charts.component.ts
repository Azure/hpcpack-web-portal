import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ViewRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService, MetricDefinition } from '../services/api.service';
import { ChartComponent } from './chart/chart.component';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnDestroy {
  @ViewChild('charts', { read: ViewContainerRef, static: true })
  private chartContainer: ViewContainerRef;

  chartFactory: ComponentFactory<ChartComponent>;

  metrics: MetricDefinition[] = null;

  selectedMetric: string;

  private subscription: Subscription;

  get metricLabel(): string {
    return this.metrics === null ? 'Loading...' : 'Metric';
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.chartFactory = this.componentFactoryResolver.resolveComponentFactory(ChartComponent);
    this.subscription = this.api.getClusterMetricDefintions().subscribe(data => {
      this.metrics = data;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  addChart(metricName: string): void {
    let chart = this.chartContainer.createComponent(this.chartFactory);
    chart.instance.metricName = metricName;
    chart.instance.onClose.subscribe(() => this.removeChart(chart.hostView));
  }

  removeChart(chart: ViewRef): void {
    let index = this.chartContainer.indexOf(chart);
    this.chartContainer.remove(index);
  }
}
