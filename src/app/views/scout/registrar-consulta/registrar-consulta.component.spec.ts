import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarConsultaComponent } from './registrar-consulta.component';

describe('RegistrarConsultaComponent', () => {
  let component: RegistrarConsultaComponent;
  let fixture: ComponentFixture<RegistrarConsultaComponent>;
  RegistrarConsultaComponent
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrarConsultaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
