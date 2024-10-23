import { TestBed } from '@angular/core/testing';

import { DegreeTesisService } from './degree-tesis.service';

describe('DegreeTesisService', () => {
  let service: DegreeTesisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DegreeTesisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
