import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { DefaultService as ApiService } from './api-client';
import { UserService } from './user.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: UserService, useValue: {} },
      { provide: ApiService, useValue: {} },
    ]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
