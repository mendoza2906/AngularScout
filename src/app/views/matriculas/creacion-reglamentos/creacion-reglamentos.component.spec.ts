import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionReglamentosComponent } from './creacion-reglamentos.component';

describe('CreacionReglamentosComponent', () => {
  let component: CreacionReglamentosComponent;
  let fixture: ComponentFixture<CreacionReglamentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreacionReglamentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreacionReglamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
