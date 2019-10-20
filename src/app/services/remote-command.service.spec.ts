import { TestBed } from '@angular/core/testing';

import { RemoteCommandService } from './remote-command.service';

describe('RemoteCommandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemoteCommandService = TestBed.get(RemoteCommandService);
    expect(service).toBeTruthy();
  });
});
