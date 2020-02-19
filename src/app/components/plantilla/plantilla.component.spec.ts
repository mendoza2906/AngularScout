import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaComponent } from './plantilla.component';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu';
import { jqxTreeComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtree';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';

describe('PlantillaComponent', () => {
  let component: PlantillaComponent;
  let fixture: ComponentFixture<PlantillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantillaComponent, jqxGridComponent, jqxMenuComponent, 
        jqxTreeComponent,
        jqxButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should columngroups text be Product Details', () => {
    expect(fixture.componentInstance.columngroups[0].text).toBe('Product Details');
  });
});
