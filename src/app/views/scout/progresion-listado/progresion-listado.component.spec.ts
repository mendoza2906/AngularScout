import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgresionListadoComponent } from './progresion-listado.component';



describe('ProgresionListadoComponent', () => {
  let component: ProgresionListadoComponent;
  let fixture: ComponentFixture<ProgresionListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgresionListadoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgresionListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
