import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionadoListadoComponent } from './comisionado-listado.component';

describe('ComisionadoListadoComponent', () => {
  let component: ComisionadoListadoComponent;
  let fixture: ComponentFixture<ComisionadoListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComisionadoListadoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionadoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
