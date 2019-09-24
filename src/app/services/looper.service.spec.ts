import { TestBed } from '@angular/core/testing';

import { LooperService } from './looper.service';

describe('LooperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LooperService = TestBed.get(LooperService);
    expect(service).toBeTruthy();
  });
});
