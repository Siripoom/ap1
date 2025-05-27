import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { evaluatorGuard } from './evaluator.guard';

describe('evaluatorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => evaluatorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
