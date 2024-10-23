import { TestBed } from '@angular/core/testing';

import { BudgetExecuteService } from './budget-execute.service';

describe('BudgetExecuteService', () => {
  let service: BudgetExecuteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetExecuteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
