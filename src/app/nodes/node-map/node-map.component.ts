import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs'
import { NodeMetric } from '../../api-client'
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service'

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

  private selectedMetricIndex: number;

  private userOptions = this.user.userOptions.nodeMetricOptions;

  get selectedMetric(): string {
    return this.userOptions.selectedMetric || this.metrics[this.selectedMetricIndex].value;
  }

  set selectedMetric(value: string) {
    this.selectedMetricIndex = this.metrics.findIndex(e => e.value === value);
    this.userOptions.selectedMetric = value;
    this.user.saveUserOptions();
  }

  get metricMinValue(): number {
    let val: number;
    try {
      val = this.userOptions.metricRanges[this.selectedMetric].min;
    }
    catch {
      val = undefined;
    }
    return val || this.metrics[this.selectedMetricIndex].min;
  }

  get metricMaxValue(): number {
    let val: number;
    try {
      val = this.userOptions.metricRanges[this.selectedMetric].max;
    }
    catch {
      val = undefined;
    }
    return val || this.metrics[this.selectedMetricIndex].max;
  }

  metricMinInput: FormControl;

  metricMaxInput: FormControl;

  private setMetricRange(): void {
    this.metricMinInput.setValue(this.metricMinValue);
    this.metricMaxInput.setValue(this.metricMaxValue);
  }

  nodeMetrics: NodeMetric[];

  private subscription: Subscription;

  get blockSize(): number {
    return this.userOptions.blockSize || 3;
  }

  set blockSize(size: number) {
    this.userOptions.blockSize = size;
    this.user.saveUserOptions();
  }

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private user: UserService,
  ) {
    if (this.userOptions.selectedMetric) {
      this.selectedMetricIndex = this.metrics.findIndex(e => e.value === this.userOptions.selectedMetric);
    }
    else {
      this.selectedMetricIndex = 0;
    }
    this.metricMinInput = this.fb.control(this.metricMinValue);
    this.metricMaxInput = this.fb.control(this.metricMaxValue);
  }

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

  changeMetric(): void {
    this.reset();
    this.watch();
    this.setMetricRange();
  }

  changeValueRange(): void {
    this.userOptions.metricRanges[this.selectedMetric] = { min: this.metricMinInput.value, max: this.metricMaxInput.value };
    this.user.saveUserOptions();
  }

  changeBlockSize(size: number): void {
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
    if (span <= 0) {
      return 'degree-unknown';
    }

    let degree: number;
    let v = (val - this.metricMinValue) / span;
    if (v < 0.2) {
      degree = 1;
    }
    else if (v < 0.4) {
      degree = 2;
    }
    else if (v < 0.6) {
      degree = 3;
    }
    else if (v < 0.8) {
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
