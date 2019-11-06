import { Component, OnInit } from '@angular/core';
import { Label, MultiDataSet, Color } from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  nodeChartLabels: Label[] = ['Available', 'Unavailable'];

  nodeChartColors: Color[] = [
    {
      backgroundColor: ['green', 'yellow']
    },
  ]

  nodeChartData: MultiDataSet = [
    [10, 2]
  ];

  nodeChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'Node Availability',
    },
    legend: {
      position: 'bottom',
    },
  }

  jobChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  jobChartColors: Color[] = [
    {
      borderColor: 'green',
      backgroundColor: 'rgba(0,0,0,0)',
    },
    {
      borderColor: 'red',
      backgroundColor: 'rgba(0,0,0,0)',
    },
  ];

  jobChartData: ChartDataSets[] = [
    {
      data: [65, 59, 80, 81, 56, 55, 40],
      label: 'Finished',
      steppedLine: 'before',
    },
    {
      data: [11, 0, 8, 1, 6, 5, 4],
      label: 'Failed',
      steppedLine: 'before',
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
  };

  constructor() { }

  ngOnInit() {
  }

}
