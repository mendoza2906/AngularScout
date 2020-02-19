import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { Subscription, iif } from 'rxjs';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxwindow';
import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
declare var $;
@Component({
  selector: 'app-matricula-estudiante',
  templateUrl: './matricula-estudiante.component.html',
  styleUrls: ['./matricula-estudiante.component.scss']
})
export class MatriculaEstudianteComponent implements OnInit {

  @ViewChild('txtObservacion') txtObservacion: jqxTextAreaComponent;
  @ViewChild('myNumeroOficio') txtNumeroOficio: jqxInputComponent;
  @ViewChild('myObservacionMat') txtObservacionMat: jqxInputComponent;
  @ViewChild('myWindow') myWindow: jqxWindowComponent;
  @ViewChild('myGriDMatricula', { read: false }) gridMatricula: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('jqxMenu') jqxMenu: jqxMenuComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;
  @ViewChild('botonAnular') botonAnular: jqxButtonComponent;
  @ViewChild('botonActivar') botonActivar: jqxButtonComponent;
  @ViewChild('botonRetirar') botonRetirar: jqxButtonComponent;

  sub: Subscription;
  constructor(private router: Router, private route: ActivatedRoute,
    private MatriculasService: MatriculasService) { }
  firstRender: boolean = true;
  //Variables que serán usadas como Label solo de visualización
  labelIdentificacion: string;
  labelCarrera: string;
  labelUltimoPeriodoMatricula: string;
  labelNombres: string;
  labelNumeroMatricula: string;
  labelTipoMatricula: string;
  labelOpcion: string;
  labelNivelMaximo: number;
  labelPeriodoActual: any;
  sumaComponenteAsig: number = 0;
  sumaContactoDocente: number = 0;
  sumaCreditos: number = 0;
  sumaValorMatricula: number = 0;
  //Declaracion de variables
  //Variables global que es devuelta por parametros
  idEstudianteOfertaGlobal: number;
  idOpcionGlobal: number;
  idMatriculaGeneralGlobal: string;
  primerSemestreGlobal: number;
  horasMaxSemanaComponentesGlobal: number;
  horasMaxSemanaDocenciaGlobal: number;
  numMaxCreditosGlobal: number;
  numMinCreditosGlobal: number;
  fechaDesdeAux: string;
  fechaHastaAux: string;

  //arreglos-listas para generar el json;
  pojoEstudianteMatricula: any;
  estudianteMatriculasAng: any = {};
  estudianteAsignaturasAng: any = {};
  selectedRowIndex = 0
  editrow: number = -1;
  adapterComponenteDocencia: any;
  adapterComponentePractica: any;
  banderaSinDocente: boolean = false;
  banderaSinDocentePractica: boolean = false;
  ocultarPdfViewer: boolean = true;
  isCollapsed: boolean = false;
  pdfSrc: string = '';
  opcionEdicion: number;
  ocultarAnular: boolean = true
  banderaMatriculaNivel:boolean;
  auxCountDocMallaAsig: any = [];

  ngOnInit() {
    this.gridMatricula.refreshdata()
    this.sub = this.route.params.subscribe(params => {
      // Recupera el valor del parametro pasado en la ruta.
      this.idEstudianteOfertaGlobal = params['idEstudianteOferta'];
      this.idOpcionGlobal = params['idOpcion'];
      this.primerSemestreGlobal = params['primerSemestre'];
      // Evalua si el parametro id se paso.
      this.numeroAsignaturasPorNivel()
      if (this.idOpcionGlobal == 1) {
        this.labelOpcion = 'Nueva '
      }
      else if (this.idOpcionGlobal == 2) {
        this.labelOpcion = 'Edición de '
        // this.recuperarEstudianteMatricula()
      }
      else if (this.idOpcionGlobal == 3) {
        this.ocultarAnular = false
        this.labelOpcion = 'Anulación/Retiro de '
        this.recuperarAsignaturasAnuladasRetiradas(this.idEstudianteOfertaGlobal)
      }
      if (this.idEstudianteOfertaGlobal) {
        this.recuperaDatosEstudianteMatricula(this.idEstudianteOfertaGlobal);
        this.recuperaPeriodoActualMatricula();
        this.generarAsignaturasHabilitadas(this.idEstudianteOfertaGlobal);
        this.listarDocentesAsignaturas(this.idEstudianteOfertaGlobal);
      }
    });
  }

  ngAfterViewInit(): void {

    if (this.idOpcionGlobal == 1 || this.idOpcionGlobal == 2) {
      this.gridMatricula.hidecolumn('X')
      this.gridMatricula.hidecolumn('R')
    } else {
      this.jqxMenu.disable('1', true);
      this.txtObservacion.disabled(true)
      this.gridMatricula.hidecolumn('totalHorasD')
      this.gridMatricula.hidecolumn('totalHorasA')
      this.gridMatricula.hidecolumn('idDocAsigAprend')
      this.gridMatricula.hidecolumn('idDocAsigAprendP')

    }
  }

