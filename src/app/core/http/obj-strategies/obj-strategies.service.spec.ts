import { TestBed } from '@angular/core/testing';

import { ObjStrategiesService } from './obj-strategies.service';

describe('ObjStrategiesService', () => {
  let service: ObjStrategiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjStrategiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
