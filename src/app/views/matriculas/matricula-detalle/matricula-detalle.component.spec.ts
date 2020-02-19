import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaDetalleComponent } from './matricula-detalle.component';

describe('MatriculaDetalleComponent', () => {
  let component: MatriculaDetalleComponent;
  let fixture: ComponentFixture<MatriculaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatriculaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatriculaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