  setAndCheckAsignturas(listado: any) {
    let rowsJson = this.gridMatricula.getrows()
    let dataAdapter = this.dataAdapterDocentesAsignaturas;
    let length = dataAdapter.records.length;
    let sumaComponentes = 0
    let sumaDocencia = 0
    let sumaCreditos = 0
    let sumaTotalMatricula = 0
    let contadorDocentes = 0;
    let contadorSinCupo = 0;
    let columnDoc = this.gridMatricula.getcolumn('idDocAsigAprend');
    for (let i = 0; i < rowsJson.length; i++) {
      let idDocenteGRID = this.gridMatricula.getcellvalue(i, 'idDocenteAsignaturaAprend')
      let columnDocPract = this.gridMatricula.getcolumn('idDocAsigAprendP');
      let idDocentePracticaGRID = this.gridMatricula.getcellvalue(i, 'idDocentePractica')
      let nivel = this.gridMatricula.getcellvalue(i, 'nivel')
      let horasDoc = this.gridMatricula.getcellvalue(i, 'totalHorasD')
      let horasAsig = this.gridMatricula.getcellvalue(i, 'totalHorasA')
      let valorAsig = this.gridMatricula.getcellvalue(i, 'valorAsignatura')
      let numCreditos = this.gridMatricula.getcellvalue(i, 'numeroCreditos')
      let idMallaAsignatura = this.gridMatricula.getcellvalue(i, 'idMallaAsignatura')
      let vez = this.gridMatricula.getcellvalue(i, 'numVez')
      if ((this.primerSemestreGlobal == 0 || this.verificarEsRegular()) && !idDocenteGRID || 
      (this.verificarSiNoSobrepasaCreditos() && this.banderaMatriculaNivel)) {
        this.gridMatricula.selectrow(i);
        this.gridMatricula.setcellvalue(i, 'valorCheck', true)
        sumaComponentes = sumaComponentes + Number(horasAsig);
        sumaDocencia = sumaDocencia + Number(horasDoc);
        sumaCreditos = sumaCreditos + Number(numCreditos);
        this.sumaValorMatricula = this.sumaValorMatricula + Number(valorAsig);
        sumaTotalMatricula = sumaTotalMatricula + Number(valorAsig);
      } else {
        if (idDocenteGRID || nivel < this.labelNivelMaximo || vez != '1 VEZ') {
          this.gridMatricula.selectrow(i);
          this.gridMatricula.setcellvalue(i, 'valorCheck', true)
          sumaComponentes = sumaComponentes + Number(horasAsig);
          sumaDocencia = sumaDocencia + Number(horasDoc);
          sumaCreditos = sumaCreditos + Number(numCreditos);
          this.sumaValorMatricula = this.sumaValorMatricula + Number(valorAsig);
          sumaTotalMatricula = sumaTotalMatricula + Number(valorAsig);
        } else {
          this.gridMatricula.setcellvalue(i, 'valorCheck', false)
        }
      }
      if(idDocenteGRID){
        for (let j = 0; j < length; j++) {
          let record = dataAdapter.records[j];
          if (record.idDocAsigAprend == idDocenteGRID)
            this.gridMatricula.setcellvalue(i, columnDoc.displayfield, record.nombreDocente)
          else if (record.idDocAsigAprend == idDocentePracticaGRID)
            this.gridMatricula.setcellvalue(i, columnDocPract.displayfield, record.nombreDocente)
        }
      }else{
        let columnDoc = this.gridMatricula.getcolumn('idDocAsigAprend');
        this.gridMatricula.setcellvalue(i, columnDoc.displayfield, 'Seleccione un docente...')
      }
      for (let j = 0; j < listado.length; j++) {
        if (listado) {
          if (idMallaAsignatura == listado[j].idMallaAsig) {
            contadorDocentes = contadorDocentes + 1;
            if (Number(listado[j].numEstudiantes) <= Number(listado[j].numMatriculados)) {
              contadorSinCupo = contadorSinCupo + 1;
            }
          }
          if (j == (listado.length) - 1) {
            this.auxCountDocMallaAsig.push({
              "idMallaAsignatura": idMallaAsignatura,
              "cantidadDoc": contadorDocentes, "cantidadCup": contadorSinCupo
            });
            contadorDocentes = 0
            contadorSinCupo = 0
          }
        }
      }
    }
    this.sumaComponenteAsig = sumaComponentes
    this.sumaContactoDocente = sumaDocencia
    this.sumaCreditos = sumaCreditos
    this.sumaValorMatricula = Number(sumaTotalMatricula.toFixed(3))
  }

  checkSumaHoras(event: any): void {
    let sumaComponentes = this.sumaComponenteAsig
    let sumaDocencia = this.sumaContactoDocente
    let sumaCreditos = this.sumaCreditos
    let sumaTotal1 = this.sumaValorMatricula
    let horasAsig = event.args.row.totalHorasA;
    let horasDoc = event.args.row.totalHorasD;
    let valorAsig = event.args.row.valorAsignatura;
    let creditos = event.args.row.numeroCreditos;
    let idDocAsigAprend = event.args.row.idDocenteAsignaturaAprend;
    if (!idDocAsigAprend) {
      sumaComponentes = sumaComponentes + Number(horasAsig);
      sumaDocencia = sumaDocencia + Number(horasDoc);
      sumaCreditos = sumaCreditos + Number(creditos);
      sumaTotal1 = sumaTotal1 + Number(valorAsig);
    }
    this.sumaComponenteAsig = sumaComponentes
    this.sumaContactoDocente = sumaDocencia
    this.sumaCreditos = sumaCreditos
    this.sumaValorMatricula = Number(sumaTotal1.toFixed(2))
  }

  checkRestarHoras(event: any): void {
    let sumaComponentes = this.sumaComponenteAsig
    let sumaDocencia = this.sumaContactoDocente
    let sumaCreditos = this.sumaCreditos
    let sumaTotal1 = this.sumaValorMatricula
    let horasAsig = event.args.row.totalHorasA;
    let horasDoc = event.args.row.totalHorasD;
    let valorAsig = event.args.row.valorAsignatura;
    let creditos = event.args.row.numeroCreditos;
    let idDocAsigAprend = event.args.row.idDocenteAsignaturaAprend;
    if (!idDocAsigAprend) {
      sumaComponentes = sumaComponentes - Number(horasAsig);
      sumaDocencia = sumaDocencia - Number(horasDoc);
      sumaCreditos = sumaCreditos - Number(creditos);
      sumaTotal1 = sumaTotal1 + Number(valorAsig);
    }
    this.sumaComponenteAsig = sumaComponentes
    this.sumaContactoDocente = sumaDocencia
    this.sumaCreditos = sumaCreditos
    this.sumaValorMatricula = Number(sumaTotal1.toFixed(2))
  }

  recuperarEstudianteMatricula() {
    this.MatriculasService.getBuscarEstudianteMatricula(this.idEstudianteOfertaGlobal, this.idMatriculaGeneralGlobal).subscribe((estudianteMatricula: any) => {
      this.pojoEstudianteMatricula = estudianteMatricula
      if (estudianteMatricula) {
        if (estudianteMatricula.estado == 'X')
          this.botonAnular.value('Deshacer Anulación')
        else
          this.botonAnular.value('Anular Matrícula')
        if (!this.txtObservacion.val())
          this.txtObservacion.val(estudianteMatricula.observacion)
      }
    });
  }

