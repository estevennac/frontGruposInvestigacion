import { TestBed } from '@angular/core/testing';

import { CreationReqService } from './creation-req.service';

describe('CreationReqService', () => {
  let service: CreationReqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreationReqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
