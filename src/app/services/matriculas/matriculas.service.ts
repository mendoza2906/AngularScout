import { APP_CONFIG } from '../../config/app-config';
import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class MatriculasService {

  public URL_SERVER = APP_CONFIG.restUrl;

  //Metodos Pantalla Estudiante por Matriculas
  public URL_ROOT_WS = this.URL_SERVER + '/api/matricula';
  public URL_ROOT_WS1 = this.URL_SERVER + '/api/reportesMatricula';
  public URL_ROOT_WS_Periodo = this.URL_SERVER + '/api/periodoacademico';
  public URL_ROOT_WS_Departamento = this.URL_SERVER + '/api/areas';
  public URL_ROOT_WS_Oferta = this.URL_SERVER + '/api/oferta';
  public URL_ROOT_WS_ParMatricula = this.URL_SERVER + '/api/parMatricula';
  constructor(private http: HttpClient) {

  }

  //PANTALLA PRINCIPAL MATRICULA 

  //metodo para listar los estudiante por facultad
  getListarEstudiantesMatricular(idDepartamentoOferta: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarEstudiantesAMatricular/' + idDepartamentoOferta);
  }
  //metodo para listar los estudiante matriculados
  getBuscarEstudianteMatricula(idEstudianteMatricula: number, idMatriculaGeneral: string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarEstudianteMatricula/' + idEstudianteMatricula + '/' + idMatriculaGeneral);
  }

  getRecuperarLabelPeriodoMatricula(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarLabelPeriodoMatricula');
  }
  //*********FIN PANTALLA mATRICULA ESTUDIANTE*/
  //PANTALLA HISTORIAL MATRICULACION

  //metodo para listar los estudiante matriculados
  getListarMatriculasEstudiante(idEstudianteOferta: string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarMatriculasEstudiante/' + idEstudianteOferta);
  }

  //metodo para listar detalle de matriucla por estudiantes
  getListaAsignaturasMatriculadasPeriodo(idEstudianteOferta: string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listaAsignaturasMatriculadasPeriodo/ ' + idEstudianteOferta);
  }

  getComprobanteMatriculaAnteriores(idEstudianteMatricula: number, idEstudianteOferta: number): Observable<Blob> {
    return this.http.get(this.URL_ROOT_WS1 + '/getComprobanteMatriculaAnteriores/' + idEstudianteMatricula + '/' + idEstudianteOferta, { responseType: 'blob' });
  }
  //*********FIN PANTALLA MATRICULACIÓN ***********/


  //PANTALLA MATRICULA

  //metodo para listar los estudiante por facultad

  numeroAsignaturasPorNivel(idEstudianteOferta: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/numeroAsignaturasPorNivel/ ' + idEstudianteOferta);
  }

  getRecuperarDatosEstudianteMatricular(idEstudianteOferta: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarDatosEstudianteMatricular/ ' + idEstudianteOferta);
  }

  getRecuperarAsignaturasAnuladasRetiradas(idEstudianteOferta: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarAsignaturasAnuladasRetiradas/ ' + idEstudianteOferta);
  }

  getRecuperarUltimoPeriodoMatricula(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarUltimoPeriodoMatricula ');
  }

  getRecuperarValidacionesUltimaMatricula(idMatriculaGeneral: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarValidacionesUltimaMatricula/ ' + idMatriculaGeneral);
  }

  getRecuperarValoresMatricula(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarValoresMatricula');
  }


  getlistarDocentesAsignaturas(idEstudianteOferta: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarDocentesAsignaturas/ ' + idEstudianteOferta);
  }

  getGenerarAsignaturasHabilitadas(idEstudianteOferta: number, opcion: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/generarAsignaturasHabilitadas/ ' + idEstudianteOferta + '/' + opcion);
  }

  borrarMatricula(idEstudianteMatricula: number) {
    return this.http.delete(this.URL_ROOT_WS + '/borrarMatricula/' + idEstudianteMatricula);
  }

  anularMatricula(idEstudianteMatricula: number, estado:string) {
    return this.http.delete(this.URL_ROOT_WS + '/anularMatricula/' + idEstudianteMatricula+ '/' + estado);
  }

  grabarMatriculaEstudiante(matriculaPojo: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarMatricula', matriculaPojo);
    return result;
  }

  grabarRetiroAsignatura(detalleEstudianteAsignatura: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarDetalleEstudianteAsignatura', detalleEstudianteAsignatura);
    return result;
  }

  grabarEdicionMatricula(matriculaPojoEdit: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarEdicionMatriculaAsignatura', matriculaPojoEdit);
    return result;
  }

  //*********FIN PANTALLA MATRICULA */

  //*********INICIO PANTALLA DE HOMOLOGACION ***********/

  listarPeriodo(): Observable<any> {//LISTADO DE PERIODO ACADEMICO
    return this.http.get(this.URL_ROOT_WS_Periodo + '/buscarPeriodoAcademico')
  }

  listarDepartamento(): Observable<any> {//LISTADO DEPARTAMENTO
    return this.http.get(this.URL_ROOT_WS_Departamento + '/listaDepartamento')
  }

  listarOferta(idDepartamento: Number): Observable<any> {//LISTADO DEPARTAMENTO
    return this.http.get(this.URL_ROOT_WS_Oferta + '/filtrarPorDepartamento/' + idDepartamento)
  }

  listaCarrerasOfertadas(idDepartamento: Number): Observable<any> {//LISTADO DEPARTAMENTO
    return this.http.get(this.URL_ROOT_WS_Oferta + '/listaCarrerasOfertadas/' + idDepartamento)
  }

  listarTipoMovilidad(): Observable<any> {//LISTADO DEPARTAMENTO
    return this.http.get(this.URL_ROOT_WS + '/listarTipoMovilidad')
  }

  listarSubtipoMovilidad(idTipoMovilidad: Number): Observable<any> {//LISTADO DEPARTAMENTO
    return this.http.get(this.URL_ROOT_WS + '/listarSubtipoMovilidad/' + idTipoMovilidad)
  }
  listarEstudianteOferta(idOferta: Number): Observable<any> {//LISTADO ESTUDIANTE OFERTA
    return this.http.get(this.URL_ROOT_WS + '/listarEstudianteOferta/' + idOferta)
  }

  listarDetalleMovilidadAsig(idEstudianteOferta: Number): Observable<any> {//LISTADO ESTUDIANTE OFERTA
    return this.http.get(this.URL_ROOT_WS + '/listarMovilidadDetalle/' + idEstudianteOferta)
  }

  recuperarDatosEstudianteMovilidad(idEstudianteOferta: Number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarDatosEstudianteMovilidad/' + idEstudianteOferta)
  }

  recuperarDetalleMovilidad(idEstudianteOferta: number, idSubtipoMovilidad: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarMovilidad/' + idEstudianteOferta + '/' + idSubtipoMovilidad)
  }

  recuperarTipoSubTipoMovilidad(idSubtipoMovilidad: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarTipoSubTipoMovilidad/' + idSubtipoMovilidad)
  }

  borrarMovilidadEstudiante(idMovilidad: number) {
    return this.http.delete(this.URL_ROOT_WS + '/borrarMovilidadEstudiante/' + idMovilidad);
  }

  grabarMovilidad(movilidadPojo: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarMovilidad', movilidadPojo);
    return result;
  }
  //*********FIN PANTALLA HOMOLOGACION */

  //PANTALLA PERIODO DE MATRICULA
  //metodo todos los periodos de matricula
  getListarPeriodosMatricula(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarPeriodosMatricula');
  }
  getListarPeriodosTipoMatricula(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarPeriodosTipoMatricula');
  }

  getRecuperarValidacionesReglamento(idReglamento: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarValidacionesReglamento/' + idReglamento);
  }

  getListarReglamentosMatricula(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarReglamentosMatricula');
  }

  getListarTiposMatricula(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarTiposMatricula');
  }

  getRecuperarMatriculaGeneral(idMatriculaGeneral: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarMatriculaGeneral/' + idMatriculaGeneral);
  }

  getRecuperarUltimoPeriodoAcademico(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarUltimoPeriodoAcademico');
  }

  getValidarUltimoPeriodoMatricula(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/validarUltimoPeriodoMatricula');
  }

  borrarPeriodoMatricula(idMatriculaGeneral: number) {
    return this.http.delete(this.URL_ROOT_WS + '/borrarPeriodoMatricula/' + idMatriculaGeneral);
  }

  grabarMatriculaGeneral(matriculaGeneralPojo: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarMatriculaGeneral', matriculaGeneralPojo);
    return result;
  }

  //*********FIN PANTALLA PERIODO DE MATRICULA ***********/

  //PANTALLA REGLAMENTOS *********

  getListarTodosReglamentos(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarTodosReglamentos');
  }

  getListarTipoReglamentos(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarTipoReglamentos');
  }

  getListarTipoOfertas(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarTipoOfertas');
  }

  getRecuperarReglamentoId(idReglamento: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarReglamentoId/ ' + idReglamento);
  }

  getRecuperarValidacionesUltimoReglamento(idTipoReglamento: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarValidacionesUltimoReglamento/' + idTipoReglamento);
  }

  getRecuperarReglamentoPojo(idReglamento: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarReglamento/' + idReglamento);
  }

  borrarReglamento(idReglamento: number) {
    return this.http.delete(this.URL_ROOT_WS + '/borrarReglamento/' + idReglamento);
  }

  grabarReglamento(ReglamentoPojo: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarReglamento', ReglamentoPojo);
    return result;
  }
  //*********FIN PANTALLA REGLAMENTOS ***********/

  //PANTALLA ESTUDIANTES *********
  getListarEstudianteRegistrados(idDepartamentoOferta: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarEstudianteRegistrados/' + idDepartamentoOferta);
  }

  getBuscarEstudiante(idPersona: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarEstudiante/' + idPersona);
  }

  getBuscarEstudiantePorCedula(cedula: string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarEstudiantePorCedula/' + cedula);
  }

  getListarTiposEstudiantes(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarTiposEstudiantes');
  }

  getListarTipoIngresoEstudiante(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listarTipoIngresoEstudiante');
  }

  getRecuperarMallaCarreraFacultad(idDepartamentoOferta: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarMallaCarreraFacultad/' + idDepartamentoOferta);
  }

  getRecuperarUltimoMatriculado(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/recuperarUltimoMatriculado');
  }

  borrarEstudiante(idPersona: number) {
    return this.http.delete(this.URL_ROOT_WS + '/borrarEstudiante/' + idPersona);
  }

  grabarEstudiante(EstudiantrePojo: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarEstudiante', EstudiantrePojo);
    return result;
  }

  //*********FIN PANTALLA ESTUDIANTES ***********/

  //PANTALLA PARAMETRICAS DE MATRICULA

  getListadoTiposMatricula(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/listadoTiposMatricula');
  }

  getListadoTiposMovilidad(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/listadoTiposMovilidad');
  }

  getListadoTiposReglamentos(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/listadoTiposReglamentos');
  }

  getListadoTiposEstudiantes(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/listadoTiposEstudiantes');
  }

  getListadoTiposIngresoEstudiante(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/listadoTiposIngresoEstudiante');
  }

  getListadoSubtiposMovilidad(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/listadoSubtiposMovilidad');
  }

  getListadoTiposOferta(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/listadoTiposOferta');
  }

  getListadoCostosAsignatura(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/listadoCostosAsignatura');
  }
  //recuperan por id
  getBuscarTipodeMatricula(idParametrica: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/buscarTipodeMatricula/ ' + idParametrica);
  }

  getBuscarTipodeReglamento(idParametrica: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/buscarTipodeReglamento/ ' + idParametrica);
  }

  getBuscarTipodeEstudiante(idParametrica: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/buscarTipodeEstudiante/' + idParametrica);
  }

  getBuscarTipodeIngresoEstudiante(idParametrica: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/buscarTipodeIngresoEstudiante/' + idParametrica);
  }

  getBuscarTipodeMovilidad(idParametrica: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/buscarTipodeMovilidad/' + idParametrica);
  }

  getBuscarSubTipoMovilidad(idParametrica: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/buscarSubTipoMovilidad/' + idParametrica);
  }

  getBuscarTipodeOferta(idParametrica: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/buscarTipodeOferta/' + idParametrica);
  }

  getBuscarCostosdeAsignatura(idParametrica: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS_ParMatricula + '/buscarCostosdeAsignatura/ ' + idParametrica);
  }
  //para grabar
  grabarTipoMatricula(pojoParametrica: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS_ParMatricula + '/grabarTipoMatricula', pojoParametrica);
    return result;
  }

  grabarTipoReglamento(pojoParametrica: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS_ParMatricula + '/grabarTipoReglamento', pojoParametrica);
    return result;
  }

  grabarTipoEstudiante(pojoParametrica: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS_ParMatricula + '/grabarTipoEstudiante', pojoParametrica);
    return result;
  }

  grabarTipoIngresoEstudiante(pojoParametrica: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS_ParMatricula + '/grabarTipoIngresoEstudiante', pojoParametrica);
    return result;
  }

  grabarTipoMovilidad(pojoParametrica: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS_ParMatricula + '/grabarTipoMovilidad', pojoParametrica);
    return result;
  }

  grabarSubtipoMovilidad(pojoParametrica: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS_ParMatricula + '/grabarSubtipoMovilidad', pojoParametrica);
    return result;
  }

  grabarTipoOferta(pojoParametrica: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS_ParMatricula + '/grabarTipoOferta', pojoParametrica);
    return result;
  }

  grabarCostoAsignatura(pojoParametrica: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS_ParMatricula + '/grabarCostoAsignatura', pojoParametrica);
    return result;
  }

  //para borrar
  borrarTipoMatricula(idParametrica: number) {
    return this.http.delete(this.URL_ROOT_WS_ParMatricula + '/borrarTipoMatricula/' + idParametrica);
  }

  borrarTipoReglamento(idParametrica: number) {
    return this.http.delete(this.URL_ROOT_WS_ParMatricula + '/borrarTipoReglamento/' + idParametrica);
  }

  borrarTipoEstudiante(idParametrica: number) {
    return this.http.delete(this.URL_ROOT_WS_ParMatricula + '/borrarTipoEstudiante/' + idParametrica);
  }

  borrarTipoIngresoEstudiante(idParametrica: number) {
    return this.http.delete(this.URL_ROOT_WS_ParMatricula + '/borrarTipoIngresoEstudiante/' + idParametrica);
  }

  borrarTipoMovilidad(idParametrica: number) {
    return this.http.delete(this.URL_ROOT_WS_ParMatricula + '/borrarTipoMovilidad/' + idParametrica);
  }

  borrarSubtipoMovilidad(idParametrica: number) {
    return this.http.delete(this.URL_ROOT_WS_ParMatricula + '/borrarSubtipoMovilidad/' + idParametrica);
  }

  borrarTipoOferta(idParametrica: number) {
    return this.http.delete(this.URL_ROOT_WS_ParMatricula + '/borrarTipoOferta/' + idParametrica);
  }

  borrarCostoAsignatura(idParametrica: number) {
    return this.http.delete(this.URL_ROOT_WS_ParMatricula + '/borrarCostoAsignatura/' + idParametrica);
  }
  //*********FIN PANTALLA ESTUDIANTES ***********/


  //PANTALLA REPORTE PERMANENCIA

  getCargarTodasCarreras(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/cargarTodasCarreras ');
  }

  getReportTasaPermanenciaEst(idPeriodoAnterior: number, idPeriodoActual: number, idOferta: number): Observable<Blob> {
    return this.http.get(this.URL_ROOT_WS1 + '/getReportTasaPermanenciaEst/' + idPeriodoAnterior + '/' + idPeriodoActual + '/' + idOferta, { responseType: 'blob' });
  }

  getListaAsignaturaParalelo(idPeriodoAcademico: number, idOferta: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listaAsignaturaParalelo/' + idPeriodoAcademico + '/' + idOferta);
  }

  getListaOfertaAsignatura(idPeriodoAcademico: number, idOferta: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listaOfertaAsignatura/' + idPeriodoAcademico + '/' + idOferta);
  }

  getReportTotalMatriculadosOferta(filterIdPeriodo: number, filterIdDepartamento: number): Observable<Blob> {
    return this.http.get(this.URL_ROOT_WS1 + '/getReportTotalMatriculadosOferta/' + filterIdPeriodo + '/' + filterIdDepartamento, { responseType: 'blob' });
  }

  getReportCantidadMatriculadosOferta(filterIdPeriodo: number, filterIdOferta: number): Observable<Blob> {
    return this.http.get(this.URL_ROOT_WS1 + '/getReportCantidadMatriculadosOferta/' + filterIdPeriodo + '/' + filterIdOferta, { responseType: 'blob' });
  }

  getReportEstudiantesMatriculadosAsignatura(idMallaAsignatura: number, idPeriodoAcademico: number, idParalelo: number): Observable<Blob> {
    return this.http.get(this.URL_ROOT_WS1 + '/getReportEstudiantesMatriculadosAsignatura/' + idMallaAsignatura + '/' + idPeriodoAcademico + 
    '/' + idParalelo, { responseType: 'blob' });
  }
  // getReportEstudiantesMatriculadosAsignatura(idMallaAsignatura: number, idPeriodoAcademico: number, idParalelo: number, formato: string): Observable<Blob> {
  //   return this.http.get(this.URL_ROOT_WS1 + '/getReportEstudiantesMatriculadosAsignatura/' + idMallaAsignatura + '/' + idPeriodoAcademico + '/' + idParalelo + '/' + formato, { responseType: 'blob' });
  // }

  getReportCorteEstudiantes(idPeriodoAnterior: number, idPeriodoActual: number, idOferta: number): Observable<Blob> {
    return this.http.get(this.URL_ROOT_WS1 + '/getReportCorteEstudiantes/' + idPeriodoAnterior + '/' + idPeriodoActual + '/' + idOferta, { responseType: 'blob' });
  }

  getReportTotalMatriculadosFacultades(idPeriodoAcademico: number): Observable<Blob> {
    return this.http.get(this.URL_ROOT_WS1 + '/getReportTotalMatriculadosFacultades/' + idPeriodoAcademico, { responseType: 'blob' });
  }
  //*********FIN PANTALLA REPORTE PERMANENCIA */
}