  generarJsonEstudianteAsignaturas() {
    this.recuperaPeriodoActualMatricula()
    let varIdEstudianteMatricula: any
    if (this.pojoEstudianteMatricula) {
      varIdEstudianteMatricula = this.pojoEstudianteMatricula.id
      this.pojoEstudianteMatricula.observacion = this.txtObservacion.val();
    } else {
      varIdEstudianteMatricula = null
    }
    // genera la matriculaEstudiante
    this.estudianteMatriculasAng['id'] = varIdEstudianteMatricula;
    this.estudianteMatriculasAng['idEstudianteOferta'] = this.idEstudianteOfertaGlobal
    this.estudianteMatriculasAng['idMatriculaGeneral'] = this.idMatriculaGeneralGlobal
    this.estudianteMatriculasAng['estado'] = "A";
    // let fechaIngresoEM = new Date();
    // datosEstudianteMatricula['fechaIngreso'] = fechaIngresoEM.getTime();
    this.estudianteMatriculasAng['observacion'] = this.txtObservacion.val();
    this.estudianteMatriculasAng['usuarioIngresoId'] = "1";
    this.estudianteMatriculasAng['version'] = 0;
    this.estudianteMatriculasAng['estudianteAsignaturas'] = [];

    //generar las asignturas del estudiante
    let filasSeleccionadas = [];
    filasSeleccionadas = this.gridMatricula.getselectedrowindexes();
    let valIdDocAsigAprend: any
    this.banderaSinDocente = false
    this.banderaSinDocentePractica = false
    for (let sel = 0; sel < filasSeleccionadas.length; sel++) {
      let i = filasSeleccionadas[sel]
      let idDocenteGRID = this.gridMatricula.getcellvalue(i, 'idDocenteAsignaturaAprend')
      if (!idDocenteGRID) {
        let columnDocente = this.gridMatricula.getcolumn('idDocAsigAprend');
        let idComboDocente = this.gridMatricula.getcellvalue(i, columnDocente.datafield);
        //otro docente
        let columnDocentePractica = this.gridMatricula.getcolumn('idDocAsigAprendP');
        let labelDocentePractica = this.gridMatricula.getcellvalue(i, columnDocentePractica.displayfield);
        let idComboDocentePractica = this.gridMatricula.getcellvalue(i, columnDocentePractica.datafield);
        ///////////
        if (!idComboDocente || idComboDocente == '') {
          this.gridMatricula.setcellvalue(i, columnDocente.displayfield, 'Seleccione correctamente al docente...');
          this.banderaSinDocente = true
        }

        if (labelDocentePractica != 'No Aplica' && !idComboDocentePractica) {
          if (!idComboDocentePractica)
            this.banderaSinDocentePractica = true
        }

        let codigoAsignatura: any;
        let codigoAsignaturaGRID = this.gridMatricula.getcellvalue(i, 'numVez');
        if (codigoAsignaturaGRID == "1 VEZ")
          codigoAsignatura = "PRI"
        else if (codigoAsignaturaGRID == "2 VEZ")
          codigoAsignatura = "SEG"
        else
          codigoAsignatura = "TER"

        if (idDocenteGRID)
          valIdDocAsigAprend = idDocenteGRID
        else
          valIdDocAsigAprend = idComboDocente

        let datosEstudianteAsignatura: any = {
          "id": null, "idDocenteAsignaturaAprend": valIdDocAsigAprend, "idEstudianteMatricula": varIdEstudianteMatricula,
          "idCostoAsignatura": this.gridMatricula.getcellvalue(i, 'idCostoAsignatura'),
          "codigoEstadoMatricula": codigoAsignatura, "estado": "A", "usuarioIngresoId": "1",
          "valorAsignatura": this.gridMatricula.getcellvalue(i, 'valorAsignatura'), "version": 0
        };

        if (labelDocentePractica != 'No Aplica' && idComboDocentePractica) {
          let datosEstudianteAsignaturaPract: any = {
            "id": null, "idDocenteAsignaturaAprend": idComboDocentePractica, "idEstudianteMatricula": varIdEstudianteMatricula,
            "idCostoAsignatura": this.gridMatricula.getcellvalue(i, 'idCostoAsignatura'),
            "codigoEstadoMatricula": codigoAsignatura, "estado": "A", "usuarioIngresoId": "1",
            "valorAsignatura": this.gridMatricula.getcellvalue(i, 'valorAsignatura'), "version": 0
          };
          this.estudianteMatriculasAng['estudianteAsignaturas'].push(datosEstudianteAsignaturaPract);
          if (this.pojoEstudianteMatricula)
            this.pojoEstudianteMatricula.estudianteAsignaturas.push(datosEstudianteAsignaturaPract)
        }
        this.estudianteMatriculasAng['estudianteAsignaturas'].push(datosEstudianteAsignatura);
        if (this.pojoEstudianteMatricula)
          this.pojoEstudianteMatricula.estudianteAsignaturas.push(datosEstudianteAsignatura)
      }
    }
    if (this.pojoEstudianteMatricula) {
      this.estudianteMatriculasAng = this.pojoEstudianteMatricula
    }
  }

  jsonGrabarModificacion(idEstudianteAsignatura: any, idEstudianteAsignaturaPrac: any, opcion: string) {
    let modificacionMatricula: any = [];
    modificacionMatricula.push({
      "idEstudianteAsignatura": idEstudianteAsignatura, "estado": opcion
    });
    if (idEstudianteAsignaturaPrac) {
      modificacionMatricula.push({
        "idEstudianteAsignatura": idEstudianteAsignaturaPrac, "estado": opcion
      });
    }
    this.MatriculasService.grabarEdicionMatricula(modificacionMatricula).subscribe(result => {
      this.recuperarAsignaturasAnuladasRetiradas(this.idEstudianteOfertaGlobal);
    }, error => console.error(error));
  }


  jsonGrabarRetiroAsignatura(idEstudianteAsignatura: any, idEstudianteAsignaturaPrac: any, opcion: string) {
    let observacion, oficio, mensaje: string
    if (opcion == 'R') {
      observacion = this.txtObservacionMat.val()
      oficio = this.txtNumeroOficio.val()
      mensaje = 'retirada'
    } else if (opcion == 'A') {
      observacion = this.txtObservacionMat.val()
      oficio = this.txtNumeroOficio.val()
      mensaje = 'activada'
    } else {
      observacion = 'Por disposición de autoridades'
      oficio = 'Ninguno'
    }
    let detalleEstudianteAsignatura: any = {
      "id": null, "idEstudianteAsignatura": Number(idEstudianteAsignatura), "observacion": observacion,
      "numeroOficio": oficio, "estado": opcion, "usuarioIngresoId": "1", "version": 0
    }
    this.MatriculasService.grabarRetiroAsignatura(detalleEstudianteAsignatura).subscribe(result => {
      this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Asignatura ' + mensaje + ' Correctamente' });
    }, error => console.error(error));

    if (idEstudianteAsignaturaPrac) {
      let detalleEstudianteAsignatura: any = {
        "id": null, "idEstudianteAsignatura": Number(idEstudianteAsignaturaPrac), "observacion": observacion,
        "numeroOficio": oficio, "estado": opcion, "usuarioIngresoId": "1", "version": 0
      }
      this.MatriculasService.grabarRetiroAsignatura(detalleEstudianteAsignatura).subscribe(result => {
      }, error => console.error(error));
    }
  }


  data = [
    {
      'id': '1',
      'text': 'Grabar',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'text': 'Cancelar',
      'id': '2',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },

  ];

  source1 =
    {
      datatype: 'json',
      datafields: [
        { name: 'id' },
        { name: 'parentid' },
        { name: 'text' },
        { name: 'subMenuWidth' }
      ],
      id: 'id',
      localdata: this.data
    };

