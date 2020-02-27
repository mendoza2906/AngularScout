import { Component, ViewChild, ViewEncapsulation, ElementRef, OnDestroy, OnInit, AfterViewInit, ɵConsole } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { ScoutService } from '../../../services/scout/scout.service';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-asistencia-listado',
  templateUrl: './asistencia-listado.component.html',
  styleUrls: ['./asistencia-listado.component.css'],
})
export class AsistenciaListadoComponent implements OnInit {

  @ViewChild('dateDesde') dateDesde: jqxDateTimeInputComponent;
  @ViewChild('dateHasta') dateHasta: jqxDateTimeInputComponent;
  @ViewChild('gridListadoActividades') gridListadoActividades: jqxGridComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;

  sub: Subscription;

  pagesize: number = 15;

  pageinformation: any = {
    "page": "0",
    "size": this.pagesize,
    "sortfield": "id",
    "direction": "DESC",
    "filterInformation": []
  };


  ocultarPdfViewer: boolean = true;
  ocultarGridReportes: boolean = false;
  pdfSrc: string = '';
  isCollapsed: boolean = false;


  fechaDesdeDt: Date;
  fechaHastaDt: Date;
  varFechaDesde: any = new Date();
  varFechaHasta: any = new Date();

  varDesde: string;
  varHasta: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public messagerService: MessagerService,
    private ScoutService: ScoutService,
    private validadorService: ValidadorService, ) { }

  ngOnInit() {
this.listarAsistencias()

  }
  ngAfterViewInit(): void {

  }


  //datos de jqxMenu
  data = [
    {
      'id': '1',
      'text': 'Nuevo',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'text': 'Editar',
      'id': '2',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'text': 'Eliminar',
      'id': '3',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'text': 'Imprimir Listado Actividades',
      'id': '4',
      'parentid': '-1',
      'subMenuWidth': '250px'
    }
  ];

  // prepare the data
  source1 = {
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
  itemclick(event: any): void {
    const selectedrowindex = this.gridListadoActividades.getselectedrowindex();
    const idAsistenciaSel = this.gridListadoActividades.getcellvalue(selectedrowindex, 'idAsistencia')
    var opt = event.args.innerText;
    switch (opt) {
      case 'Nuevo':
        this.router.navigate(['scout/asistencia-registro',0]);
        break;
      case 'Editar':
        if(idAsistenciaSel){
          this.router.navigate(['scout/asistencia-registro',idAsistenciaSel]);
        }else{
          this.myModal.alertMessage({
            title: 'Registro de Asistencia',
            msg: 'Seleccione un listado de Asistencia!'
          });
        }
        break;
      case 'Eliminar':
        //  this.gotoList();
        //    this.eliminar();
        break;
      case 'Imprimir Listado Actividades':
        if(idAsistenciaSel){
        this.reporteListadoAsistencia(idAsistenciaSel)
        }else{
          this.myModal.alertMessage({
            title: 'Registro de Asistencia',
            msg: 'Seleccione un listado de Asistencia!'
          });
        }
        break;
      default:

    }
  };

  valueChangedFechas() {
    //desde
    let fechaDesde: Date
    fechaDesde = this.dateDesde.value()
    this.varFechaDesde = fechaDesde
    //hasta
    let fechaHasta: Date
    fechaHasta = this.dateHasta.value()
    this.varFechaHasta = fechaHasta
    if (fechaDesde) {


      let dayd = fechaDesde.getDate()
      let monthd = fechaDesde.getMonth() + 1
      let yeard = fechaDesde.getFullYear()

      if (monthd < 10)
        this.varDesde = `${yeard}-0${monthd}-${dayd}`
      else
        this.varDesde = `${yeard}-${monthd}-${dayd}`
    }
    if (fechaHasta) {

      let dayh = fechaHasta.getDate()
      let monthh = fechaHasta.getMonth() + 1
      let yearh = fechaHasta.getFullYear()
      if (monthh < 10)
        this.varHasta = `${yearh}-0${monthh}-${dayh}`
      else
        this.varHasta = `${yearh}-${monthh}-${dayh}`
    }
  }


  imprimirListadoCitas() {
    alert('Vamo imprimiendo!!!!')
  }

  listarAsistencias() {
    // this.valueChangedFechas()
    this.ScoutService.getListarAsistencias().subscribe(data => {
      this.sourceListadoActividades.localdata = data;
      this.dataAdapterListadoActividades.dataBind();
      this.gridListadoActividades.gotopage(this.pageinformation.page)
    });
  }

  sourceListadoActividades: any =
    {
      datatype: 'array',
      id: 'idAsistencia',
      datafields:
        [
          { name: 'idAsistencia', type: 'string' },
          { name: 'idActividad', type: 'string' },
          { name: 'idGrupoRama', type: 'string' },
          { name: 'idRama', type: 'string' },
          { name: 'idGrupo', type: 'string' },
          { name: 'fechaAsistencia', type: 'date' },
          { name: 'observacion', type: 'string' },
          { name: 'actividad', type: 'string' },
          { name: 'grupo', type: 'string' },
          { name: 'rama', type: 'string' },
        ],
      hierarchy:
      {
        keyDataField: { name: 'idAsistencia' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterListadoActividades: any = new jqx.dataAdapter(this.sourceListadoActividades);


  columnsActividades: any[] =
    [
      { text: 'id Asistencia', datafield: 'idAsistencia', width: '5%' },
      { text: 'id Actividad', datafield: 'idActividad', width: '5%', hidden: true },
      { text: 'id GrupoRama', datafield: 'idGrupoRama', width: '5%', hidden: true },
      { text: 'id idRama', datafield: 'idRama', width: '5%', hidden: true },
      { text: 'id Grupo', datafield: 'idGrupo', width: '5%', hidden: true },
      { text: 'Fecha Asistencia', datafield: 'fechaAsistencia', width: '10%', hidden: false,columntype: 'datetimeinput', cellsformat: 'd' },
      { text: 'Actividad', datafield: 'actividad', width: '25%', hidden: false },
      { text: 'Rama', datafield: 'rama', width: '20%', cellsalign: 'left', align: 'center' },
      { text: 'Grupo', datafield: 'grupo', width: '20%', cellsalign: 'left', align: 'left' },
      { text: 'Observación ', datafield: 'observacion', width: '20%' },
    ];
    localization: any = getLocalization('es');

    nombreArchivo(): string {
      let filename = "";
      var fecha = new Date();
      filename = fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getDate() + "_" + fecha.getMonth() + "_" + fecha.getFullYear()
      return filename;
    }
  
    reporteListadoAsistencia(idAsistencia: number) {
      this.ocultarReporte();
      this.ScoutService.getListadoAsistencia(idAsistencia).subscribe((blob: Blob) => {
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
    }
}






