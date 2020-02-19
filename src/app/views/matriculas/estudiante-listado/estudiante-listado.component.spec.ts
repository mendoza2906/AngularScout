import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteListadoComponent } from './estudiante-listado.component';

describe('EstudianteListadoComponent', () => {
  let component: EstudianteListadoComponent;
  let fixture: ComponentFixture<EstudianteListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstudianteListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudianteListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
