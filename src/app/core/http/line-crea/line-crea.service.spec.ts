import { TestBed } from '@angular/core/testing';

import { LineCreaService } from './line-crea.service';

describe('LineCreaService', () => {
  let service: LineCreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineCreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
