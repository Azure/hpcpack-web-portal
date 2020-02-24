import { TestBed } from '@angular/core/testing';

import { MesssageService } from './messsage.service';

describe('MesssageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MesssageService = TestBed.get(MesssageService);
    expect(service).toBeTruthy();
  });
});
