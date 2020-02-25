import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { jqxFormattedInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxformattedinput';
import { FormsModule } from '@angular/forms';
import { jqxDropDownListModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxdropdownlist';
import { jqxValidatorModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxvalidator';
import { ModalComponentComponent } from './modal-view/modal-component/modal-component.component';
import { jqxGridModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxgrid';
import { jqxFormModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxform';
import { ModalModule } from 'ngx-bootstrap/modal';
import { jqxInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxinput';
import { jqxDateTimeInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxdatetimeinput';
import { ReactiveFormsModule } from '@angular/forms';
import { jqxListBoxModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxlistbox';
import { jqxComboBoxModule, jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxcombobox';
import { jqxTextAreaModule, jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxtextarea';
import { jqxMenuModule, jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxmenu';

@NgModule({
  declarations: [jqxButtonComponent,
    jqxFormattedInputComponent,
    ModalComponentComponent,
  ],

  imports: [
    CommonModule,
    FormsModule,
    jqxMenuModule,
    jqxGridModule,
    jqxInputModule,
    jqxFormModule,
    jqxComboBoxModule,
    jqxTextAreaModule,
    jqxDateTimeInputModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    jqxDropDownListModule,
    jqxValidatorModule
  ],
  exports: [jqxButtonComponent,
    jqxMenuComponent,
    ModalComponentComponent,
    jqxInputModule,
    jqxFormModule,
    jqxComboBoxComponent,
    jqxTextAreaComponent,
    jqxListBoxModule, jqxValidatorModule,
    jqxDateTimeInputModule,]
})
export class WidgetsModuleModule { }
