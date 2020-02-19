import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodoMatriculaComponent } from './periodo-matricula.component';

describe('HomologacionComponent', () => {
  let component: PeriodoMatriculaComponent;
  let fixture: ComponentFixture<PeriodoMatriculaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodoMatriculaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodoMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
