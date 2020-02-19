import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteEdicionComponent } from './estudiante-edicion.component';

describe('EdicionReglamentosComponent', () => {
  let component: EstudianteEdicionComponent;
  let fixture: ComponentFixture<EstudianteEdicionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstudianteEdicionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudianteEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
