import { TestBed } from '@angular/core/testing';

import { InvGroupService } from './inv-group.service';

describe('InvGroupService', () => {
  let service: InvGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
