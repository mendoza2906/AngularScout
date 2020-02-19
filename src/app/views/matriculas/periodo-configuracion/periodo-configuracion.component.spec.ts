import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodoConfiguracionComponent } from './periodo-configuracion.component';

describe('PeriodoConfiguracionComponent', () => {
  let component: PeriodoConfiguracionComponent;
  let fixture: ComponentFixture<PeriodoConfiguracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodoConfiguracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodoConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
