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
  selector: 'app-reporte-insignias',
  templateUrl: './reporte-insignias.component.html',
  styleUrls: ['./reporte-insignias.component.css'],
})
export class ReporteInsigniasComponent implements OnInit {

  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;

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
        this.reporteRankingInsignias()
        break;
      case 'Salir':
      //  this.controlIsCollapsed()
       this.router.navigate(['dashboard']);
        
        break;
      default:
    }
  };
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

  reporteRankingInsignias() {
    // this.ocultarReporte();
    this.ScoutService.getRankings().subscribe((blob: Blob) => {
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






