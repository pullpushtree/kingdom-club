import { TestBed } from '@angular/core/testing';

import { IndexGuard } from './index.guard';

describe('IndexGuard', () => {
  let guard: IndexGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IndexGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
