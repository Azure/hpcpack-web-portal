import { TestBed } from '@angular/core/testing';

import { ClusterMetricService } from './cluster-metric.service';

describe('ClusterMetricService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClusterMetricService = TestBed.get(ClusterMetricService);
    expect(service).toBeTruthy();
  });
});
