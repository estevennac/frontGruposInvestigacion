import { TestBed } from '@angular/core/testing';

import { InvgActiService } from './invg-acti.service';

describe('InvgActiService', () => {
  let service: InvgActiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvgActiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
