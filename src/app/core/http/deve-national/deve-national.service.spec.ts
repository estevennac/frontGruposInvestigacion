import { TestBed } from '@angular/core/testing';

import { DeveNationalService } from './deve-national.service';

describe('DeveNationalService', () => {
  let service: DeveNationalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeveNationalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
