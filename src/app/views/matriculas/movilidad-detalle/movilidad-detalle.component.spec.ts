import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovilidadDetalleComponent } from './movilidad-detalle.component';

describe('MovilidadDetalleComponent', () => {
  let component: MovilidadDetalleComponent;
  let fixture: ComponentFixture<MovilidadDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovilidadDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovilidadDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
