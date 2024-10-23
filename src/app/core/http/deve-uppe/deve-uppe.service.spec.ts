import { TestBed } from '@angular/core/testing';

import { DeveUppeService } from './deve-uppe.service';

describe('DeveUppeService', () => {
  let service: DeveUppeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeveUppeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
