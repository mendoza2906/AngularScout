import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlAutenticacion } from '../../security/control-autenticacion';
import { AgendarCitaComponent } from './agendar-cita/agendar-cita.component';
import { MedicoListadoComponent } from './medico-listado/medico-listado.component';
import { PacienteListadoComponent } from './paciente-listado/paciente-listado.component';
import { PersonaEdicionComponent } from './persona-edicion/persona-edicion.component';
import { SubirArchivoComponent } from './subir-archivo/subir-archivo.component';
import { RevisarArchivoComponent } from './revisar-archivo/revisar-archivo.component';
import { ProgresionListadoComponent } from './progresion-listado/progresion-listado.component';
import { RevisarProgresionComponent } from './revisar-progresion/revisar-progresion.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'SCOUTS'
    },
    children: [
      {
        path: '',
        redirectTo: 'agendar-cita',
        pathMatch: 'full'
      },  
      {
        path: 'medico-listado',
        component: MedicoListadoComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Listado de Médicos'
        }
      },
      {
        path: 'paciente-listado',
        component: PacienteListadoComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Listado de Pacientes'
        }
      },
      {
        path: 'persona-edicion/:idPersona/:tipo',
        component: PersonaEdicionComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Registro de Información'
        }
      },
      {
        path: 'subir-archivo',
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoutRoutingModule { }
