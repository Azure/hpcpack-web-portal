import { Component, OnInit, OnDestroy } from '@angular/core';
import { Label, MultiDataSet, Color } from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';

import { ApiService, MetricInstanceData } from '../services/api.service';
import { Subscription } from 'rxjs';

interface DataPoint { Key: string, Value: number };

interface MeticInstanceConfig {
  name: string,
  alias: string,
  color: string,
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  nodeChartLabels: Label[] = ['Available', 'Unavailable'];

  nodeChartColors: Color[] = [
    {
      backgroundColor: ['green', 'yellow']
    },
  ]

  nodeChartData: MultiDataSet = [];

  nodeChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'Node Availability',
    },
    legend: {
      position: 'bottom',
    },
  }

  private readonly jobMetricInstanceConfig: MeticInstanceConfig[] = [
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

  jobChartOptions: ChartOptions = {
    responsive: true,
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
            maxTicksLimit: 5,
            maxRotation: 0,
          }
        }
      ],
    },
  };

  private subscription: Subscription;

  private readonly updateInterval: number = 60 * 1000;

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.subscription = this.api.getClusterNodeAvailabilityInLoop(this.updateInterval).subscribe(data => {
      this.nodeChartData = [
        [data.Available, data.Total - data.Available]
      ];
    });
    let sub = this.api.getClusterJobMetricsInLoop(this.updateInterval).subscribe(data => {
      if (data.Instances.length == 0 || data.Instances[0].Values.length == 0) {
        return;
      }
      //When there're data more than 2 hours, reduce it.
      if (data.Instances[0].Values.length > 120) {
        for (let instance of data.Instances) {
          instance.Values = this.sampleLastInEachHour(instance.Values as DataPoint[]);
        }
        this.jobChartLabels = data.Instances[0].Values.map(e => this.formatDateToHour(new Date(Date.parse(e.Key))));
      }
      else {
        this.jobChartLabels = data.Instances[0].Values.map(e => this.formatDateToHourAndMinute(new Date(Date.parse(e.Key))));
      }
      let dataSets: ChartDataSets[] = [];
      for (let instance of data.Instances) {
        let idx = this.jobMetricInstanceConfigMap.get(instance.InstanceName);
        dataSets[idx] = {
          data: instance.Values.map(e => e.Value),
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
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  private normalizeByHour(time: string): Date {
    let t = Date.parse(time);
    let d = new Date(t);
    d.setMinutes(0, 0, 0);
    return d;
  }

  private formatDateToHour(date: Date): string {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()} ${date.getHours()}:00`;
  }

  private formatDateToHourAndMinute(date: Date): string {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()} ${date.getHours()}:${date.getMinutes()}`;
  }

  //Get the first data point in each hour
  //Elements in values are already ordered by time(Key) ascendingly.
  private sampleFirstInEachHour(values: DataPoint[]): DataPoint[] {
    let date: Date = new Date();
    let result: DataPoint[] = [];
    for (let v of values) {
      let d = this.normalizeByHour(v.Key);
      if (d.getTime() != date.getTime()) {
        result.push({ Key: v.Key, Value: v.Value });
        date = d;
      }
    }
    return result;
  }

  //Get the last data point in each hour
  //Elements in values are already ordered by time(Key) ascendingly.
  private sampleLastInEachHour(values: DataPoint[]): DataPoint[] {
    let value: DataPoint = values[0];
    let date: Date = this.normalizeByHour(value.Key);
    let result: DataPoint[] = [];
    for (let v of values) {
      let d = this.normalizeByHour(v.Key);
      if (d.getTime() != date.getTime()) {
        result.push({ Key: value.Key, Value: value.Value });
        date = d;
      }
      value = v;
    }
    let last = values[values.length - 1];
    result.push({ Key: last.Key, Value: last.Value });
    return result;
  }

}
