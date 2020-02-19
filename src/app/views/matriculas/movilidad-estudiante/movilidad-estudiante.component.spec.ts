import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovilidadEstudianteComponent } from './movilidad-estudiante.component';

describe('MovilidadEstudianteComponent', () => {
  let component: MovilidadEstudianteComponent;
  let fixture: ComponentFixture<MovilidadEstudianteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovilidadEstudianteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovilidadEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
