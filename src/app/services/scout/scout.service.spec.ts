import { TestBed } from '@angular/core/testing';
import { ScoutService } from './scout.service';

describe('ScoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScoutService = TestBed.get(ScoutService);
    expect(service).toBeTruthy();
  });
});
