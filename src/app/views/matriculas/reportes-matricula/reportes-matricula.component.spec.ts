import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesMatriculaComponent } from './reportes-matricula.component';

describe('ReportesMatriculaComponent', () => {
  let component: ReportesMatriculaComponent;
  let fixture: ComponentFixture<ReportesMatriculaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportesMatriculaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
