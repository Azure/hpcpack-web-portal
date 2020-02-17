import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { ClusterMetricService } from './cluster-metric.service';

describe('ClusterMetricService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: ApiService, useValue: {} },
    ]
  }));

  it('should be created', () => {
    const service: ClusterMetricService = TestBed.get(ClusterMetricService);
    expect(service).toBeTruthy();
  });
});
