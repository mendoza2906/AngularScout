import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInsigniasComponent } from './reporte-insignias.component';

describe('ReporteInsigniasComponent', () => {
  let component: ReporteInsigniasComponent;
  let fixture: ComponentFixture<ReporteInsigniasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteInsigniasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteInsigniasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
