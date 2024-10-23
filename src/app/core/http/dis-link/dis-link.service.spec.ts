import { TestBed } from '@angular/core/testing';

import { DisLinkService } from './dis-link.service';

describe('DisLinkService', () => {
  let service: DisLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
