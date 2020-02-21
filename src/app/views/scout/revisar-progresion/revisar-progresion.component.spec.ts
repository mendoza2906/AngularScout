import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RevisarProgresionComponent } from './revisar-progresion.component';


describe('RevisarProgresionComponent', () => {
  let component: RevisarProgresionComponent;
  let fixture: ComponentFixture<RevisarProgresionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RevisarProgresionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisarProgresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
