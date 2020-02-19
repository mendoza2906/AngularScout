import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlAutenticacion } from '../../security/control-autenticacion';
import { AgendarCitaComponent } from './agendar-cita/agendar-cita.component';
import { ConsultaMedicaComponent } from './consulta-medica/consulta-medica.component';
import { RegistrarConsultaComponent } from './registrar-consulta/registrar-consulta.component';
import { MedicoListadoComponent } from './medico-listado/medico-listado.component';
import { PacienteListadoComponent } from './paciente-listado/paciente-listado.component';
import { PersonaEdicionComponent } from './persona-edicion/persona-edicion.component';
import { SubirArchivoComponent } from './subir-archivo/subir-archivo.component';
import { RevisarArchivoComponent } from './revisar-archivo/revisar-archivo.component';




const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Consultorio'
    },
    children: [
      {
        path: '',
        redirectTo: 'agendar-cita',
        pathMatch: 'full'
      },

      //Listar
      {
        path: 'agendar-cita',
        component: AgendarCitaComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Registro de Citas'
        }
      },
      {
        path: 'consulta-medica',
        component: ConsultaMedicaComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Citas Medicas'
        }
      },
      {
        path: 'registrar-consulta/:idCita/:idConsulta',
        component: RegistrarConsultaComponent,
        canActivate: [ControlAutenticacion],
        data: {
          title: 'Registrar Consulta '
        }
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoutRoutingModule { }
