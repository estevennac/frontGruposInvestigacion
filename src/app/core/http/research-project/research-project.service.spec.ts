import { TestBed } from '@angular/core/testing';

import { ResearchProjectService } from './research-project.service'

describe('ResearchProjectService', () => {
  let service: ResearchProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResearchProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
