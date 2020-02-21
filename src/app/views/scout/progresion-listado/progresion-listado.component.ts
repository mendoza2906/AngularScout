import { Component, OnInit, ViewChild } from '@angular/core';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import { ScoutService } from '../../../services/scout/scout.service';

@Component({
  selector: 'app-progresion-listado',
  templateUrl: './progresion-listado.component.html',
  styleUrls: ['./progresion-listado.component.scss']
})
export class ProgresionListadoComponent implements OnInit {
  @ViewChild('comboRama') comboRama: jqxComboBoxComponent;
  @ViewChild('comboGrupo') comboGrupo: jqxComboBoxComponent;
  @ViewChild('gridScouts') gridScouts: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;
  @ViewChild('dateDesde') dateDesde: jqxDateTimeInputComponent;
  @ViewChild('dateHasta') dateHasta: jqxDateTimeInputComponent;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private ScoutService: ScoutService,
    private validadorService: ValidadorService, ) { }


  pageinformation: any = {
    "page": "0",
    // "size":this.pagesize,
    "sortfield": "id",
    "direction": "DESC",
    "filterInformation": []
  };

  //Variable paa cargar datos del objeto 
  listaScouts: Array<any>;
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
    
  }

  ngAfterViewInit(): void {
    this.listarRamas();
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
    },

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
    const selectedrowindex = this.gridScouts.getselectedrowindex();
    const idScoutSel = this.gridScouts.getcellvalue(selectedrowindex, 'idScout');
    let idComboEspecialidad = this.comboRama.val()
    var opt = event.args.innerText;

    switch (opt) {
      case 'Nuevo':
        this.setFormularioState();
        this.router.navigate(['scout/revisar-progresion', 0]);
        break;
      case 'Editar':
        if (idScoutSel) {
          this.setFormularioState();
          this.router.navigate(['scout/revisar-progresion', idScoutSel]);
        } else {
          this.myModal.alertMessage({ title: 'Progresión de Scouts', msg: 'Seleccione un Scout!' });
        }
        break;
      case 'Eliminar':
        if (idScoutSel) {
          if (this.banderaDepencia == false) {
            this.myModal.alertQuestion({
              title: 'Progresión de Scouts',
              msg: 'Desea eliminar este registro?',
              result: (k) => {
                if (k) {
                  // this.eliminarEstudiante(idPersonaSel)
                  this.myModal.alertMessage({ title: 'Progresión de Scouts', msg: 'Scout eliminado Correctamente!' });
                  this.gridScouts.clear()
                  this.gridScouts.clearselection()
                  this.listarScouts()
                  this.gridScouts.refreshdata()
                }
              }
            })
          } else {
            this.myModal.alertMessage({
              title: 'Progresión de Scouts',
              msg: 'No es posible eliminar este registro activo, por sus dependencias con otros registros!'
            });
          }
        } else {
          this.myModal.alertMessage({ title: 'Progresión de Scouts', msg: 'Seleccione un Scout!' });
        }
        break;
      default:
    }
  };

  // eliminarEstudiante(idPersona: number) {
  //   this.MatriculasService.borrarEstudiante(idPersona).subscribe(result => {
  //   }, error => console.error(error));
  // }



  //FUENTE DE DATOS PARA EL COMBOBOX DE RAMAS
  sourceRamas: any =
    {
      datatype: 'json',
      id: 'id',
      localdata:
        [
          { name: 'id', type: 'string' },
          { name: 'nombre', type: 'string' },
          { name: 'codigo', type: 'string' },
          { name: 'estado', type: 'string' }
        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE RAMAS
  dataAdapterRamas: any = new jqx.dataAdapter(this.sourceRamas);

  listarRamas() {
    this.ScoutService.getListarRamas().subscribe(data => {
      this.sourceRamas.localdata = data;
      this.dataAdapterRamas.dataBind();
    })
  }

    //FUENTE DE DATOS PARA EL COMBOBOX DE GRUPOS
    sourceGrupos: any =
    {
      datatype: 'json',
      id: 'id',
      localdata:
        [
          { name: 'id', type: 'string' },
          { name: 'idGrupoRama', type: 'string' },
          { name: 'nombre', type: 'string' },
          { name: 'codigo', type: 'string' },
          { name: 'estado', type: 'string' }
        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE GRUPOS
  dataAdapterGrupos: any = new jqx.dataAdapter(this.sourceGrupos);

  listarGrupos() {
    this.ScoutService.getListarGrupos(this.comboRama.val()).subscribe(data => {
      this.sourceGrupos.localdata = data;
      this.dataAdapterGrupos.dataBind();
    })
  }


  sourceScouts: any =
    {
      datatype: 'array',
      id: 'idScout',
      datafields:
        [
          { name: 'idScout', type: 'int' },
          { name: 'identificacion', type: 'string' },
          { name: 'nombresCompletos', type: 'string' },
          { name: 'tipoScout', type: 'string' },
          { name: 'direccion', type: 'string' },
          { name: 'celular', type: 'string' },
        ],
      hierarchy:
      {
        keyDataField: { name: 'idScout' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterScouts: any = new jqx.dataAdapter(this.sourceScouts);

  //metodo de reinderizado de filas del grid
  rendergridrows = (params: any): any[] => {
    return params.data;
  }


  listarScouts() {
    if (this.comboRama.val() == "") {
      return;
    }
    this.ScoutService.getListarScouts(this.comboGrupo.val()).subscribe(data => {
      this.listaScouts = data;
      this.sourceScouts.localdata = data;
      this.dataAdapterScouts.dataBind();
      this.gridScouts.gotopage(this.pageinformation.page)
    });
  }

  columnsScouts: any[] =
    [
      { text: 'Id Scout', datafield: 'idScout', width: '5%', filtertype: 'none' },
      { text: 'Identificacion', datafield: 'identificacion', width: '15%', cellsalign: 'center', center: 'center' },
      { text: 'Nombres', datafield: 'nombresCompletos', width: '30%' },
      { text: 'tipoScout', datafield: 'tipoScout', width: '25%' },
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
    let RamaState = JSON.stringify(this.comboRama.getSelectedItem());
    let GrupoState = JSON.stringify(this.comboGrupo.getSelectedItem());
    let gridState = JSON.stringify(this.gridScouts.savestate())
    this.pageinformation.page = JSON.parse(gridState).pagenum;
    localStorage.setItem('pageinformation', JSON.stringify(this.pageinformation));
    localStorage.setItem('cbxRamaState', RamaState);
    localStorage.setItem('cbxGrupoState', GrupoState);
    localStorage.setItem('gridScoutState', gridState);
  }

  getStorageFormularioState() {
    if (localStorage.getItem('gridScoutState')) {
      //recupera el estado del grid y combobox
      let RamaState = JSON.parse(localStorage.getItem('cbxRamaState'));
      let GrupoState = JSON.parse(localStorage.getItem('cbxGrupoState'));
      //carga el estado recuperado de los combobox y grid
      this.comboRama.selectedIndex(RamaState.index);
      this.comboGrupo.selectedIndex(GrupoState.index);
      let gridState = JSON.parse(localStorage.getItem('gridScoutState'));
      this.gridScouts.loadstate(gridState);
      this.pageinformation.page = JSON.stringify(gridState.pagenum)
      this.gridScouts.gotopage(this.pageinformation.page)
      localStorage.removeItem('cbxRamaState');
      localStorage.removeItem('cbxGrupoState');
      localStorage.removeItem('gridScoutState');
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
    this.ScoutService.getAgendaMedico(idMedico, pi_fecha_inicio, pi_fecha_fin).subscribe((blob: Blob) => {
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
