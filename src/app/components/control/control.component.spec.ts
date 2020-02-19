import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlComponent } from './control.component';

import { jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
describe('ControlComponent', () => {
  let component: ControlComponent;
  let fixture: ComponentFixture<ControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlComponent, jqxButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});