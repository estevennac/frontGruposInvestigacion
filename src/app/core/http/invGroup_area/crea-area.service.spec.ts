import { TestBed } from '@angular/core/testing';

import { InvGroup_areaService } from './crea-area.service';

describe('InvGroup_areaService', () => {
  let service: InvGroup_areaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvGroup_areaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
