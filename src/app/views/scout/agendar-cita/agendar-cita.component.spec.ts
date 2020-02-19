import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendarCitaComponent } from './agendar-cita.component';


describe('AgendarCitaComponent', () => {
  let component: AgendarCitaComponent;
  let fixture: ComponentFixture<AgendarCitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgendarCitaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendarCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
