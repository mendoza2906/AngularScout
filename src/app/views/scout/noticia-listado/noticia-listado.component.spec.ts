import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaListadoComponent } from './noticia-listado.component';

describe('NoticiaListadoComponent', () => {
  let component: NoticiaListadoComponent;
  let fixture: ComponentFixture<NoticiaListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoticiaListadoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
