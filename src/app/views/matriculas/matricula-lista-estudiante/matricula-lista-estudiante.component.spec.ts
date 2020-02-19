import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaListaEstudianteComponent } from './matricula-lista-estudiante.component';

describe('MatriculaListaEstudianteComponent', () => {
  let component: MatriculaListaEstudianteComponent;
  let fixture: ComponentFixture<MatriculaListaEstudianteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatriculaListaEstudianteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatriculaListaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
