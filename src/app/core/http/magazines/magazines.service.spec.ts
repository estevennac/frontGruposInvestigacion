import { TestBed } from '@angular/core/testing';

import { MagazinesService } from './magazines.service';

describe('MagazinesService', () => {
  let service: MagazinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MagazinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
