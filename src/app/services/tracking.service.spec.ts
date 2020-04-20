import { TestBed } from '@angular/core/testing';

import { TrackingService, GA_TRACK_ID } from './tracking.service';
import { UserService } from './user.service';

describe('TrackingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: UserService, useValue: { user: {}} },
      { provide: GA_TRACK_ID, useValue: 'id' },
    ]
  }));

  it('should be created', () => {
    const service: TrackingService = TestBed.get(TrackingService);
    expect(service).toBeTruthy();
  });
});
