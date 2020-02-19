import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisarArchivoComponent } from './revisar-archivo.component';

describe('RevisarArchivoComponent', () => {
  let component: RevisarArchivoComponent;
  let fixture: ComponentFixture<RevisarArchivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RevisarArchivoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisarArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
