import { TestBed } from '@angular/core/testing';

import { UpperLevelPlanService } from './upper-level-plan.service';

describe('UpperLevelPlanService', () => {
  let service: UpperLevelPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpperLevelPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
