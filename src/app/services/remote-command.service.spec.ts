import { TestBed } from '@angular/core/testing';
import { BASE_PATH } from './api.service'
import { UserService } from './user.service'
import { RemoteCommandService } from './remote-command.service';

describe('RemoteCommandService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: BASE_PATH, useValue: '/' },
      { provide: UserService, useValue: { user: {}, AddAuthStateChangeHandler: (a: any) => {} } },
    ]
  }));

  it('should be created', () => {
    const service: RemoteCommandService = TestBed.get(RemoteCommandService);
    expect(service).toBeTruthy();
  });
});
