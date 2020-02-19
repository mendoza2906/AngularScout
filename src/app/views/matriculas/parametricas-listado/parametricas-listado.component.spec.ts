import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ParametricasListadoComponent } from './parametricas-listado.component';


describe('EstudianteListadoComponent', () => {
  let component: ParametricasListadoComponent;
  let fixture: ComponentFixture<ParametricasListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametricasListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametricasListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
