import { Component, ViewChild, ViewEncapsulation, ElementRef, OnDestroy, OnInit, AfterViewInit, ɵConsole } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { ScoutService } from '../../../services/scout/scout.service';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';

@Component({
  selector: 'app-reporte-proyectos',
  templateUrl: './reporte-proyectos.component.html',
  styleUrls: ['./reporte-proyectos.component.css'],
})
export class ReporteProyectosComponent implements OnInit {

  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('comboInsignia') comboInsignia: jqxComboBoxComponent;

  sub: Subscription;

  ocultarPdfViewer: boolean = true;
  ocultarGridReportes: boolean = false;
  pdfSrc: string = '';
  isCollapsed: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public messagerService: MessagerService,
    private ScoutService: ScoutService,
    private validadorService: ValidadorService, ) { }

  ngOnInit() {
    this.listarInsignias()
  }
  ngAfterViewInit(): void {

  }


  //datos de jqxMenu
  data = [
    {
      'id': '1',
      'text': 'Generar Reporte',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'text': 'Salir',
      'id': '2',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
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
    var opt = event.args.innerText;
    switch (opt) {
      case 'Generar Reporte':
        if (this.comboInsignia.val()) {
          this.reporteListadoProyectos(this.comboInsignia.val())
        } else {
          this.myModal.alertMessage({
            title: 'Reporte Listado Proyectos',
            msg: 'Seleccione una Insignia!'
          });
        }
        break;
      case 'Salir':
        // this.controlIsCollapsed()
        this.router.navigate(['dashboard']);
        break;
      default:
    }
  };

  //FUENTE DE DATOS PARA EL COMBOBOX DE RAMAS
  sourceInsignias: any =
    {
      datatype: 'json',
      id: 'id',
      localdata:
        [
          { name: 'id', type: 'string' },
          { name: 'nombre', type: 'string' },
          { name: 'descripcion', type: 'string' },
          { name: 'codigo', type: 'string' },
          { name: 'estado', type: 'string' }
        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE RAMAS
  dataAdapterInsignias: any = new jqx.dataAdapter(this.sourceInsignias);

  listarInsignias() {
    this.ScoutService.getListarInsignias().subscribe(data => {
      this.sourceInsignias.localdata = data;
      this.dataAdapterInsignias.dataBind();
    })
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

  nombreArchivo(): string {
    let filename = "";
    var fecha = new Date();
    filename = fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getDate() + "_" + fecha.getMonth() + "_" + fecha.getFullYear()
    return filename;
  }

  reporteListadoProyectos(idInsignia: number) {
    // this.ocultarReporte();
    this.ScoutService.getListadoProyectos(idInsignia).subscribe((blob: Blob) => {
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


}






