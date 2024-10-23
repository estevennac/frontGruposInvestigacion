import { TestBed } from '@angular/core/testing';

import { GroupRegFormService } from './group-reg-form.service';

describe('GroupRegFormService', () => {
  let service: GroupRegFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupRegFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
