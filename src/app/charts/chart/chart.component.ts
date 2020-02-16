import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input()
  metricName: string;

  @Output()
  onClose = new EventEmitter();

  private subscription: Subscription;

  private readonly updateInterval: number = 60 * 1000;

  private timeWindow: number = 10;

  timeWindowInput: FormControl;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
  ) {
    this.timeWindowInput = this.fb.control(this.timeWindow, [Validators.required, Validators.min(1), Validators.max(50000)]);
    this.timeWindowInput.setValue(this.timeWindow);
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  close(): void {
    this.onClose.emit();
  }

  private loadData(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.api.getLatestClusterMetricInLoop(this.metricName, this.timeWindow * 60 * 1000, this.updateInterval).subscribe(data => {
      console.log(data);
    });
  }

  onTimeWindowChange(): void {
    if (this.timeWindowInput.invalid) {
      return;
    }
    this.timeWindow = this.timeWindowInput.value;
    this.loadData();
  }
}
