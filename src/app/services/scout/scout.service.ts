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

  jsonToUrlParams(json) {
    return Object.keys(json)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
      .join("&");
  }

  post(tarea: any): Observable<any> {
    let result: Observable<Object>;
    let data = this.jsonToUrlParams(tarea);
    result = this.http.post(this.URL_ROOT_WS + '/grabarDocumento', data);
    return result;
  }

  getRecuperarDocumentoId(idDocumento: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarDocumentoId/' + idDocumento);
  }



  //PANTALLA PRINCIPAL CITAS 
  getListarEspecialidades(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarEspecialidades');
  }

  getListarMedicos(idEspecialidad: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarMedicos/' + idEspecialidad);
  }

  getListarPacientes(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarPacientes');
  }

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

  grabarCita(citaPojo: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarCita', citaPojo);
    return result;
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

  getListarPerfiles(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/listarPerfiles');
  }

  getRecuperarUltimoPaciente(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/recuperarUltimoPaciente');
  }

  getBuscarPersonaId(idConsulta: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarPersonaId/' + idConsulta);
  }

  getRecuperarPorCedula(cedula: string): Observable<any> {
    console.log(this.URL_ROOT_WS_PER + '/recuperarPorCedula/' + cedula)
    return this.http.get(this.URL_ROOT_WS_PER + '/recuperarPorCedula/' + cedula);
  }

  grabarPersona(personaPojo: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS_PER + '/grabarPersona', personaPojo);
    return result;
  }

  //PANTALLA  MEDICOS 
  getListadoMedicos(idEspecialidad: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/listadoMedicos/' + idEspecialidad);
  }

  getBuscarUsuario(usuario: string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_PER + '/buscarUsuario/' + usuario);
  }

  getAgendaMedico(idMedico: number, pi_fecha_inicio: string, pi_fecha_fin: string): Observable<Blob> {
    return this.http.get(this.URL_ROOT_WS_PER + '/getAgendaMedico/' + idMedico + '/' + pi_fecha_inicio +
      '/' + pi_fecha_fin, { responseType: 'blob' });
  }

  getHistorialPaciente(idPaciente: number): Observable<Blob> {
    return this.http.get(this.URL_ROOT_WS_PER + '/getHistorialPaciente/' + idPaciente, { responseType: 'blob' });
  }


}

