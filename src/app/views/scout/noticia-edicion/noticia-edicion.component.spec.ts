import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaEdicionComponent } from './noticia-edicion.component';

describe('NoticiaEdicionComponent', () => {
  let component: NoticiaEdicionComponent;
  let fixture: ComponentFixture<NoticiaEdicionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoticiaEdicionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiaEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
