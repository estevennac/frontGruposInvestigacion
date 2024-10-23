import { TestBed } from '@angular/core/testing';

import { PostGradTesisService } from './post-grad-tesis.service';

describe('PostGradTesisService', () => {
  let service: PostGradTesisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostGradTesisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
