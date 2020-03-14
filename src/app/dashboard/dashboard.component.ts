import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { MediaQueryService, WidthChangeEventHandler } from '../services/media-query.service';
import { DataPoint, sampleLastInEachHour } from '../utils/metric'
import { formatDateToHour, formatDateToHourAndMinute } from '../utils/date'

interface ChartConfigItem {
  name: string,
  alias?: string,
  color: string,
}

function setArray<T>(value: Array<T>, newValue: Array<T>): void {
  value.length = 0;
  for (let e of newValue) {
    value.push(e);
  }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly nodeStateStatConfig: ChartConfigItem[] = [
    { name: 'Unknown', color: 'gray' },
    { name: 'Provisioning', color: 'lightgreen' },
    { name: 'Offline', color: 'blue' },
    { name: 'Starting', color: 'lightblue' },
    { name: 'Online', color: 'green' },
    { name: 'Draining', color: 'lightslategray' },
    { name: 'Rejected', color: 'lightyellow' },
    { name: 'Removing', color: 'lightcoral' },
    { name: 'NotDeployed', color: 'lightgray' },
    { name: 'Stopping', color: 'lightskyblue' },
  ]

  private readonly nodeStateStatConfigMap: Map<string, ChartConfigItem> = new Map<string, ChartConfigItem>(this.nodeStateStatConfig.map(e => [e.name, e]));

  private readonly nodeHealthStatConfig: ChartConfigItem[] = [
    { name: 'OK', color: 'green' },
    { name: 'Warning', color: 'yellow' },
    { name: 'Error', color: 'red' },
    { name: 'Transitional', color: 'blue' },
    { name: 'Unapproved', color: 'gray' },
  ]

  private readonly nodeHealthStatConfigMap: Map<string, ChartConfigItem> = new Map<string, ChartConfigItem>(this.nodeHealthStatConfig.map(e => [e.name, e]));

  get stateChartReady(): boolean {
    return this.stateChartData && this.stateChartData.length > 0;
  }

  stateChartLabels: Label[] = [];

  stateChartColors: Color[] = [
    { backgroundColor: [] }
  ];

  stateChartData: number[] = [];

  stateChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'Node State',
    },
    legend: {
      position: 'bottom',
    },
  }

  healthChartLabels: Label[] = [];

  healthChartColors: Color[] = [
    { backgroundColor: [] }
  ];

  healthChartData: number[] = [];

  healthChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'Node Health',
    },
    legend: {
      position: 'bottom',
    },
  }

  private readonly jobMetricInstanceConfig: ChartConfigItem[] = [
    {
      name: 'Number of configuring jobs',
      alias: 'Configuring',
      color: 'lightblue'
    },
    {
      name: 'Number of canceled jobs',
      alias: 'Canceled',
      color: 'gray'
    },
    {
      name: 'Number of failed jobs',
      alias: 'Failed',
      color: 'red'
    },
    {
      name: 'Number of finished jobs',
      alias: 'Finished',
      color: 'green'
    },
    {
      name: 'Number of queued jobs',
      alias: 'Queued',
      color: 'darkslategrey'
    },
    {
      name: 'Number of running jobs',
      alias: 'Running',
      color: 'blue'
    },
    {
      name: 'Total number of jobs',
      alias: 'Total',
      color: 'purple'
    },
  ];

  private readonly jobMetricInstanceConfigMap: Map<string, number> = new Map(this.jobMetricInstanceConfig.map((e, i) => [e.name, i]));

  readonly jobChartColors: Color[] = this.jobMetricInstanceConfig.map(e => ({ borderColor: e.color, backgroundColor: 'rgba(0,0,0,0)' }));

  jobChartLabels: Label[] = [];

  jobChartData: ChartDataSets[] = [
    {
      data: [],
      label: '',
      steppedLine: 'before',
      pointRadius: 0,
    },
  ];

  private getJobChartOptions(): ChartOptions {
    return {
      responsive: true,
      aspectRatio: this.mediaQuery.smallWidth ? 1.5 : 3,
      title: {
        display: true,
        text: 'Job Throughput',
      },
      legend: {
        position: 'bottom',
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              maxTicksLimit: this.mediaQuery.smallWidth ? 3 : 5,
              maxRotation: 0,
            }
          }
        ],
      },
    };
  }

  jobChartOptions: ChartOptions = this.getJobChartOptions();

  private subscription: Subscription;

  private readonly updateInterval: number = 60 * 1000;

  @ViewChild('jobchart', { read: BaseChartDirective, static: false })
  private jobChart: BaseChartDirective;

  private onWidthChange: WidthChangeEventHandler = (q: MediaQueryService) => {
    this.jobChart.chart.options = this.getJobChartOptions();
    //TODO: This doesn't work anyway!
    this.jobChart.chart.update();
  }

  constructor(
    private router: Router,
    private api: ApiService,
    public mediaQuery: MediaQueryService,
  ) {}

  ngOnInit() {
    //this.mediaQuery.addWidthChangeEventHandler(this.onWidthChange);

    this.subscription = new Subscription();
    let sub: any = this.api.repeat(this.api.getClusterNodeStatOfState(), this.updateInterval / 2).subscribe(data => {
      setArray(this.stateChartData, data.map(e => e.Value));
      setArray(this.stateChartLabels, data.map(e => e.Name));
      this.stateChartColors[0].backgroundColor = data.map(e => this.nodeStateStatConfigMap.get(e.Name).color)
    });
    this.subscription.add(sub);

    sub = this.api.repeat(this.api.getClusterNodeStatOfHealth(), this.updateInterval / 2).subscribe(data => {
      setArray(this.healthChartData, data.map(e => e.Value));
      setArray(this.healthChartLabels, data.map(e => e.Name));
      this.healthChartColors[0].backgroundColor = data.map(e => this.nodeHealthStatConfigMap.get(e.Name).color)
    });
    this.subscription.add(sub);

    sub = this.api.getClusterJobMetricsInLoop(this.updateInterval).subscribe(data => {
      if (data.Instances.length == 0 || data.Instances[0].Values.length == 0) {
        return;
      }
      //When there're data more than 2 hours, reduce it.
      if (data.Instances[0].Values.length > 120) {
        for (let instance of data.Instances) {
          instance.Values = sampleLastInEachHour(instance.Values as DataPoint[]);
        }
        this.jobChartLabels = data.Instances[0].Values.map(e => formatDateToHour(new Date(e.Key)));
      }
      else {
        this.jobChartLabels = data.Instances[0].Values.map(e => formatDateToHourAndMinute(new Date(e.Key)));
      }
      let dataSets: ChartDataSets[] = [];
      for (let instance of data.Instances) {
        let idx = this.jobMetricInstanceConfigMap.get(instance.InstanceName);
        dataSets[idx] = {
          data: instance.Values.map(e => +e.Value.toFixed(2)),
          label: this.jobMetricInstanceConfig[idx].alias,
          steppedLine: 'before',
          pointRadius: 0,
        }
      }
      this.jobChartData = dataSets;
    });
    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    //this.mediaQuery.removeWidthChangeEventHandler(this.onWidthChange);
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  chartHover(e: any): void {
    e.event.target.style.cursor = 'pointer'
  }

  stateChartClick(e: any): void {
    if (e.active.length > 0) {
      let idx: number = e.active[0]._index;
      let value = this.stateChartLabels[idx];
      this.router.navigate(['/nodes'], { queryParams: { state: value }});
    }
  }

  healthChartClick(e: any): void {
    if (e.active.length > 0) {
      let idx: number = e.active[0]._index;
      let value = this.healthChartLabels[idx];
      this.router.navigate(['/nodes'], { queryParams: { health: value }});
    }
  }
}
