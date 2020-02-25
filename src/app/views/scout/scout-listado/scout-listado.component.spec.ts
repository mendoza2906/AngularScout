import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutListadoComponent } from './scout-listado.component';

describe('ScoutListadoComponent', () => {
  let component: ScoutListadoComponent;
  let fixture: ComponentFixture<ScoutListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScoutListadoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoutListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
