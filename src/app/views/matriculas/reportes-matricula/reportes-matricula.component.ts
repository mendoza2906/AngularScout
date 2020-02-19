import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { Router, ActivatedRoute } from '@angular/router';
// import { ReportService } from '../../../services/report/report.service';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';


@Component({
  selector: 'app-reportes-matricula',
  templateUrl: './reportes-matricula.component.html',
  styleUrls: ['./reportes-matricula.component.scss']
})
export class ReportesMatriculaComponent implements OnInit {
  @ViewChild('comboPeriodoDesde') comboPeriodoDesde: jqxComboBoxComponent;
  @ViewChild('comboPeriodoActual') comboPeriodoActual: jqxComboBoxComponent;
  @ViewChild('comboPeriodo') comboPeriodo: jqxComboBoxComponent;
  @ViewChild('comboFormato') comboFormato: jqxComboBoxComponent;
  @ViewChild('gridFacultadCarrera') gridFacultadCarrera: jqxGridComponent;
  @ViewChild('gridAsignatura') gridAsignatura: jqxGridComponent;
  @ViewChild('gridReportes') gridReportes: jqxGridComponent;
  @ViewChild('Events') Events: ElementRef;
  @ViewChild('CheckedItems') CheckedItems: ElementRef;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('botonRegresar') botonRegresar: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;

  idFacultad: string;
  facultad = "";
  idCarrera = 0;
  editrow: number = -1;
  pdfSrc: string = '';
  isCollapsed: boolean = false;
  ocultarPdfViewer: boolean = true;
  ocultarGrids: boolean = true;
  ocultarCombos: boolean = true;
  ocultarAsignaturas: boolean = true;
  hideRepPermancia: boolean = false;
  hideRepMatOferta: boolean = false;
  ocultarGridReportes: boolean = false;
  tamanioColumna: string = '58%'
  tamanioGridFacultad: string = 'col-md-6';
  nombreReporte: string;
  periodo: Array<any>;

