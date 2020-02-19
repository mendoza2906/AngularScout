import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlAutenticacion } from '../../security/control-autenticacion';
import { MatriculaEstudianteComponent } from './matricula-estudiante/matricula-estudiante.component';
import { MatriculaListaEstudianteComponent } from './matricula-lista-estudiante/matricula-lista-estudiante.component';
import { MatriculaDetalleComponent } from './matricula-detalle/matricula-detalle.component';
import { PeriodoMatriculaComponent } from './periodo-matricula/periodo-matricula.component';
import { PeriodoConfiguracionComponent } from './periodo-configuracion/periodo-configuracion.component';
import { CreacionReglamentosComponent } from './creacion-reglamentos/creacion-reglamentos.component';
import { EdicionReglamentosComponent } from './edicion-reglamentos/edicion-reglamentos.component';
import { EstudianteListadoComponent } from './estudiante-listado/estudiante-listado.component';
import { EstudianteEdicionComponent } from './estudiante-edicion/estudiante-edicion.component';
import { MovilidadEstudianteComponent } from './movilidad-estudiante/movilidad-estudiante.component';
import { MovilidadDetalleComponent } from './movilidad-detalle/movilidad-detalle.component';
import { ParametricasListadoComponent } from './parametricas-listado/parametricas-listado.component';
import { ParametricasEdicionComponent } from './parametricas-edicion/parametricas-edicion.component';
import { ReportesMatriculaComponent } from './reportes-matricula/reportes-matricula.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Matricula'
    },
    children: [
      {
        path: '',
        redirectTo: 'matricula-estudiante',
        pathMatch: 'full'
      },

      //Listar

      {
        path: 'matricula-lista-estudiante',
        component: MatriculaListaEstudianteComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Lista de Estudiante'
        }
      },

      {
        path: 'matricula-estudiante/:idEstudianteOferta/:idOpcion/:primerSemestre',
        component: MatriculaEstudianteComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Matriculación Estudiantil'
        }
      },

      {
        path: 'matricula-detalle/:idEstudianteOferta',
        component: MatriculaDetalleComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Matriculación Historial'
        }
      },
      {
        path: 'movilidad-estudiante',
        component: MovilidadEstudianteComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Movilidad Estudiantil'
        }
      },
      {
        path: 'movilidad-detalle/:idEstudianteOferta/:idSubtipoMovilidad',
        component: MovilidadDetalleComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Homologación/Reconocimiento'
        }
      },
      {
        path: 'reportes-matricula',
        component: ReportesMatriculaComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Reporte Matriculación'
        }
      },
      {
        path: 'periodo-matricula',
        component: PeriodoMatriculaComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Periodo de Matrícula'
        }
      },
      {
        path: 'periodo-configuracion/:idMatriculaGeneral',
        component: PeriodoConfiguracionComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Configuración Periodo de Matrícula'
        }
      },
      {
        path: 'creacion-reglamentos',
        component: CreacionReglamentosComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Lista Reglamentos'
        }
      },
      {
        path: 'edicion-reglamentos/:idReglamento',
        component: EdicionReglamentosComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Edición de Reglamentos'
        }
      },
      {
        path: 'estudiante-listado',
        component: EstudianteListadoComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Listado de Estudiantes'
        }
      },
      {
        path: 'estudiante-edicion/:idPersona/:idDepartamentoOferta',
        component: EstudianteEdicionComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Edición de Estudiante'
        }
      },
      {
        path: 'parametricas-listado',
        component: ParametricasListadoComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Listado de Registros Paramétricas'
        }
      },
      {
        path: 'parametricas-edicion/:idParametrica/:codigoTabla',
        component: ParametricasEdicionComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Edición de Campos Paramétricos'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatriculasRoutingModule {}
