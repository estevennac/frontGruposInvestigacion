import { TestBed } from '@angular/core/testing';

import { ProgressAchievService } from './progress-achiev.service';

describe('ProgressAchievService', () => {
  let service: ProgressAchievService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressAchievService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
