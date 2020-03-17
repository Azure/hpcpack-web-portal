import { TestBed } from '@angular/core/testing';

import { GoogleAnalyticsService, GA_TRACK_ID } from './google-analytics.service';
import { UserService } from './user.service';

describe('GoogleAnalyticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: UserService, useValue: { user: {}} },
      { provide: GA_TRACK_ID, useValue: 'id' },
    ]
  }));

  it('should be created', () => {
    const service: GoogleAnalyticsService = TestBed.get(GoogleAnalyticsService);
    expect(service).toBeTruthy();
  });
});
