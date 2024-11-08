import { TestBed } from '@angular/core/testing';

import { AssetsDetailsService } from './assets-details.service';

describe('AssetsDetailsService', () => {
  let service: AssetsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
