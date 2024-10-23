import { TestBed } from '@angular/core/testing';

import { BookChapterService } from './book-chapter.service';

describe('BookChapterService', () => {
  let service: BookChapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookChapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