  getAdapter(source1: any): any {
    return new jqx.dataAdapter(this.source1, { autoBind: true });
  };
  menus = this.getAdapter(this.source1).getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);

  gotoList() {
    this.router.navigate(['/matriculas/matricula-lista-estudiante']);
    this.myWindow.hide();
    this.myWindow.close()
    // window.location.reload(true)
  }

  itemclick(event: any): void {
    var opt = event.args.innerText;
    switch (opt) {
      case 'Grabar':
        //Activa el validador del formulario
        let marcadas = [];
        marcadas = this.gridMatricula.getselectedrowindexes();
        if (marcadas.length == 0) {
          this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Seleccione al menos una asignatura!' });
        } else {
          if (this.numMinCreditosGlobal == 0 || this.sumaCreditos >= this.numMinCreditosGlobal) {
            this.generarJsonEstudianteAsignaturas()
            if (this.banderaSinDocente == true) {
              this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Existe una asignatura sin Docente!' });
            } else if (this.banderaSinDocentePractica == true) {
              this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Existe una asignatura sin Docente para el componente Práctico!' });
            } else {
              this.myModal.alertQuestion({
                title: 'Matriculación Estudiantil',
                msg: 'Desea grabar sus registros?',
                result: (k) => {
                  if (k) {
                    this.MatriculasService.grabarMatriculaEstudiante(this.estudianteMatriculasAng).subscribe(result => {
                      this.verComprobanteMatricula(0,this.idEstudianteOfertaGlobal);
                      // this.listarDocentesAsignaturas(this.idEstudianteOfertaGlobal);
                      // this.gotoList();
                    }, error => console.error(error));
                  }
                }
              })
            }
          } else {
            this.myModal.alertMessage({
              title: 'Matriculación Estudiantil', msg: 'Las asignaturas seleccionadas no suman el número mínimo de ' +
                this.numMinCreditosGlobal + ' créditos permitidos!'
            });
          }
        }
        break;
      case 'Cancelar':
        this.gotoList();
        break;
      default:
    }
  };

  //Recupera datos del estudiante a matricular
  recuperaDatosEstudianteMatricula(idEstudianteOferta: number) {
    this.MatriculasService.getRecuperarDatosEstudianteMatricular(idEstudianteOferta).subscribe(data => {
      if (data) {
        this.labelIdentificacion = data[0].identificacion
        this.labelNombres = data[0].nombres
        this.labelCarrera = data[0].carrera
        this.labelNumeroMatricula = data[0].numeroMatricula
        this.labelUltimoPeriodoMatricula = data[0].ultimoPeriodo
      }
    });
  }

  recuperaPeriodoActualMatricula() {
    this.MatriculasService.getRecuperarUltimoPeriodoMatricula().subscribe(data => {
      if (data.length > 0) {
        this.labelPeriodoActual = data[0].codigo;
        this.labelTipoMatricula = data[0].descripcionTipoOferta
        this.idMatriculaGeneralGlobal = data[0].idMatriculaGeneral;
        this.banderaMatriculaNivel =  data[0].matriculaNivel
        if (data) {
          this.MatriculasService.getRecuperarValoresMatricula().subscribe(datos => {
            for (let i = 0; i < datos.length; i++) {
              // if (data[0].codigoTipoMat == 'ESP')
              //   if (datos[i].codigo == "DMAES")
              //     this.sumaValorMatricula = this.sumaValorMatricula + Number(datos[i].valor);
              //   else 
              if (data[0].codigoTipoMat == 'EXT')
                if (datos[i].codigo == "DMAEX")
                  this.sumaValorMatricula = this.sumaValorMatricula + Number(datos[i].valor);
            }
          });
        }
        this.MatriculasService.getRecuperarValidacionesUltimaMatricula(Number(this.idMatriculaGeneralGlobal)).subscribe(data => {
          if (data) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].codigo == "HMDCD") {
                this.horasMaxSemanaDocenciaGlobal = Number(data[i].valor);
              } else if (data[i].codigo == "HMDCA") {
                this.horasMaxSemanaComponentesGlobal = Number(data[i].valor);
              } else if (data[i].codigo == "NMDCP") {
                this.numMaxCreditosGlobal = Number(data[i].valor);
              } else if (data[i].codigo == "NMICP") {
                this.numMinCreditosGlobal = Number(data[i].valor);
              }
            }
          }
        });
        this.recuperarEstudianteMatricula()
      }
    });
  }

  //FUENTE DE DATOS PARA EL COMBOBOX DE DOCENTE PRACTICA
  dataFieldsPractica: any[] = [
    { name: 'idDocAsigAprendP', type: 'string' },
    { name: 'idDocAsigAprend', type: 'string' },
    { name: 'nombreDocente', type: 'string' },
    { name: 'nombreDocenteP', type: 'string' },
    { name: 'idMallaAsigP', type: 'string' },
    { name: 'idDistributivoDocente', type: 'string' },
    { name: 'numEstudiantes', type: 'string' },
    { name: 'numMatriculados', type: 'string' },
    { name: 'codigo', type: 'string' },
    { name: 'idParalelo', type: 'string' },
  ];

  //FUENTE DE DATOS PARA EL COMBOBOX DE DOCENTE TEORIA
  dataFieldsTeoria: any[] = [
    { name: 'idDocAsigAprend', type: 'string' },
    { name: 'nombreDocente', type: 'string' },
    { name: 'idMallaAsig', type: 'string' },
    { name: 'idDistributivoDocente', type: 'string' },
    { name: 'numEstudiantes', type: 'string' },
    { name: 'numMatriculados', type: 'string' },
    { name: 'codigo', type: 'string' },
    { name: 'idParalelo', type: 'string' },
  ];
  sourceDocentesAsignaturas: any = {
    id: 'idDocAsigAprend',
    datafields: this.dataFieldsTeoria,
    localData: [],

  };

  dataAdapterDocentesAsignaturas: any = new jqx.dataAdapter(this.sourceDocentesAsignaturas);

  listarDocentesAsignaturas(idEstudianteOferta: number) {
    this.MatriculasService.getlistarDocentesAsignaturas(idEstudianteOferta).subscribe(data => {
      this.sourceDocentesAsignaturas.localdata = data;
      this.dataAdapterDocentesAsignaturas.dataBind();
      this.verificarDocentePractica()
      this.setAndCheckAsignturas(data);

    });
  }

  verificarCantidadCupos(listado: any) {
    let rowsJson = this.gridMatricula.getrows()
    let contadorDocentes = 0;
    let contadorSinCupo = 0;
    for (let i = 0; i < rowsJson.length; i++) {
      let idMallaAsignatura = this.gridMatricula.getcellvalue(i, 'idMallaAsignatura')
      for (let j = 0; j < listado.length; j++) {
        if (listado) {
          if (idMallaAsignatura == listado[j].idMallaAsig) {
            contadorDocentes = contadorDocentes + 1;
            if (Number(listado[j].numEstudiantes) <= Number(listado[j].numMatriculados)) {
              contadorSinCupo = contadorSinCupo + 1;
            }
          }
          if (j == (listado.length) - 1) {
            this.auxCountDocMallaAsig.push({
              "idMallaAsignatura": idMallaAsignatura,
              "cantidadDoc": contadorDocentes, "cantidadCup": contadorSinCupo
            });
            contadorDocentes = 0
            contadorSinCupo = 0
          }
        }
      }
    }
  }

  verificarEsRegular(): boolean {
    let esRegular: boolean = false
    let dataAdapter = this.sourceNumeroAsignaturas.localdata
    let rowsJson = this.gridMatricula.getrows()
    let cont: number = 0
    for (let i = 0; i < rowsJson.length; i++) {
      let idNivel = this.gridMatricula.getcellvalue(i, 'nivel')
      if (idNivel == this.labelNivelMaximo)
        cont++
    }
    for (let i = 0; i < dataAdapter.length; i++) {
      let record = dataAdapter[i];
      if (record.idNivel == this.labelNivelMaximo && record.numMaterias == cont && cont==rowsJson.length) {
        esRegular = true
      }
    }
    return esRegular

  };


  verificarSiNoSobrepasaCreditos(): boolean {
    let nopasa: boolean = false
    let rowsJson = this.gridMatricula.getrows()
    let cont: number = 0
    // this.MatriculasService.getRecuperarUltimoPeriodoMatricula().subscribe(data => {
    //   if (data.length > 0) {
    //     this.idMatriculaGeneralGlobal = data[0].idMatriculaGeneral;
    //     this.MatriculasService.getRecuperarValidacionesUltimaMatricula(Number(this.idMatriculaGeneralGlobal)).subscribe(data => {
    //       if (data) {
    //         for (let i = 0; i < data.length; i++) {
    //           if (data[i].codigo == "NMDCP") 
    //             this.numMaxCreditosGlobal = Number(data[i].valor);
    //         }
    //       }
    //     });
    //   }
    // });
    for (let i = 0; i < rowsJson.length; i++) {
      let numeroCreditos = this.gridMatricula.getcellvalue(i, 'numeroCreditos')
      cont=cont+ Number(numeroCreditos)
    }
    // alert(cont+' ds'+ this.numMaxCreditosGlobal)
    if (cont<=15) {
      nopasa = true
    }
    return nopasa
  };

  //FUENTE DE DATOS PARA llenar la ventana de anulacion y retiro
  sourceAsignaturasEditadas: any =
    {
      datatype: 'array',
      id: 'idEstudianteAsignatura',
      datafields:
        [
          { name: 'idEstudianteMatricula', type: 'string' },
          { name: 'idEstudianteAsignatura', type: 'string' },
          { name: 'idDetalleEstudianteAsignatura', type: 'string' },
          { name: 'observacion', type: 'string' },
          { name: 'numeroOficio', type: 'string' },
          { name: 'estado', type: 'string' }
        ],
      hierarchy:
      {
        keyDataField: { name: 'idDocenteAsignaturaAprend' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterAsignaturasEditadas: any = new jqx.dataAdapter(this.sourceAsignaturasEditadas);

  recuperarAsignaturasAnuladasRetiradas(idEstudianteOferta: number) {
    this.MatriculasService.getRecuperarAsignaturasAnuladasRetiradas(idEstudianteOferta).subscribe(data => {
      this.sourceAsignaturasEditadas.localdata = data;
      this.dataAdapterAsignaturasEditadas.dataBind();
    });
  }

  //FUENTE DE DATOS PARA llenar la ventana de anulacion y retiro
  sourceNumeroAsignaturas: any =
    {
      datatype: 'array',
      datafields:
        [
          { name: 'idMalla', type: 'string' },
          { name: 'idNivel', type: 'string' },
          { name: 'numMaterias', type: 'string' }
        ],
    };
  dataAdapterNumeroAsignaturas: any = new jqx.dataAdapter(this.sourceNumeroAsignaturas);

  numeroAsignaturasPorNivel() {
    this.MatriculasService.numeroAsignaturasPorNivel(this.idEstudianteOfertaGlobal).subscribe(data => {
      if (data.length > 0)
        this.sourceNumeroAsignaturas.localdata = data;
    });
  }


  cargarDatosVentanaEdicion(idEstudianteAsignatura: any, estado: any): void {
    this.txtObservacionMat.val('')
    this.txtNumeroOficio.val('')
    let estaRetirada: boolean = false
    this.recuperarAsignaturasAnuladasRetiradas(this.idEstudianteOfertaGlobal);
    let dataAdapter = this.dataAdapterAsignaturasEditadas;
    let length = dataAdapter.records.length;
    let observacion: string
    let numeroOficio: string
    for (let i = 0; i < length; i++) {
      let record = dataAdapter.records[i];
      if (record.idEstudianteAsignatura == idEstudianteAsignatura && record.estado == estado) {
        observacion = record.observacion
        numeroOficio = record.numeroOficio
        estaRetirada = true
      }
    }
    this.txtObservacionMat.val(observacion)
    this.txtNumeroOficio.val(numeroOficio)
    if (estaRetirada) {
      this.botonRetirar.disabled(true)
      this.botonActivar.disabled(false)
    } else {
      this.botonRetirar.disabled(false)
      this.botonActivar.disabled(true)
    }
  };

  //FUENTE DE DATOS PARA EL DATAGRID ASIGNATURAS
  sourceAsignaturasHabilitadas: any =
    {
      datatype: 'array',
      id: 'idDocenteAsignaturaAprend',
      datafields:
        [
          { name: 'idDocenteAsignaturaAprend', type: 'string' },
          { name: 'idMallaAsignatura', type: 'string' },
          { name: 'idEstudianteAsignatura', type: 'string' },
          { name: 'nivel', type: 'string' },
          { name: 'nombreAsignatura', type: 'string' },
          { name: 'totalHorasA', type: 'string' },
          { name: 'totalHorasD', type: 'string' },
          { name: 'numVez', type: 'string' },
          { name: 'numeroCreditos', type: 'string' },
          { name: 'idCostoAsignatura', type: 'string' },
          { name: 'valorAsignatura', type: 'number' },
          { name: 'idDocentePractica', type: 'string' },
          { name: 'idEstudianteAsignaturaPrac', type: 'string' },
        ],
      hierarchy:
      {
        keyDataField: { name: 'idDocenteAsignaturaAprend' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterAsignaturasHabilitadas: any = new jqx.dataAdapter(this.sourceAsignaturasHabilitadas);

  generarAsignaturasHabilitadas(idEstudianteOferta: number) {
    this.MatriculasService.getGenerarAsignaturasHabilitadas(idEstudianteOferta, this.idOpcionGlobal).subscribe(data => {
      this.sourceAsignaturasHabilitadas.localdata = data;
      this.dataAdapterAsignaturasHabilitadas.dataBind();
    });
  }


  generarDataSourcePRE(idMallaAsignatura: any): void {
    let registrosPRE = new Array();
    let dataAdapter = this.dataAdapterDocentesAsignaturas;
    let length = dataAdapter.records.length;
    for (let i = 0; i < length; i++) {
      let record = dataAdapter.records[i];
      if (record.idMallaAsig == idMallaAsignatura && Number(record.numEstudiantes) > Number(record.numMatriculados) && record.codigo == 'PRE') {
        // if (record.idMallaAsig == idMallaAsignatura && Number(record.numEstudiantes) > Number(record.numMatriculados) && record.codigo == ) {
        registrosPRE[registrosPRE.length] = record;
      }
    }
    let datasource = {
      datafields: this.dataFieldsTeoria,
      localdata: registrosPRE
    }
    this.adapterComponenteDocencia = new jqx.dataAdapter(datasource);
  };

  generarDataSourceAPR(idMallaAsignatura: any, idDocenteTeoria: any, row: any): void {
    let registrosAPR = new Array();
    let dataAdapter = this.dataAdapterDocentesAsignaturas;
    let length = dataAdapter.records.length;
    let idParalelo: any
    let idDistributivoDocente: any
    for (let i = 0; i < length; i++) {
      let record = dataAdapter.records[i];
      if (record.idDocAsigAprend == idDocenteTeoria) {
        idParalelo = record.idParalelo
        idDistributivoDocente = record.idDistributivoDocente
      }
    }
    let contadorDocentes: number = 0;
    for (let i = 0; i < length; i++) {
      let record = dataAdapter.records[i];
      if (record.idMallaAsig == idMallaAsignatura && Number(record.numEstudiantes) > Number(record.numMatriculados)
        // && record.codigo == 'APR  ' && record.idParalelo == idParalelo) {
        && record.codigo == 'APR' && record.idParalelo == idParalelo && record.idDistributivoDocente != idDistributivoDocente) {
        record.idDocAsigAprendP = record.idDocAsigAprend
        record.nombreDocenteP = record.nombreDocente
        registrosAPR[registrosAPR.length] = record;
        contadorDocentes = contadorDocentes + 1
      }
    }
    let datasource = {
      datafields: this.dataFieldsPractica,
      localdata: registrosAPR
    }
    // this.adapterComponentePractica = new jqx.dataAdapter(datasource);
    this.adapterComponentePractica = new jqx.dataAdapter(datasource);
    let column = this.gridMatricula.getcolumn('idDocAsigAprendP');
    if (contadorDocentes == 0)
      this.gridMatricula.setcellvalue(row, column.displayfield, 'No Aplica')
    else
      this.gridMatricula.setcellvalue(row, column.displayfield, 'Seleccione el otro docente...')
  };

  verificarDocentePractica() {
    let rowsJson = this.gridMatricula.getrows()
    let dataAdapter = this.dataAdapterDocentesAsignaturas;
    let length1 = dataAdapter.records.length;
    let bandera: boolean = false
    let cont: number
    for (let i = 0; i < rowsJson.length; i++) {
      let idMallaAsignatura = this.gridMatricula.getcellvalue(i, 'idMallaAsignatura')
      cont = 0
      for (let j = 0; j < length1; j++) {
        let record = dataAdapter.records[j];
        if (record.idMallaAsig == idMallaAsignatura && record.codigo == 'APR') {
          // if(record.idDistributivoDocente)
          // if (record.idMallaAsig == idMallaAsignatura && record.codigo == 'APR  ') {
          cont = cont + 1
          bandera = true
        }
        if (j == (length1 - 1)) {
          if (cont != 0) {
            let column = this.gridMatricula.getcolumn('idDocAsigAprendP');
            this.gridMatricula.setcellvalue(i, column.displayfield, 'Seleccione un docente...')
          } else {
            let column = this.gridMatricula.getcolumn('idDocAsigAprendP');
            this.gridMatricula.setcellvalue(i, column.displayfield, 'No Aplica')
          }
        }
      }
    }
    if (bandera == true && this.idOpcionGlobal != 3) {
      this.gridMatricula.setcolumnproperty('idDocAsigAprend', 'text', 'Docente-Teoría')
      this.gridMatricula.setcolumnproperty('nombreAsignatura', 'width', '24%')
      this.gridMatricula.setcolumnproperty('idDocAsigAprend', 'width', '21%')
      this.gridMatricula.setcolumnproperty('idDocAsigAprendP', 'hidden', false)
      this.gridMatricula.setcolumnproperty('idDocAsigAprendP', 'width', '21%')
    }
  }

  rowEdit = (row: number, datafield: string, columntype: any, value: any): void | boolean => {
    let columnheader = this.gridMatricula.getcolumn(datafield).text;
    //Deshabilita el combo del otro docente
    if (columnheader == 'Docente-Practica') {
      let dataRecord = this.gridMatricula.getrowdata(row)
      let idMallaAsignatura = dataRecord.idMallaAsignatura
      let column = this.gridMatricula.getcolumn('idDocAsigAprend');
      let idComboDocente = this.gridMatricula.getcellvalue(row, column.datafield);
      if (idComboDocente) {
        this.generarDataSourceAPR(idMallaAsignatura, idComboDocente, row)
        if (this.adapterComponentePractica._source.localdata.length == 0) return false;
        else return true;
      }
    }
    //quitar por si acaso

    let rowsJson = this.gridMatricula.getrows()
    let cont: number
    let dataAdapter = this.dataAdapterDocentesAsignaturas;
    let length1 = dataAdapter.records.length;
    for (let i = 0; i < rowsJson.length; i++) {
      let idDocAsigAprendGRID = this.gridMatricula.getcellvalue(i, 'idDocenteAsignaturaAprend')
      let idMallaAsignatura = this.gridMatricula.getcellvalue(i, 'idMallaAsignatura')
      let nivel = this.gridMatricula.getcellvalue(i, 'nivel')
      let vez = this.gridMatricula.getcellvalue(i, 'numVez')
      // let columnheader = this.myGriDMatricula.getcolumn(datafield).text;
      if (columnheader == 'Docente' || columnheader == 'Docente-Teoría') {
        // if (!idDocAsigAprendGRID &&  this.verificarEsRegular())
        //   if (row == i) return false;
        if (idDocAsigAprendGRID)
          if (row == i) return false;
      } else {
        if (columnheader != 'Check') {
          cont = 0
          for (let j = 0; j < length1; j++) {
            //proceso que bloquea las materias que no tienen un docente en componente Practico, menos el combo docente
            let record = dataAdapter.records[j];
            if (record.idMallaAsig == idMallaAsignatura && record.codigo == 'APR') {
              // if (record.idMallaAsig == idMallaAsignatura && record.codigo == 'APR  ') {
              cont = cont + 1
            }
            if (j == (length1 - 1)) {
              if (cont == 0) {
                if (row == i) return false;
              }
            }
          }
        }
        if (idDocAsigAprendGRID || nivel < this.labelNivelMaximo || vez != '1 VEZ' ||
         (vez == '1 VEZ' && (this.primerSemestreGlobal == 0 || this.verificarEsRegular() || 
         (this.verificarSiNoSobrepasaCreditos() && this.banderaMatriculaNivel))))
          if (row == i) return false;
      }
      //bloquear la grilla cuando no hay cupo
      for (let j = 0; j < this.auxCountDocMallaAsig.length; j++) {
        if (this.auxCountDocMallaAsig[j].idMallaAsignatura == idMallaAsignatura
          && this.auxCountDocMallaAsig[j].cantidadDoc == this.auxCountDocMallaAsig[j].cantidadCup) {
          if (row == i) {
            this.gridMatricula.setcellvalue(row, 'nombreDocente', 'Asignatura sin cupo...')
            this.gridMatricula.setcellvalue(row, 'nombreDocenteP', 'Asignatura sin cupo...')
            return false;
          }
        }
      }
    }
  }

  cellsrenderer = (row: number, column: any, value: any, defaultHtml: string): string => {
    let rowsJson = this.gridMatricula.getrows()
    for (let i = 0; i < rowsJson.length; i++) {
      let idDocAsigAprendGRID = this.gridMatricula.getcellvalue(i, 'idDocenteAsignaturaAprend')
      let idMallaAsignatura = this.gridMatricula.getcellvalue(i, 'idMallaAsignatura')
      if (idDocAsigAprendGRID) {
        if (row == i) {
          let element = defaultHtml.substring(0, 61) + "; color: #999" + defaultHtml.substring(61);
          return element;
        }
      }
      for (let j = 0; j < this.auxCountDocMallaAsig.length; j++) {
        if (this.auxCountDocMallaAsig[j].idMallaAsignatura == idMallaAsignatura
          && this.auxCountDocMallaAsig[j].cantidadDoc == this.auxCountDocMallaAsig[j].cantidadCup) {
          if (row == i) {
            let element = defaultHtml.substring(0, 61) + "; color: #999" + defaultHtml.substring(61);
            return element;
          }
        }
      }
    }
    return defaultHtml;
  }

  marcarAsignaturas(event: any) {
    let argss = event.args;
    let row = event.args.rowindex;
    argss.value;
    let asignaturaNivel = event.args.row.nombreAsignatura;
    let nombreAsignatura = asignaturaNivel.substring(4);
    let columnheader = this.gridMatricula.getcolumn(event.args.datafield).text;
    let creditos = event.args.row.numeroCreditos;
    let horasDocencia = event.args.row.totalHorasD;
    let horasComponente = event.args.row.totalHorasA;
    let nuevaSuma = this.sumaCreditos + Number(creditos)
    let nuevaSumaContactoDocente = this.sumaContactoDocente + Number(horasDocencia)
    let nuevaSumaComponenteAsig = this.sumaComponenteAsig + Number(horasComponente)
    if (columnheader == 'Check') {
      if (argss.value == true) {
        if (nuevaSuma <= this.numMaxCreditosGlobal) {
          if (nuevaSumaContactoDocente <= this.horasMaxSemanaDocenciaGlobal) {
            if (nuevaSumaComponenteAsig <= this.horasMaxSemanaComponentesGlobal) {
              this.gridMatricula.selectrow(row)
            } else {
              this.gridMatricula.setcellvalue(row, 'valorCheck', false)
              this.myModal.alertMessage({
                title: 'Matriculación Estudiantil',
                msg: 'Al selecionar la asignatura ' + nombreAsignatura + ' ha superado el máximo de ' + this.horasMaxSemanaDocenciaGlobal +
                  ' horas de  contacto con el docente!'
              });
            }
          } else {
            this.gridMatricula.setcellvalue(row, 'valorCheck', false)
            this.myModal.alertMessage({
              title: 'Matriculación Estudiantil',
              msg: 'Al selecionar la asignatura ' + nombreAsignatura + 'ha superado el máximo de ' +
               this.horasMaxSemanaDocenciaGlobal + ' horas de  contacto con el docente!'
            });
          }
        } else {
          this.gridMatricula.setcellvalue(row, 'valorCheck', false)
          this.myModal.alertMessage({
            title: 'Matriculación Estudiantil',
            msg: 'Al selecionar la asignatura ' + nombreAsignatura + ' sobrepasa los ' + this.numMaxCreditosGlobal + ' créditos permitidos, '
              + 'si desea agregarla desmarque una de las anteriores!'
          });
        }
      } else {
        this.gridMatricula.unselectrow(row)
      }
    }
  }


  columnasMatriculacion: any[] =
    [
      {
        text: 'Check', datafield: 'valorCheck', columntype: 'checkbox', width: '4%',
        cellbeginedit: this.rowEdit
      },
      {
        text: 'IdDocAsig', columntype: 'textbox', datafield: 'idDocenteAsignaturaAprend', width: '7%', editable: false, hidden: true,
        cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer
      },
      {
        text: 'IdDocPrac', columntype: 'textbox', datafield: 'idDocentePractica', width: '7%', editable: false, hidden: true,
        cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer
      },
      {
        text: 'IdEstAsig', columntype: 'textbox', datafield: 'idEstudianteAsignatura', width: '7%', editable: false, hidden: true,
        cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer
      },
      {
        text: 'IdEstAsigPrac', columntype: 'textbox', datafield: 'idEstudianteAsignaturaPrac', width: '7%', editable: false, hidden: true,
        cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer
      },
      {
        text: 'id Malla Asig', columntype: 'textbox', datafield: 'idMallaAsignatura', width: '5%', hidden: true,
        cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer
      },
      {
        text: 'Nivel', datafield: 'nivel', width: '6%', editable: false, hidden: true,
        cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer, cellsformat: 'n2', aggregates: ['max'],
        aggregatesrenderer: (aggregates: any): string => {
          let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + '" style="float: left; width: 100%; height: 100%;">';
          for (let obj in aggregates) {
            let value = aggregates[obj];
            this.labelNivelMaximo = value
          }
          renderstring += '</div>';
          return renderstring;
        }
      },
      {
        text: 'Nivel - Asignatura', columntype: 'textbox', datafield: 'nombreAsignatura', width: '30%', editable: false,
        cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer
      },
      {
        text: 'Vez', columntype: 'textbox', datafield: 'numVez', width: '8%', cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer,
        editable: false, cellsalign: 'right', align: 'center'
      },
      {
        text: 'Créditos', columntype: 'textbox', datafield: 'numeroCreditos', width: '5%', cellbeginedit: this.rowEdit,
        cellsrenderer: this.cellsrenderer, editable: false, cellsalign: 'right', align: 'center'
      },
      {
        text: 'ACD', columntype: 'textbox', datafield: 'totalHorasD', width: '5%', cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer,
        editable: false, cellsalign: 'right', align: 'center'
      },
      {
        text: 'HTC', columntype: 'textbox', datafield: 'totalHorasA', width: '5%', cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer,
        editable: false, cellsalign: 'right', align: 'center'
      },
      {
        text: 'id Costo Asignatura', columntype: 'textbox', datafield: 'idCostoAsignatura', width: '5%', hidden: true,
        cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer
      },
      {
        text: 'Costo', columntype: 'numberinput', datafield: 'valorAsignatura', cellsalign: 'right', cellsformat: 'c2', width: '7%',
        editable: false, cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer,
        createeditor: (row: number, cellvalue: any, editor: any): void => {
          editor.jqxNumberInput({ decimalDigits: 2, digits: 3 });
        }
      },
      {
        text: 'Docente', width: '36%', datafield: 'idDocAsigAprend', displayfield: 'nombreDocente', columntype: 'dropdownlist',
        cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer, editable: true,
        initeditor: (row: number, value: any, editor: any): void => {
          this.editrow = row;
          let dataRecord = this.gridMatricula.getrowdata(this.editrow)
          let idMallaAsignatura = dataRecord.idMallaAsignatura
          this.generarDataSourcePRE(idMallaAsignatura)
          editor.jqxDropDownList({
            autoOpen: true, autoDropDownHeight: true, source: this.adapterComponenteDocencia, displayMember: 'nombreDocente',
            valueMember: 'idDocAsigAprend', animationType: 'slide', enableHover: true
          });
        },
        cellvaluechanging: (row: number, datafield: string, columntype: any, oldvalue: any, newvalue: any): void => {
          if (newvalue != oldvalue) {
            let column = this.gridMatricula.getcolumn('idDocAsigAprendP');
            let comboDocentePractica = this.gridMatricula.getcellvalue(row, column.displayfield);
            if (comboDocentePractica != 'No Aplica') {
              this.gridMatricula.setcellvalue(row, 'nombreDocenteP', 'Seleccione el otro docente...');
              this.gridMatricula.setcellvalue(row, column.datafield, '')
            }
          };
        }
      },
      {
        text: 'Docente-Practica', width: '18%', datafield: 'idDocAsigAprendP', displayfield: 'nombreDocenteP', columntype: 'dropdownlist',
        cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer, editable: true, hidden: true,
        initeditor: (row: number, value: any, editor: any): void => {
          editor.jqxDropDownList({
            autoOpen: true, autoDropDownHeight: true, source: this.adapterComponentePractica, displayMember: 'nombreDocente',
            valueMember: 'idDocAsigAprend', animationType: 'slide', enableHover: true
          });
        },
      },
      {
        text: 'Retirar', datafield: 'R', columntype: 'button', width: '6%',
        buttonclick: (row: number): void => {
          this.editrow = row;
          this.opcionEdicion = 1
          let idEstudianteAsignatura = this.gridMatricula.getcellvalue(this.editrow, 'idEstudianteAsignatura')
          let bandera = this.bloquearBotones(idEstudianteAsignatura)
          if (bandera == 3 || bandera == 1) {
            this.myWindow.position({ x: 1090, y: 460 });
            this.myWindow.title('Retiro de Asignatura')
            this.myWindow.bringToFront()
            this.myWindow.open();
            this.cargarDatosVentanaEdicion(idEstudianteAsignatura, 'R')
          } else {
            this.myModal.alertMessage({
              title: 'Matriculación Estudiantil',
              msg: 'La asignatura se encuentra Anulada!'
            });
          }
        },
        cellsrenderer: (): String => {
          return 'Retirar';
        }
      },

    ];

  bloquearBotones = (idEstudianteAsignatura: any): number => {
    this.recuperarEstudianteMatricula();
    let dataAdapter = this.pojoEstudianteMatricula.estudianteAsignaturas;
    for (let i = 0; i < dataAdapter.length; i++) {
      let idEstudianteAsig = dataAdapter[i].id;
      let estado = dataAdapter[i].estado;
      if (idEstudianteAsig == idEstudianteAsignatura && estado == 'R') {
        return 1;
      } else if (idEstudianteAsig == idEstudianteAsignatura && estado == 'X') {
        return 2
      } else if (idEstudianteAsig == idEstudianteAsignatura && estado == 'A') {
        return 3
      }
    }
  };

  btnRetirar(): void {
    let idEstudianteAsignatura = this.gridMatricula.getcellvalue(this.editrow, 'idEstudianteAsignatura')
    let idEstudianteAsignaturaPrac = this.gridMatricula.getcellvalue(this.editrow, 'idEstudianteAsignaturaPrac')
    if (this.editrow >= 0) {
      if (this.txtObservacionMat.val().length > 4 && this.txtNumeroOficio.val().length > 4) {
        this.myModal.alertQuestion({
          title: 'Matriculación Estudiantil',
          msg: 'Confirmar proceso de ' + this.myWindow.title(),
          result: (k) => {
            if (k) {
              this.jsonGrabarModificacion(idEstudianteAsignatura, idEstudianteAsignaturaPrac, 'R');
              this.jsonGrabarRetiroAsignatura(idEstudianteAsignatura, idEstudianteAsignaturaPrac, 'R')
              this.myWindow.hide();
              this.myWindow.close()
              this.gridMatricula.refreshdata()
            }
          }
        })
      } else {
        this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Verifique que todos los campos estén ingresados correctamente, los campos deben tener al menos 5 caracteres!' });
      }
    }
  }

  btnActivar(): void {
    let idEstudianteAsignatura = this.gridMatricula.getcellvalue(this.editrow, 'idEstudianteAsignatura')
    let idEstudianteAsignaturaPrac = this.gridMatricula.getcellvalue(this.editrow, 'idEstudianteAsignaturaPrac')
    if (this.editrow >= 0) {
      if (this.txtObservacionMat.val().length > 4 && this.txtNumeroOficio.val().length > 4) {
        this.myModal.alertQuestion({
          title: 'Matriculación Estudiantil',
          msg: '¿Desea Reactivar esta asignatura?',
          result: (k) => {
            if (k) {
              this.jsonGrabarModificacion(idEstudianteAsignatura, idEstudianteAsignaturaPrac, 'A');
              this.jsonGrabarRetiroAsignatura(idEstudianteAsignatura, idEstudianteAsignaturaPrac, 'A')
              this.myWindow.hide();
              this.myWindow.close()
              this.gridMatricula.refreshdata()
            }
          }
        })
      } else {
        this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Verifique que todos los campos estén ingresados correctamente, los campos deben tener al menos 5 caracteres!' });
      }
    }
  }
  cancelBtn(): void {
    this.myWindow.hide();
  }


  verComprobanteMatricula(idEstudianteMatricula: number, idEstudianteOferta: number) {
    this.ocultarReporte();
    this.MatriculasService.getComprobanteMatriculaAnteriores(idEstudianteMatricula, idEstudianteOferta
    ).subscribe((blob: Blob) => {
      // Para navegadores de Microsoft.
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob);
      }
      let filename = "";
      filename = this.nombreArchivo();
      const objectUrl = window.URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = objectUrl;
      this.pdfSrc = "";
      this.pdfSrc = enlace.href;
    });
  }

  anularMatricula() {
    let idEstudianteMatricula = this.pojoEstudianteMatricula.id
    let mensaje: string
    if (this.pojoEstudianteMatricula.estado == 'A')
      mensaje = 'anular'
    else
      mensaje = 'reactivar'
    if (idEstudianteMatricula && idEstudianteMatricula != null) {
      this.myModal.alertQuestion({
        title: 'Matriculación Estudiantil',
        msg: '¿Desea ' + mensaje + ' esta matrícula?',
        result: (k) => {
          if (k) {
            if (this.pojoEstudianteMatricula.estado == 'A') {
              this.anularMatriculaEstudiante(idEstudianteMatricula, 'X')
              // this.jsonGrabarModificacion(idEstudianteAsignatura, idEstudianteAsignaturaPrac,'A');
              // this.jsonGrabarRetiroAsignatura(idEstudianteAsignatura, idEstudianteAsignaturaPrac,'A')
              this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Matrícula Anulada correctamente!' });
              this.botonAnular.value('Deshacer Anulación')
              this.botonAnular.template('inverse')
            } else {
              this.anularMatriculaEstudiante(idEstudianteMatricula, 'A')
              this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Matrícula Activada correctamente!' });
              this.botonAnular.value('Anular Matrícula')
              this.botonAnular.template('primary')
            }

          }
        }
      })
    }
  }

  anularMatriculaEstudiante(idEstudianteMatricula: number, estado: string) {
    this.MatriculasService.anularMatricula(idEstudianteMatricula, estado).subscribe(result => {
      this.recuperarAsignaturasAnuladasRetiradas(this.idEstudianteOfertaGlobal);
      this.recuperarEstudianteMatricula()
    }, error => console.error(error));
  }

  nombreArchivo(): string {
    let filename = "";
    var fecha = new Date();
    filename = fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getDate() + "_"
      + fecha.getMonth() + "_"
      + fecha.getFullYear()
    return filename;
  }
  controlIsCollapsed() {
    this.botonVolver.disabled(true);
    this.myPdfViewer.showPrintButton = true;
    this.isCollapsed = !this.isCollapsed;
    this.pdfSrc = "";
    this.ocultarPdfViewer = !this.ocultarPdfViewer
    this.gotoList()
  }


  ocultarReporte() {
    this.isCollapsed = !this.isCollapsed;
    this.ocultarPdfViewer = !this.ocultarPdfViewer
    this.botonVolver.disabled(false);
  }

}
