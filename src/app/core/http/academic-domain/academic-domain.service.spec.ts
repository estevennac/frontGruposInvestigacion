import { TestBed } from '@angular/core/testing';

import { AcademicDomainService } from './academic-domain.service';

describe('AcademicDomainService', () => {
  let service: AcademicDomainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicDomainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
