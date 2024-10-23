import { TestBed } from '@angular/core/testing';

import { CreaAreaService } from './crea-area.service';

describe('CreaAreaService', () => {
  let service: CreaAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreaAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