  facultades: Array<any>;
  carrera: Array<any>;
  adapterMostrarParalelos: any;
  hideRepCortes: boolean = false;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private matriculacionService: MatriculasService) {
  }

  ngOnInit() {
    this.ocultarGridReportes = false
    // this.cargarComboPeriodo();
    this.ListarReportes()
    this.ListarFacultades()

  }

  ngAfterViewInit(): void {
    //  this.regresarGrillaReportes()
  }

  // cargarComboPeriodo() {
  //   this.reporteServicio.listarPeriodo().subscribe(data => {
  //     this.periodo = data;
  //     this.sourceComboPeriodos.localdata = data;
  //     this.dataAdapterComboPeriodos.dataBind();
  //   })
  // }

  //FUENTE DE DATOS PARA EL COMBOBOX DE PERIODO
  sourceComboPeriodos: any = {
    datatype: 'json',
    id: 'id',
    localdata: [
      { name: 'estado', type: 'string' },
      { name: 'descripcion', type: 'string' },
      { name: 'id', type: 'int' }
    ],
  };
  //CARGAR ORIGEN DEL COMBOBOX DE PERIODO
  dataAdapterComboPeriodos: any = new jqx.dataAdapter(this.sourceComboPeriodos);


  nombreArchivo(): string {
    let filename = "";
    var fecha = new Date();
    filename = fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getDate() + "_" + fecha.getMonth() + "_" + fecha.getFullYear()
    return filename;
  }

  //FUENTE DE DATOS PARA CARGAR LA GRILLA DE LAS FACULTADES
  sourceFacultad: any = {
    datatype: 'json',
    id: 'idDepartamento',
    localdata: [
      { name: 'idDepartamento', type: 'int' },
      { name: 'departamento', type: 'string' },
    ],
  };
  dataAdapterListaFacultad: any = new jqx.dataAdapter(this.sourceFacultad);

  //Listas de todas las Facultades
  recuperarFacultades() {
    this.matriculacionService.listarDepartamento().subscribe((data: any) => {
      this.sourceFacultad.localdata = data;
      this.dataAdapterListaFacultad.dataBind();
      if (data.length < 1) {
      } else {
        // this.gridFacultadCarrera.disabled(false);
      }
    });
  }

  mostrarGridFacultades() {
    let cboIdPeriodo = this.comboPeriodo.val();
    if (!cboIdPeriodo) {
      return;
    } else {
      this.ocultarGrids = false
      // this.gridFacultadCarrera.disabled(false)
      this.recuperarFacultades();
      // this.listarCarreras()
    }
  }


  ListarFacultades() {
    this.recuperarFacultades();
    this.listarCarreras()
    this.ocultarGrids = false
    //}
  }

  ListarReportes() {
    this.dataAdapterListaReporte.dataBind();
  }

  source = [{ "codigo": "pdf", "label": 'PDF' }, { "codigo": "xlsx", "label": 'EXCEL' }];

  sourceReportes = [{ "reporte": "Estudiantes Matrículados por Facultades", "codigo": 'UPSE' },
  { "reporte": "Estudiantes Matrículados por Facultad", "codigo": 'FACU' }, { "reporte": "Estudiantes Matrículados por Carrera", "codigo": 'CARR' },
  { "reporte": "Estudiantes Matrículados por Asignaturas y Paralelo", "codigo": 'ASIG' }, { "reporte": "Taza de Permanencia", "codigo": 'TPER' },
  { "reporte": "Cortes de Estudiantes", "codigo": 'CORE' }];

  dataAdapterListaReporte: any = new jqx.dataAdapter(this.sourceReportes);

  columnsReportes: any[] = [
    { text: 'Código', datafield: 'codigo', width: '10%', hidden: true },
    { text: 'Reportes', datafield: 'reporte', width: '85%' },
    {
      text: 'Reporte', datafield: 'rep', columnType: 'button', width: '15%', filtertype: 'none', cellsrenderer: (): String => {
        return 'Generar';
      },
      buttonclick: (row: number): void => {
        let codigo = this.gridReportes.getcellvalue(row, 'codigo')
        let nombreReporte = this.gridReportes.getcellvalue(row, 'reporte')
        this.generarReporte(codigo, nombreReporte)
      }
    },
  ];

  regresarGrillaReportes() {
    console.log("ingreso")
    this.ocultarGridReportes = false
    this.ocultarGrids = true
    this.comboPeriodo.disabled(false)
    this.gridAsignatura.clearselection()
    this.gridFacultadCarrera.clearselection()
  }

  generarReporte(codigo: string, nombreReporte: string) {
    // let codigo = event.args.row.codigo;
    this.nombreReporte = nombreReporte
    // if (this.ocultarGrids == false) {
    if (!this.comboPeriodo.val() || this.comboPeriodo.val() == 'prueba') {
      this.myModal.alertMessage({ title: 'Reportes', msg: 'Selecione un Periodo Académico!' });
      this.gridReportes.clearselection();
      return
    }
    this.comboPeriodo.disabled(true)
    if (codigo == 'UPSE') {
      this.myModal.alertQuestion({
        title: 'Reportes',
        msg: 'Desea generar este Reporte?',
        result: (k) => {
          if (k)
            this.reportTotalMatriculadosFacultades(this.comboPeriodo.val());
          this.ocultarCombos = true
          this.ocultarAsignaturas = true
          this.ocultarGrids = true
          this.ocultarGridReportes = true
        }
      })
    } else if (codigo == 'FACU') {
      this.mostrarGridFacultades()
      this.hideRepPermancia = true
      this.hideRepMatOferta = true
      this.hideRepCortes = true
      this.tamanioColumna = '100%'
      this.ocultarCombos = true
      this.ocultarAsignaturas = true
      this.ocultarPdfViewer = true
      this.ocultarGridReportes = true
      this.gridFacultadCarrera.showcolumn('rep')
      this.gridFacultadCarrera.setcolumnproperty('departamento', 'width', '75%')
      this.gridFacultadCarrera.rowdetails(false)
    } else if (codigo == 'CARR') {
      this.mostrarGridFacultades()
      this.gridFacultadCarrera.hidecolumn('rep')
      this.gridFacultadCarrera.setcolumnproperty('departamento', 'width', '100%')
      this.gridFacultadCarrera.rowdetails(true)
      this.gridFacultadCarrera.showrowdetails(0)
      this.hideRepPermancia = true
      this.hideRepCortes = true
      this.hideRepMatOferta = false
      this.tamanioColumna = '78%'
      this.ocultarCombos = true
      this.ocultarAsignaturas = true
      this.ocultarGridReportes = true
      this.ocultarPdfViewer = true
      this.tamanioGridFacultad = 'col-md-12'
    } else if (codigo == 'ASIG') {
      this.ocultarCombos = true
      this.ocultarAsignaturas = false
      this.mostrarGridFacultades()
      this.gridFacultadCarrera.hidecolumn('rep')
      this.gridFacultadCarrera.setcolumnproperty('departamento', 'width', '100%')
      this.gridFacultadCarrera.rowdetails(true)
      this.tamanioColumna = '100%'
      this.hideRepPermancia = true
      this.hideRepCortes = true
      this.hideRepMatOferta = true
      this.ocultarPdfViewer = true
      this.ocultarGridReportes = true
      this.tamanioGridFacultad = 'col-md-6'
    } else if (codigo == 'TPER') {
      this.mostrarGridFacultades()
      this.gridFacultadCarrera.hidecolumn('rep')
      this.gridFacultadCarrera.setcolumnproperty('departamento', 'width', '100%')
      this.gridFacultadCarrera.rowdetails(true)
      this.hideRepPermancia = false
      this.hideRepMatOferta = true
      this.tamanioColumna = '78%'
      this.ocultarCombos = false
      this.ocultarAsignaturas = true
      this.ocultarGridReportes = true
      this.ocultarPdfViewer = true
      this.tamanioGridFacultad = 'col-md-12'
    } else if (codigo == 'CORE') {
      this.mostrarGridFacultades()
      this.gridFacultadCarrera.hidecolumn('rep')
      this.gridFacultadCarrera.setcolumnproperty('departamento', 'width', '100%')
      this.gridFacultadCarrera.rowdetails(true)
      this.hideRepPermancia = true
      this.hideRepMatOferta = true
      this.hideRepCortes = false
      this.tamanioColumna = '78%'
      this.ocultarCombos = false
      this.ocultarAsignaturas = true
      this.ocultarGridReportes = true
      this.ocultarPdfViewer = true
      this.tamanioGridFacultad = 'col-md-12'
    }
    // }

  }

  //FUENTE DE DATOS PARA EL COMBOBOX DE OFERTA
  camposCarrera: any[] = [
    { name: 'idDepartamento', type: 'int' },
    { name: 'idCarrera', type: 'int' },
    { name: 'carrera', type: 'string' },
  ];

  //FUENTE DE DATOS PARA EL GRID DE OFERTA
  sourceCarrera: any = {
    id: 'idDepartamento',
    datafields: this.camposCarrera,
    localData: [],

  };


  //Listas de todas las Facultades
  listarCarreras() {
    this.matriculacionService.getCargarTodasCarreras().subscribe((data: any) => {
      this.sourceCarrera.localdata = data;
      this.dataAdapterCarrera.dataBind();
    });
  }

  //CARGAR ORIGEN DEL  GRID DE OFERTA
  dataAdapterCarrera: any = new jqx.dataAdapter(this.sourceCarrera, { autoBind: true });
  nestedGrids: any[] = new Array();


  rowdetailstemplate: any = {
    rowdetails: '<div  id="nestedGrid" style="margin: 10px;"></div>', rowdetailshidden: true, autorowheight: true, filterable: true
  };

  // create nested grid.
  initRowDetails = (index: number, parentElement: any, gridElement: any, record: any): void => {
    let id = record.uid.toString();
    let nestedGridContainer = parentElement.children[0];
    this.nestedGrids[index] = nestedGridContainer;
    let filtergroup = new jqx.filter();
    let filter_or_operator = 1;
    let filtervalue = id;
    let filtercondition = 'equal';
    let filter = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);
    // fill the orders depending on the id.
    let orders = this.dataAdapterCarrera.records;
    let ordersbyid = [];

    for (let i = 0; i < orders.length; i++) {
      let result = filter.evaluate(orders[i]['idDepartamento']);
      if (result) {
        ordersbyid.push(orders[i]);
      }
    }
    let sourceCarrera = {
      datafields: [
        { name: 'idDepartamento', type: 'int' },
        { name: 'idCarrera', type: 'int' },
        { name: 'carrera', type: 'string' },
      ],
      id: 'idDepartamento',
      localdata: ordersbyid
    }
    let nestedGridAdapter = new jqx.dataAdapter(sourceCarrera);
    if (nestedGridContainer != null) {
      let settings = {
        width: '97%',
        autoheight: "true",
        theme: "darkblue",
        source: nestedGridAdapter,
        columns: [
          { text: 'Id Facultad', datafield: 'idDepartamento', width: '20%', hidden: true },
          { text: 'id oferta', datafield: 'idCarrera', width: '20%', hidden: true },
          { text: 'Carrera', datafield: 'carrera', width: this.tamanioColumna },
          {
            text: 'Reporte', datafield: 'repPer', columntype: 'button', width: '20%', hidden: this.hideRepPermancia,
            cellsrenderer: (): string => { return 'Generar Reporte'; },
            buttonclick: (row: number): void => {
              //get the data and append in to the inputs
              this.editrow = row;
              let cboPeriodoAnterior = this.comboPeriodoDesde.val();
              let cboPeriodoActual = this.comboPeriodoActual.val();
              let idCarrera = ordersbyid[this.editrow].idCarrera;
              if (this.comboPeriodoDesde.val() && this.comboPeriodoActual.val()) {
                this.comboPeriodoDesde.disabled(true)
                this.comboPeriodoActual.disabled(true)
                this.botonRegresar.disabled(true)
                this.generarTazaRetencion(cboPeriodoAnterior, cboPeriodoActual, idCarrera);
              } else if (!this.comboPeriodoDesde.val()) {
                this.myModal.alertMessage({ title: 'Reportes', msg: 'Seleccione un periodo académico inicial' });
                this.comboPeriodoDesde.focus()
                return
              } else if (!this.comboPeriodoActual.val()) {
                this.myModal.alertMessage({ title: 'Reportes', msg: 'Seleccione el  periodo académico final' });
                this.comboPeriodoActual.focus()
                return
              }
            }
          },
          {
            text: 'Reporte', datafield: 'repCor', columntype: 'button', width: '20%', hidden: this.hideRepCortes,
            cellsrenderer: (): string => { return 'Generar Reporte'; },
            buttonclick: (row: number): void => {
              //get the data and append in to the inputs
              this.editrow = row;
              let cboPeriodoAnterior = this.comboPeriodoDesde.val();
              let cboPeriodoActual = this.comboPeriodoActual.val();
              let idCarrera = ordersbyid[this.editrow].idCarrera;
              if (this.comboPeriodoDesde.val() && this.comboPeriodoActual.val()) {
                this.comboPeriodoDesde.disabled(true)
                this.comboPeriodoActual.disabled(true)
                this.botonRegresar.disabled(true)
                this.generarCorteEstudiantes(cboPeriodoAnterior, cboPeriodoActual, idCarrera);
              } else if (!this.comboPeriodoDesde.val()) {
                this.myModal.alertMessage({ title: 'Reportes', msg: 'Seleccione un periodo académico inicial' });
                this.comboPeriodoDesde.focus()
                return
              } else if (!this.comboPeriodoActual.val()) {
                this.myModal.alertMessage({ title: 'Reportes', msg: 'Seleccione el  periodo académico final' });
                this.comboPeriodoActual.focus()
                return
              }
            }
          },
          {
            text: 'Reporte', datafield: 'repMat', columntype: 'button', width: '20%', hidden: this.hideRepMatOferta,
            cellsrenderer: (): string => { return 'Generar Reporte'; },
            buttonclick: (row: number): void => {
              //get the data and append in to the inputs
              this.editrow = row;
              let cboPeriodo = this.comboPeriodo.val();
              let idCarrera = ordersbyid[this.editrow].idCarrera;
              this.reportCantidadMatriculadosOferta(cboPeriodo, idCarrera);
            }
          },
        ]
      };
      jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
      let nestedGridInstance = jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
      this.createEvents(nestedGridInstance, index);
    }
  }
  ready = (): void => {
    //this.gridAsignatura.showrowdetails(0);

  };

  //FUENTE DE DATOS PARA EL DATAGRID ASIGNATURAS
  sourceAsignaturas: any =
    {
      datatype: 'array',
      id: 'idMallaAsignatura',
      datafields:
        [
          { name: 'idMallaAsignatura', type: 'string' },
          { name: 'idAsignatura', type: 'string' },
          { name: 'asignatura', type: 'string' },
          { name: 'asignaturaCorta', type: 'string' },
        ],
      hierarchy:
      {
        keyDataField: { name: 'idMallaAsignatura' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterAsignaturas: any = new jqx.dataAdapter(this.sourceAsignaturas);

  listaOfertaAsignatura(idPeriodoAcademico: number, idOferta: number) {
    this.matriculacionService.getListaOfertaAsignatura(idPeriodoAcademico, idOferta).subscribe(data => {
      this.sourceAsignaturas.localdata = data;
      this.dataAdapterAsignaturas.dataBind();
      this.setearAsignaturas()
    });

  }

  //FUENTE DE DATOS PARA EL COMBOBOX DE PARALELOS
  dataFieldsParalelos: any[] = [
    { name: 'idMallaAsignatura', type: 'string' },
    { name: 'paralelo', type: 'string' },
    { name: 'idParalelo', type: 'string' },
  ];
  sourceParalelos: any = {
    id: 'idMallaAsignatura',
    datafields: this.dataFieldsParalelos,
    localData: [],

  };

  dataAdaptersParalelos: any = new jqx.dataAdapter(this.sourceParalelos);

  listaAsignaturaParalelo(idPeriodoAcademico: number, idOferta: number) {
    this.matriculacionService.getListaAsignaturaParalelo(idPeriodoAcademico, idOferta).subscribe(data => {
      this.sourceParalelos.localdata = data;
      this.dataAdaptersParalelos.dataBind();
    });
  }

  generarNuevoParalelo(idMallaAsignatura: any): void {
    let registrosParalelelo = new Array();
    let dataAdapter = this.dataAdaptersParalelos;
    let length = dataAdapter.records.length;
    for (let i = 0; i < length; i++) {
      let record = dataAdapter.records[i];
      if (record.idMallaAsignatura == idMallaAsignatura) {
        registrosParalelelo[registrosParalelelo.length] = record;
      }
    }
    let datasource = {
      datafields: this.dataFieldsParalelos,
      localdata: registrosParalelelo
    }
    this.adapterMostrarParalelos = new jqx.dataAdapter(datasource);
  };


  renderer = (row: number, column: any, value: string): string => {
    return '<span style="margin-left: 4px; margin-top: 9px; float: left;">' + value + '</span>';
  }

  columnsFacultades: any[] = [
    { text: 'id', datafield: 'idDepartamento', width: '5%', hidden: true },
    { text: 'Facultad', datafield: 'departamento', rowdetailsheight: true, width: '75%' },
    {
      text: 'Visualizar', datafield: 'rep', columnType: 'button', width: '25%', filtertype: 'none', cellsrenderer: (): String => {
        return 'Generar Reporte';
      },
      buttonclick: (row: number): void => {
        this.editrow = row;
        let cboPeriodo = this.comboPeriodo.val();
        let dataRecord = this.gridFacultadCarrera.getrowdata(this.editrow);

        this.reportTotalMatriculadosOferta(cboPeriodo, dataRecord.idDepartamento);
      }
    },
  ];

  columnsAsignatura: any[] = [
    { text: 'idMallaAsignatura', datafield: 'idMallaAsignatura', width: '5%', hidden: true, editable: false, },
    { text: 'Id Asignatura', datafield: 'idAsignatura', width: '10%', hidden: true, editable: false },
    { text: 'Asignatura', datafield: 'asignatura', rowdetailsheight: true, width: '50%', editable: false },
    {
      text: 'Paralelo', width: '25%', datafield: 'idParalelo', displayfield: 'paralelo', columntype: 'dropdownlist', editable: true,
      filtertype: 'none', initeditor: (row: number, value: any, editor: any): void => {
        let dataRecord = this.gridAsignatura.getrowdata(row)
        let idMallaAsignatura = dataRecord.idMallaAsignatura
        this.generarNuevoParalelo(idMallaAsignatura)
        editor.jqxDropDownList({
          // autoOpen: true, 
          autoDropDownHeight: true, source: this.adapterMostrarParalelos, displayMember: 'paralelo',
          valueMember: 'idParalelo', animationType: 'slide', enableHover: true
        });
      }
    },
    {
      text: 'Visualizar', datafield: 'rep', columnType: 'button', width: '25%', filtertype: 'none', cellsrenderer: (): String => {
        return 'Descargar Reporte';
      },
      buttonclick: (row: number): void => {
        this.editrow = row;
        let cboPeriodo = this.comboPeriodo.val();
        let dataRecord = this.gridAsignatura.getrowdata(this.editrow);
        let column = this.gridAsignatura.getcolumn('idParalelo');
        let comboParalelo = this.gridAsignatura.getcellvalue(this.editrow, column.datafield);
        // if (this.comboFormato)
        if (comboParalelo)
          // this.reportEstudiantesMatriculadosAsignatura(dataRecord.idMallaAsignatura, cboPeriodo, comboParalelo,this.comboFormato.val())
          this.reportEstudiantesMatriculadosAsignatura(dataRecord.idMallaAsignatura, cboPeriodo, comboParalelo)
        else
          this.myModal.alertMessage({ title: 'Reportes', msg: 'Seleccione un paralelo' });
        // else
        //     this.myModal.alertMessage({ title: 'Reportes', msg: 'Elija un formato de descarga!' });
      }
    },
  ];


  setearAsignaturas() {
    let rowsJson = this.gridAsignatura.getrows()
    for (let i = 0; i < rowsJson.length; i++) {
      let columnDoc = this.gridAsignatura.getcolumn('idParalelo');
      this.gridAsignatura.setcellvalue(i, columnDoc.displayfield, 'Seleccione un paralelo..')
    }
  }


  localization: any = getLocalization('es');
  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }
    return 850;
  }

  createEvents(nestedGrid: any, indice: any) {
    //creacion del evento cellvaluechanged para el nestedgrid
    nestedGrid.addEventHandler('rowselect', (event: any): void => {
      if (event) {
        let indiceFila = event.args.rowindex;
        let getdataRows = nestedGrid.getrowdata(indiceFila);
        let idCarrera = getdataRows.idCarrera;
        let idPeriodo = this.comboPeriodo.val()
        this.gridAsignatura.clearselection();
        this.gridAsignatura.disabled(false);
        this.listaOfertaAsignatura(idPeriodo, idCarrera)
        this.listaAsignaturaParalelo(idPeriodo, idCarrera)
        // this.setearAsignaturas()
      }
    });
  }


  generarTazaRetencion(idPeriodoAnterior: number, idPeriodoActual: number, idOferta: number) {
    this.ocultarReporte();
    this.matriculacionService.getReportTasaPermanenciaEst(idPeriodoAnterior, idPeriodoActual, idOferta).subscribe((blob: Blob) => {
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



  generarCorteEstudiantes(idPeriodoAnterior: number, idPeriodoActual: number, idOferta: number) {
    this.ocultarReporte();
    this.matriculacionService.getReportCorteEstudiantes(idPeriodoAnterior, idPeriodoActual, idOferta).subscribe((blob: Blob) => {
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

  reportTotalMatriculadosOferta(filterIdPeriodo: number, filterIdDepartamento: number) {
    this.ocultarReporte();
    this.matriculacionService.getReportTotalMatriculadosOferta(filterIdPeriodo, filterIdDepartamento).subscribe((blob: Blob) => {
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

  reportCantidadMatriculadosOferta(filterIdPeriodo: number, filterIdOferta: number) {
    this.ocultarReporte();
    this.matriculacionService.getReportCantidadMatriculadosOferta(filterIdPeriodo, filterIdOferta).subscribe((blob: Blob) => {
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

  // reportEstudiantesMatriculadosAsignatura(idMallaAsignatura: number, idPeriodoAcademico: number, idParalelo: number, formato: string) {

  //   this.matriculacionService.getReportEstudiantesMatriculadosAsignatura(idMallaAsignatura, idPeriodoAcademico, idParalelo, formato).subscribe((blob: Blob) => {
  //     // Para navegadores de Microsoft.
  //     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
  //       window.navigator.msSaveOrOpenBlob(blob);
  //     }
  //     const objectUrl = window.URL.createObjectURL(blob);
  //     let filename = "";
  //     filename = this.nombreArchivo();
  //     const enlace = document.createElement('a');
  //     enlace.href = objectUrl;
  //     enlace.download = objectUrl;
  //     enlace.setAttribute('download', filename);
  //     enlace.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  //     setTimeout(function () {
  //       window.URL.revokeObjectURL(objectUrl);
  //     });
  //   });
  // }

  reportEstudiantesMatriculadosAsignatura(idMallaAsignatura: number, idPeriodoAcademico: number, idParalelo: number) {
    this.ocultarReporte();
    this.matriculacionService.getReportEstudiantesMatriculadosAsignatura(idMallaAsignatura, idPeriodoAcademico, idParalelo).subscribe((blob: Blob) => {
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

  reportTotalMatriculadosFacultades(idPeriodoAcademico: number) {
    this.ocultarReporte();
    this.matriculacionService.getReportTotalMatriculadosFacultades(idPeriodoAcademico).subscribe((blob: Blob) => {
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

  controlIsCollapsed() {
    this.mostrarReporte();
    if (this.ocultarGridReportes == true && this.ocultarGrids == true) {
      this.ocultarGridReportes = false
    }
    this.comboPeriodoDesde.disabled(false)
    this.comboPeriodoActual.disabled(false)
    this.botonRegresar.disabled(false)
    this.isCollapsed = !this.isCollapsed;
    this.pdfSrc = "";
    this.ocultarPdfViewer = !this.ocultarPdfViewer
  }

  mostrarReporte() {
    this.botonVolver.disabled(true);
    this.myPdfViewer.showPrintButton = true;
  }

  ocultarReporte() {
    this.isCollapsed = !this.isCollapsed;
    this.ocultarPdfViewer = !this.ocultarPdfViewer
    this.botonVolver.disabled(false);
    //this.myPdfViewer.showPrintButton=true;
  }


}


