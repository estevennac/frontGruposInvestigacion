import { TestBed } from '@angular/core/testing';

import { AnnexesService } from './annexes.service';

describe('AnnexesService', () => {
  let service: AnnexesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnexesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
