import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteListadoComponent } from './paciente-listado.component';

describe('PacienteListadoComponent', () => {
  let component: PacienteListadoComponent;
  let fixture: ComponentFixture<PacienteListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PacienteListadoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacienteListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
