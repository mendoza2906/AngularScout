import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxExpanderModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxexpander';
import { jqxInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxinput';
import { jqxValidatorModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxvalidator';
import { jqxScrollViewModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxscrollview';
import { jqxGridModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxgrid';
import { jqxNumberInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxnumberinput';
import { jqxComboBoxModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxcombobox';
import { jqxWindowModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxwindow';
import { jqxTextAreaModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxtextarea';
import { jqxDateTimeInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxdatetimeinput';
import { jqxDropDownListModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxdropdownlist';
import { jqxMaskedInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxmaskedinput';
import { jqxCheckBoxModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxcheckbox';
import { jqxCalendarModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxcalendar';
import { WidgetsModuleModule } from '../widgets-module.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FormsModule } from '@angular/forms'
import { ScoutRoutingModule } from './scout-routing.module';
import { AgendarCitaComponent } from './agendar-cita/agendar-cita.component';
import { RegistrarConsultaComponent } from './registrar-consulta/registrar-consulta.component';
import { ConsultaMedicaComponent } from './consulta-medica/consulta-medica.component';
import { MedicoListadoComponent } from './medico-listado/medico-listado.component';
import { PacienteListadoComponent } from './paciente-listado/paciente-listado.component';
import { jqxPasswordInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxpasswordinput';
import { PersonaEdicionComponent } from './persona-edicion/persona-edicion.component';
import { ScoutService } from '../../services/scout/scout.service';
import { SubirArchivoComponent } from './subir-archivo/subir-archivo.component';
import { RevisarArchivoComponent } from './revisar-archivo/revisar-archivo.component';
import { jqxPanelModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxPanel';
import { jqxFileUploadModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxfileupload';
import { ProgresionListadoComponent } from './progresion-listado/progresion-listado.component';
import { RoundProgressModule} from 'angular-svg-round-progressbar';
import { RevisarProgresionComponent } from './revisar-progresion/revisar-progresion.component';
 

@NgModule({
  declarations: [
    AgendarCitaComponent,
    RegistrarConsultaComponent,
    ConsultaMedicaComponent,
    MedicoListadoComponent,
    PacienteListadoComponent,
    PersonaEdicionComponent,
    SubirArchivoComponent,
    RevisarArchivoComponent,
    ProgresionListadoComponent,
    RevisarProgresionComponent

  ],
  imports: [
    CommonModule,
    WidgetsModuleModule,
    jqxExpanderModule,
    jqxValidatorModule,
    jqxInputModule,
    jqxGridModule,
    jqxWindowModule,
    jqxComboBoxModule,
    jqxCheckBoxModule,
    jqxTextAreaModule,
    jqxScrollViewModule,
    jqxMaskedInputModule,
    jqxNumberInputModule,
    jqxDateTimeInputModule,
    jqxDropDownListModule,
    jqxCalendarModule,
    jqxPasswordInputModule,
    ScoutRoutingModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    RoundProgressModule,
    FormsModule,
    jqxFileUploadModule, jqxPanelModule
  ],
  providers: [ScoutModule, ScoutService]
})
export class ScoutModule { }
