import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionReglamentosComponent } from './edicion-reglamentos.component';

describe('EdicionReglamentosComponent', () => {
  let component: EdicionReglamentosComponent;
  let fixture: ComponentFixture<EdicionReglamentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdicionReglamentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdicionReglamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
