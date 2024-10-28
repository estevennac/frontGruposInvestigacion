import { TestBed } from '@angular/core/testing';

import { InvGroup_linesService } from './invGroup_linesService.service';

describe('InvGroup_linesService', () => {
  let service: InvGroup_linesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvGroup_linesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
