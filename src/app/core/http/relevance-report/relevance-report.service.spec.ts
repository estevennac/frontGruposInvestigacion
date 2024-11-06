import { TestBed } from '@angular/core/testing';

import { RelevanceReportService } from './relevance-report.service';

describe('RelevanceReportService', () => {
  let service: RelevanceReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelevanceReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
