import { TestBed } from '@angular/core/testing';

import { DeveLegaService } from './deve-lega.service';

describe('DeveLegaService', () => {
  let service: DeveLegaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeveLegaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
