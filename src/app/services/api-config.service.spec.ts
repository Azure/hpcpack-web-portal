import { TestBed } from '@angular/core/testing';

import { ApiConfigService } from './api-config.service';

describe('ApiConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiConfigService = TestBed.get(ApiConfigService);
    expect(service).toBeTruthy();
  });
});
