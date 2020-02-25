import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlAutenticacion } from '../../security/control-autenticacion';
import { ComisionadoListadoComponent } from './comisionado-listado/comisionado-listado.component';
import { PersonaEdicionComponent } from './persona-edicion/persona-edicion.component';
import { SubirArchivoComponent } from './subir-archivo/subir-archivo.component';
import { RevisarArchivoComponent } from './revisar-archivo/revisar-archivo.component';
import { ProgresionListadoComponent } from './progresion-listado/progresion-listado.component';
import { RevisarProgresionComponent } from './revisar-progresion/revisar-progresion.component';
import { ScoutListadoComponent } from './scout-listado/scout-listado.component';
import { AsistenciaListadoComponent } from './asistencia-listado/asistencia-listado.component';
import { AsistenciaRegistroComponent } from './asistencia-registro/asistencia-registro.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'SCOUTS'
    },
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },  
      {
        path: 'comisionado-listado',
        component: ComisionadoListadoComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Listado de Médicos'
        }
      },
      {
        path: 'scout-listado',
        component: ScoutListadoComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Listado de Pacientes'
        }
      },
      {
        path: 'persona-edicion/:idScout/:tipo',
        component: PersonaEdicionComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Registro de Información'
        }
      },
      {
        path: 'subir-archivo/:idScout',
        component: SubirArchivoComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Subir Archivo'
        }
      },
      {
        path: 'revisar-archivo',
        component: RevisarArchivoComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Revisar Archivo'
        }
      },
      {
        path: 'progresion-listado',
        component: ProgresionListadoComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Progresiones'
        }
      },
      {
        path: 'revisar-progresion/:idScout',
        component: RevisarProgresionComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Visualizar Progresión Scout'
        }
      },
      {
        path: 'asistencia-listado',
        component: AsistenciaListadoComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Listado de Actividades '
        }
      },
      {
        path: 'asistencia-registro/:idAsistencia',
        component: AsistenciaRegistroComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Registrar Asistencia'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoutRoutingModule { }
