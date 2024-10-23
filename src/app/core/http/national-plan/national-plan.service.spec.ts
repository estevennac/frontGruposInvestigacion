import { TestBed } from '@angular/core/testing';

import { NationalPlanService } from './national-plan.service';

describe('NationalPlanService', () => {
  let service: NationalPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NationalPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
