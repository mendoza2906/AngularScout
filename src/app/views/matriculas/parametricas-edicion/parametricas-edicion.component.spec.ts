import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ParametricasEdicionComponent } from './parametricas-edicion.component';

describe('ParametricasEdicionComponent', () => {
  let component: ParametricasEdicionComponent;
  let fixture: ComponentFixture<ParametricasEdicionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametricasEdicionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametricasEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
