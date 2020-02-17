import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MetricDefinition } from '../api-client';

@Injectable({
  providedIn: 'root'
})
export class ClusterMetricService {
  private metrics: MetricDefinition[];

  constructor(
    private api: ApiService,
  ) { }

  getMetricDefinitions(): Observable<MetricDefinition[]> {
    return new Observable<MetricDefinition[]>(subscriber => {
      if (this.metrics) {
        subscriber.next(this.metrics);
      }
      this.api.getClusterMetricDefintions().subscribe(
        data => {
          this.metrics = data;
          subscriber.next(this.metrics);
        },
        error => {
          subscriber.error(error);
        }
      );
    });
  }
}
