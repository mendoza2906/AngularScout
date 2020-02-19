import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCitaComponent } from './modal-cita.component';

describe('ModalCitaComponent', () => {
  let component: ModalCitaComponent;
  let fixture: ComponentFixture<ModalCitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCitaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
