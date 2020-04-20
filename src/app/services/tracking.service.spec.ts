import { TestBed } from '@angular/core/testing';

import { TrackingService, GA_TRACK_ID, AI_TRACK_ID } from './tracking.service';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

describe('TrackingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: Router, useValue: { events: { pipe: (x: any) => { return { subscribe: (x: any) => {} } } } } },
      { provide: ApiService, useValue: {} },
      { provide: UserService, useValue: { AddAuthStateChangeHandler: (x: any) => {} } },
      { provide: GA_TRACK_ID, useValue: 'id' },
      { provide: AI_TRACK_ID, useValue: 'id' },
    ]
  }));

  it('should be created', () => {
    const service: TrackingService = TestBed.get(TrackingService);
    expect(service).toBeTruthy();
  });
});
