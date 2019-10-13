import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs'
import { NodeMetric } from '../../api-client'
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-node-map',
  templateUrl: './node-map.component.html',
  styleUrls: ['./node-map.component.scss']
})
export class NodeMapComponent implements OnInit, OnDestroy {
  readonly metrics = [
    { value: 'HPCCpuUsage', label: 'CPU Usage (%)', min: 0, max: 100 },
    { value: 'HPCMemoryPaging', label: 'Memory Paging (Hard Faults/Second)', min: 0, max: 10000 },
    { value: 'HPCDiskThroughput', label: 'Disk Throughput (Bytes/Second)', min: 0, max: 20000 },
    { value: 'HPCNetwork', label: 'Network Usage (Bytes/Second)', min: 0, max: 1000000 },
    { value: 'HPCCoresInUse', label: 'Cores in Use', min: 0, max: 8 },
  ];

  private selectedMetricIndex = 0;

  get selectedMetric(): string {
    return this.metrics[this.selectedMetricIndex].value;
  }

  set selectedMetric(value: string) {
    this.selectedMetricIndex = this.metrics.findIndex(e => e.value === value);
  }

  get metricMinValue(): number {
    return this.metrics[this.selectedMetricIndex].min;
  }

  get metricMaxValue(): number {
    return this.metrics[this.selectedMetricIndex].max;
  }

  metricMinInput = this.fb.control(this.metricMinValue);

  metricMaxInput = this.fb.control(this.metricMaxValue);

  private setMetricRange(): void {
    this.metricMinInput.setValue(this.metricMinValue);
    this.metricMaxInput.setValue(this.metricMaxValue);
  }

  nodeMetrics: NodeMetric[];

  private subscription: Subscription;

  blockSize: number = 3;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.watch();
  }

  ngOnDestroy(): void {
    this.reset();
  }

  private reset(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  private watch(): void {
    this.subscription = this.api.getNodeMetricsInLoop(this.selectedMetric, 1200).subscribe(data => {
      this.nodeMetrics = data;
    });
  }

  changeMetricTo(metric: string): void {
    this.reset();
    this.watch();
    this.setMetricRange();
  }

  changeSizeTo(size: number): void {
    this.blockSize = size;
  }

  //For size-1, size-2, ..., size-5
  get nodeSizeClass(): string {
    return `size-${this.blockSize}`;
  }

  nodeColorClass(metric: NodeMetric): string {
    let val = this.nodeMetricValue(metric);
    if (!val) {
      return 'degree-unknown';
    }

    let span = this.metricMaxValue - this.metricMinValue;
    let degree: number;
    if (span <= 0) {
      return 'degree-unknown';
    }

    let v = val / span;
    if (v < 20) {
      degree = 1;
    }
    else if (v < 40) {
      degree = 2;
    }
    else if (v < 60) {
      degree = 3;
    }
    else if (v < 80) {
      degree = 4;
    }
    else {
      degree = 5;
    }
    return `degree-${degree}`;
  }

  nodeMetricValue(metric: NodeMetric): number {
    return metric.Metrics[this.selectedMetric];
  }

  nodeMetricTip(metric: NodeMetric): string {
    return `${metric.NodeName}: ${this.nodeMetricValue(metric)}`;
  }
}
