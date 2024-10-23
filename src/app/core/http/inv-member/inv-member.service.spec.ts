import { TestBed } from '@angular/core/testing';

import { InvMemberService } from './inv-member.service';

describe('InvMemberService', () => {
  let service: InvMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvMemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
