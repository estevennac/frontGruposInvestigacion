import { TestBed } from '@angular/core/testing';

import { InstStrategicObjService } from './inst-strategic-obj.service';

describe('InstStrategicObjService', () => {
  let service: InstStrategicObjService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstStrategicObjService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
