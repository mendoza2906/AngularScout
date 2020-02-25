import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaListadoComponent } from './asistencia-listado.component';

describe('AsistenciaListadoComponent', () => {
  let component: AsistenciaListadoComponent;
  let fixture: ComponentFixture<AsistenciaListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistenciaListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
