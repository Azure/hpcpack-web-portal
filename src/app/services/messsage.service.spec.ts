import { TestBed } from '@angular/core/testing';

import { MaterialModule } from '../material.module'
import { MesssageService } from './messsage.service';

describe('MesssageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ MaterialModule ],
  }));

  it('should be created', () => {
    const service: MesssageService = TestBed.get(MesssageService);
    expect(service).toBeTruthy();
  });
});
