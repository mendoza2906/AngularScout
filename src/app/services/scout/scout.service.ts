import { APP_CONFIG } from '../../config/app-config';
import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class ScoutService {

  public URL_SERVER = APP_CONFIG.restUrl;

  //Metodos Pantalla Estudiante por Matriculas
  public URL_ROOT_WS = this.URL_SERVER + '/api/scout';
  public URL_ROOT_WS_PER = this.URL_SERVER + '/api/personas';
  public URL_ROOT_WS1 = this.URL_SERVER + '/api/reportesMatricula';

  constructor(private http: HttpClient) {

  }
  //PARA PANTALLA DE SUBIDA DE ARCHIVOS
  grabarDocumento(documentoAng: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarDocumento', documentoAng);
    return result;
  }

  getRecuperarDocumentoId(idDocumento: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarDocumentoId/' + idDocumento);
  }

  getRecuperarDatosScout(usuario: string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarDatosScout/' + usuario);
  }

  getRecuperarUltimaModuloInsignia(idScout: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarUltimaModuloInsignia/' + idScout);
  }

  getBuscarPorScoutModulo(IdModulo: number, idScout: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarPorScoutModulo/' + IdModulo + '/' + idScout);
  }

  grabarDocumentoModulos(ScoutModulo: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarDocumentoModulos', ScoutModulo);
    return result;
  }
  //FIN PANTALLA DE SUBIDA DE ARCHIVOS

  //PARA PANTALLA DE PROGRESION
  getListarRamas(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarRamas');
  }

  getListarGrupos(idRama: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarGrupos/' + idRama);
  }

  getListarScouts(idGrupoRama: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarScouts/' + idGrupoRama);
  }

  getRecuperarUltimaInsigniaScout(idScout: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarUltimaInsigniaScout/' + idScout);
  }

  getRecuperarInsigniasObtenidas(idScout: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarInsigniasObtenidas/' + idScout);
  }

  getRecuperarDetalleInsignias(idScout: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarDetalleInsignias/' + idScout);
  }
  //FIN PANTALLA DE PROGRESION

  //PANTALLA PERSONAS
  getListarPerfiles(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/listarPerfiles');
  }

  getListarTiposScouts(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/listarTiposScouts');
  }

  getListadoScouts(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/listadoScouts');
  }

  getListadoComisionados(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/listadoComisionados');
  }

  getRecuperarScoutId(idScout: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/recuperarScoutId/' + idScout);
  }

  getRecuperarCombosGrupoRama(idGrupoRama: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/recuperarCombosGrupoRama/' + idGrupoRama);
  }

  getRecuperarPorCedula(cedula: string): Observable<any> {
    console.log(this.URL_ROOT_WS_PER + '/recuperarPorCedula/' + cedula)
    return this.http.get(this.URL_ROOT_WS_PER + '/recuperarPorCedula/' + cedula);
  }

  getBuscarUsuario(usuario: string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/buscarUsuario/' + usuario);
  }

  grabarScout(Scout: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS_PER + '/grabarScout', Scout);
    return result;
  }
  //PANTALLA PERSONAS

  //PANTALLA ASISTENCIA
  getRecuperarAsistenciaId(idAsistencia: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/recuperarAsistenciaId/' + idAsistencia);
  }

  getListarActividades(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/listarActividades');
  }

  getListarAsistencias(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/listarAsistencias');
  }

  grabarAsistencia(Asistencia: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS_PER + '/grabarAsistencia', Asistencia);
    return result;
  }

  getRecuperarCombosScouts(idScout: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/recuperarCombosScouts/' + idScout);
  }
  //PANTALLA ASISTENCIA








  getListarCitas(fechaCita: string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarCitas/' + fechaCita);
  }

  getListarCitasFn(idMedico: number, fechaCita: string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarCitasProc/' + idMedico + '/' + fechaCita);
  }

  getListarCitasFechas(fechaCitaInicio: string, fechaCitaFin: string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarCitasFechas/' + fechaCitaInicio + '/' + fechaCitaFin);
  }

  getListarHoras(idMedico: number, fechaCita: string, idHora: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarHoras/' + idMedico + '/' + fechaCita + '/' + idHora);
  }

  getListarCitaId(idCita: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarCitaId/' + idCita);
  }



  borrarMatricula(idEstudianteMatricula: number) {
    return this.http.delete(this.URL_ROOT_WS + '/borrarMatricula/' + idEstudianteMatricula);
  }


  //PANTALLA PRINCIPAL CONSULTAS

  getRecuperarDatosCita(idCita: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarDatosCita/' + idCita);
  }

  getRecuperarConsultaId(idConsulta: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarConsultaId/' + idConsulta);
  }

  getListarProcedimientos(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarProcedimientos');
  }

  grabarConsulta(consultaPojo: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarConsulta', consultaPojo);
    return result;
  }

  //PANTALLA  PACIENTES 
  getListadoPacientes(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/listadoPacientes');
  }


  //PANTALLA  MEDICOS 
  getListadoMedicos(idEspecialidad: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/listadoMedicos/' + idEspecialidad);
  }



  getAgendaMedico(idMedico: number, pi_fecha_inicio: string, pi_fecha_fin: string): Observable<Blob> {
    return this.http.get(this.URL_ROOT_WS_PER + '/getAgendaMedico/' + idMedico + '/' + pi_fecha_inicio +
      '/' + pi_fecha_fin, { responseType: 'blob' });
  }

  getHistorialPaciente(idPaciente: number): Observable<Blob> {
    return this.http.get(this.URL_ROOT_WS_PER + '/getHistorialPaciente/' + idPaciente, { responseType: 'blob' });
  }


}

