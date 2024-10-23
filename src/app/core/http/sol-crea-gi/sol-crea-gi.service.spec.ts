import { TestBed } from '@angular/core/testing';

import { SolCreaGiService } from './sol-crea-gi.service';

describe('SolCreaGiService', () => {
  let service: SolCreaGiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolCreaGiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
