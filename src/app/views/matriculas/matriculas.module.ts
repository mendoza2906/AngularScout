import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatriculaEstudianteComponent } from './matricula-estudiante/matricula-estudiante.component';
import { MatriculaListaEstudianteComponent } from './matricula-lista-estudiante/matricula-lista-estudiante.component';
import { MatriculasRoutingModule } from './matriculas-routing.module';
import { jqxExpanderModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxexpander';
import { jqxInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxinput';
import { jqxValidatorModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxvalidator';
import { jqxScrollViewModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxscrollview';
import { jqxGridModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxgrid';
import { jqxNumberInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxnumberinput';
import { jqxComboBoxModule} from 'jqwidgets-scripts/jqwidgets-ng/jqxcombobox';
import { jqxWindowModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxwindow';
import { jqxTextAreaModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxtextarea';
import { jqxDateTimeInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxdatetimeinput';
import { jqxDropDownListModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxdropdownlist';
import { jqxMaskedInputModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxmaskedinput';
import { jqxCheckBoxModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxcheckbox';
import { WidgetsModuleModule } from '../widgets-module.module';
import { MatriculasService } from '../../services/matriculas/matriculas.service';
import { MatriculaDetalleComponent } from './matricula-detalle/matricula-detalle.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PeriodoMatriculaComponent } from './periodo-matricula/periodo-matricula.component';
import { PeriodoConfiguracionComponent } from './periodo-configuracion/periodo-configuracion.component';
import { FormsModule } from '@angular/forms'
import { CreacionReglamentosComponent } from './creacion-reglamentos/creacion-reglamentos.component';
import { EdicionReglamentosComponent } from './edicion-reglamentos/edicion-reglamentos.component';
import { EstudianteListadoComponent } from './estudiante-listado/estudiante-listado.component';
import { EstudianteEdicionComponent } from './estudiante-edicion/estudiante-edicion.component';
import { MovilidadEstudianteComponent } from './movilidad-estudiante/movilidad-estudiante.component';
import { MovilidadDetalleComponent } from './movilidad-detalle/movilidad-detalle.component';
import { ParametricasListadoComponent } from './parametricas-listado/parametricas-listado.component';
import { ParametricasEdicionComponent } from './parametricas-edicion/parametricas-edicion.component';
import { ReportesMatriculaComponent } from './reportes-matricula/reportes-matricula.component';

@NgModule({
  declarations: [
    MatriculaEstudianteComponent,
    MatriculaListaEstudianteComponent,
    MatriculaDetalleComponent,
    ReportesMatriculaComponent,
    MovilidadEstudianteComponent,
    MovilidadDetalleComponent,
    PeriodoMatriculaComponent,
    PeriodoConfiguracionComponent,
    CreacionReglamentosComponent,
    EdicionReglamentosComponent,
    EstudianteListadoComponent,
    EstudianteEdicionComponent,
    ParametricasListadoComponent,
    ParametricasEdicionComponent,

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
    MatriculasRoutingModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    FormsModule,
  ],
  providers: [MatriculasModule, MatriculasService]
})
export class MatriculasModule { }
