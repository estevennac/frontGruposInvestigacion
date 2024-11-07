import { TestBed } from '@angular/core/testing';

import { AssetsReportService } from './assets-report.service';

describe('AssetsReportService', () => {
  let service: AssetsReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetsReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
