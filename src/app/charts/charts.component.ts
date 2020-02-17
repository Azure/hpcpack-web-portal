import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ViewRef, ComponentRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MetricDefinition } from 'src/app/services/api.service';
import { ClusterMetricService } from 'src/app/services/cluster-metric.service'
import { UserService } from 'src/app/services/user.service'
import { ChartOption } from 'src/app/models/user-options'
import { ChartComponent } from './chart/chart.component';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnDestroy {
  @ViewChild('chart', { read: ViewContainerRef, static: true })
  private chartContainer: ViewContainerRef;

  chartFactory: ComponentFactory<ChartComponent>;

  metrics: MetricDefinition[] = null;

  selectedMetric: string;

  private subscription: Subscription;

  get metricLabel(): string {
    return this.metrics === null ? 'Loading...' : 'Metric';
  }

  private charts = new Map<ComponentRef<ChartComponent>, ChartOption>();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private metricService: ClusterMetricService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.chartFactory = this.componentFactoryResolver.resolveComponentFactory(ChartComponent);
    this.subscription = this.metricService.getMetricDefinitions().subscribe(data => {
      this.metrics = data;
      this.addCharts();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.saveChartOptions();
  }

  addChart(metricName: string, timeWindow?: number): void {
    let chart = this.chartContainer.createComponent(this.chartFactory);
    chart.instance.metricName = metricName;
    if (timeWindow !== undefined) {
      chart.instance.timeWindow = timeWindow;
    }
    chart.instance.close.subscribe(() => this.removeChart(chart));
    chart.instance.timeWindowChange.subscribe((value: number) => {
      let opt = this.charts.get(chart);
      opt.timeWindow = value;
    })
    this.charts.set(chart, { name: metricName, timeWindow: chart.instance.timeWindow });
  }

  removeChart(chart: ComponentRef<ChartComponent>): void {
    this.charts.delete(chart);
    let index = this.chartContainer.indexOf(chart.hostView);
    this.chartContainer.remove(index);
  }

  private addCharts(): void {
    let charts = this.userService.userOptions.chartOptions || [];
    for (let chart of charts) {
      this.addChart(chart.name, chart.timeWindow);
    }
  }

  private saveChartOptions(): void {
    this.userService.userOptions.chartOptions = Array.from(this.charts.values());
    this.userService.saveUserOptions();
  }
}
