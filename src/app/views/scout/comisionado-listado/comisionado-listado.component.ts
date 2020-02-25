import { Component, OnInit, ViewChild } from '@angular/core';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import { ScoutService } from '../../../services/scout/scout.service';

@Component({
  selector: 'app-comisionado-listado',
  templateUrl: './comisionado-listado.component.html',
  styleUrls: ['./comisionado-listado.component.scss']
})
export class ComisionadoListadoComponent implements OnInit {
  @ViewChild('gridComisionados') gridComisionados: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;
  @ViewChild('dateDesde') dateDesde: jqxDateTimeInputComponent;
  @ViewChild('dateHasta') dateHasta: jqxDateTimeInputComponent;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private consultorioService: ScoutService,
    private validadorService: ValidadorService, ) { }


  pageinformation: any = {
    "page": "0",
    // "size":this.pagesize,
    "sortfield": "id",
    "direction": "DESC",
    "filterInformation": []
  };

  //Variable paa cargar datos del objeto 
  listaComisionados: Array<any>;
  rowindex: number = -1;
  banderaDepencia: boolean = false
  ocultarPdfViewer: boolean = true;
  ocultarGridReportes: boolean = false;
  pdfSrc: string = '';
  isCollapsed: boolean = false;

  varFechaDesde: any = new Date();
  varFechaHasta: any = new Date();

  varDesde: string;
  varHasta: string;

  ngOnInit() {
    this.listadoComisionados();
  }

  ngAfterViewInit(): void {
    this.getStorageFormularioState();
  }

  //datos de jqxMenu
  dataMenu = [
    {
      'id': '1',
      'text': 'Nuevo',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'id': '2',
      'text': 'Editar',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'id': '3',
      'text': 'Eliminar',
      'parentid': '-1',
      'subMenuWidth': '250px'
    }

  ];

  sourceMenu =
    {
      datatype: 'json',
      datafields: [
        { name: 'id' },
        { name: 'parentid' },
        { name: 'text' },
        { name: 'subMenuWidth' }
      ],
      id: 'id',
      localdata: this.dataMenu
    };
  getAdapter(sourceMenu: any): any {
    return new jqx.dataAdapter(this.sourceMenu, { autoBind: true });
  };
  menuMatricula = this.getAdapter(this.sourceMenu).getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);

  itemclick(event: any): void {
    // captura el id seleccionado
    const selectedrowindex = this.gridComisionados.getselectedrowindex();
    const idScoutSel = this.gridComisionados.getcellvalue(selectedrowindex, 'idScout');
    var opt = event.args.innerText;

    switch (opt) {
      case 'Nuevo':
        this.setFormularioState();
        this.router.navigate(['scout/persona-edicion', 0, 'com']);
        break;
      case 'Editar':
        if (idScoutSel) {
          this.setFormularioState();
          this.router.navigate(['scout/persona-edicion', idScoutSel, 'com']);
        } else {
          this.myModal.alertMessage({ title: 'Registro de Comisionados', msg: 'Seleccione un Comisionado!' });
        }
        break;
      case 'Eliminar':
        if (idScoutSel) {
          if (this.banderaDepencia == false) {
            this.myModal.alertQuestion({
              title: 'Registro de Comisionados',
              msg: '¿Desea eliminar este registro?',
              result: (k) => {
                if (k) {
                  // this.eliminarComisionado(idPersonaSel)
                  this.myModal.alertMessage({ title: 'Registro de Comisionados', msg: 'Comisionado eliminado Correctamente!' });
                  this.gridComisionados.clear()
                  this.gridComisionados.clearselection()
                  this.listadoComisionados()
                  this.gridComisionados.refreshdata()
                }
              }
            })
          } else {
            this.myModal.alertMessage({
              title: 'Registro de Comisionados',
              msg: 'No es posible eliminar este registro activo, por sus dependencias con otros registros!'
            });
          }
        } else {
          this.myModal.alertMessage({ title: 'Registro de Comisionados', msg: 'Seleccione un Comisionado!' });
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

  // eliminarComisionado(idPersona: number) {
  //   this.MatriculasService.borrarComisionado(idPersona).subscribe(result => {
  //   }, error => console.error(error));
  // }


  sourceComisionados: any =
  {
    datatype: 'array',
    id: 'idScout',
    datafields:
      [
        { name: 'idScout', type: 'int' },
        { name: 'idTipoScout', type: 'int' },
        { name: 'idGrupoRama', type: 'int' },
        { name: 'identificacion', type: 'string' },
        { name: 'nombresCompletos', type: 'string' },
        { name: 'tipoScout', type: 'string'},
        { name: 'direccion', type: 'string' },
        { name: 'celular', type: 'string' },
      ],
    hierarchy:
    {
      keyDataField: { name: 'idScout' },
      parentDataField: { name: 'padre_id' }
    }
  };
  dataAdapterComisionados: any = new jqx.dataAdapter(this.sourceComisionados);

  //metodo de reinderizado de filas del grid
  rendergridrows = (params: any): any[] => {
    return params.data;
  }


  listadoComisionados() {
    this.consultorioService.getListadoComisionados().subscribe(data => {
      this.listaComisionados = data;
      this.sourceComisionados.localdata = data;
      this.dataAdapterComisionados.dataBind();
      this.gridComisionados.gotopage(this.pageinformation.page)
    });
  }

  columnsComisionados: any[] =
    [
      { text: 'Id Scout', datafield: 'idScout', width: '5%', filtertype: 'none' },
      { text: 'Id TipoScout', datafield: 'idTipoScout', width: '5%', hidden: true, filtertype: 'none' },
      { text: 'Id GrupoRama', datafield: 'idGrupoRama', width: '5%', hidden: true, filtertype: 'none' },
      { text: 'Identificacion', datafield: 'identificacion', width: '15%', cellsalign: 'center', center: 'center' },
      { text: 'Nombres', datafield: 'nombresCompletos', width: '30%' },
      { text: 'Tipo Scout', datafield: 'tipoScout', width: '25%' },
      { text: 'Dirección', datafield: 'direccion', width: '15%', cellsalign: 'center', center: 'center' },
      { text: 'Celular', datafield: 'celular', width: '10%', cellsalign: 'center', center: 'center' },
    ];

  localization: any = getLocalization('es');

  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }
    return 850;
  }

  getEvents(event): void {
    if (event.val == "ok") {
      //this.save(this.distributivoDocente); 
    }
  }

  //graba el estado del grid y combox
  setFormularioState() {
    //Prepara estado de grabado del grid
    let gridState = JSON.stringify(this.gridComisionados.savestate())
    this.pageinformation.page = JSON.parse(gridState).pagenum;
    localStorage.setItem('pageinformation', JSON.stringify(this.pageinformation));
    localStorage.setItem('gridComisionadoState', gridState);
  }

  getStorageFormularioState() {
    if (localStorage.getItem('gridComisionadoState')) {
      //recupera el estado del grid y combobox
      let EspecialidadState = JSON.parse(localStorage.getItem('cbxEspecialidadState'));
      //carga el estado recuperado de los combobox y grid
      let gridState = JSON.parse(localStorage.getItem('gridComisionadoState'));
      this.gridComisionados.loadstate(gridState);
      this.pageinformation.page = JSON.stringify(gridState.pagenum)
      this.gridComisionados.gotopage(this.pageinformation.page)
      localStorage.removeItem('cbxEspecialidadState');
      localStorage.removeItem('gridComisionadoState');
    }
  }
  nombreArchivo(): string {
    let filename = "";
    var fecha = new Date();
    filename = fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getDate() + "_" + fecha.getMonth() + "_" + fecha.getFullYear()
    return filename;
  }

  reportAgendaMedico(idMedico: number, pi_fecha_inicio: string, pi_fecha_fin: string) {
    this.ocultarReporte();
    this.consultorioService.getAgendaMedico(idMedico, pi_fecha_inicio, pi_fecha_fin).subscribe((blob: Blob) => {
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
