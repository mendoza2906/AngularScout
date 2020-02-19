import { TestBed } from '@angular/core/testing';

import { MatriculasService } from './matriculas.service';

describe('DistributivosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatriculasService = TestBed.get(MatriculasService);
    expect(service).toBeTruthy();
  });
});
