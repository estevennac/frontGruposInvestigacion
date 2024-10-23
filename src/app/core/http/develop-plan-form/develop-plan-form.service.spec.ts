import { TestBed } from '@angular/core/testing';

import { DevelopPlanFormService } from './develop-plan-form.service';

describe('DevelopPlanFormService', () => {
  let service: DevelopPlanFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevelopPlanFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
