import { TestBed } from '@angular/core/testing';

import { AnnualOperativePlanService } from './annual-operative-plan.service';

describe('AnnualOperativePlanService', () => {
  let service: AnnualOperativePlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnualOperativePlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
