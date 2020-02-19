import { TestBed } from '@angular/core/testing';

import { ValidadorService } from './validador.service';

describe('ValidadorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidadorService = TestBed.get(ValidadorService);
    expect(service).toBeTruthy();
  });
});
