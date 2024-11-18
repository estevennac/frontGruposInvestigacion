import { TestBed } from '@angular/core/testing';

import { SpecificObjetivesService } from './specific-objetives.service';

describe('SpecificObjetivesService', () => {
  let service: SpecificObjetivesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecificObjetivesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
