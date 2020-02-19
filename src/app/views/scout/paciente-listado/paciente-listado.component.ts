import { Component, OnInit, ViewChild } from '@angular/core';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
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
  selector: 'app-paciente-listado',
  templateUrl: './paciente-listado.component.html',
  styleUrls: ['./paciente-listado.component.scss']
})
export class PacienteListadoComponent implements OnInit {
  @ViewChild('gridPacientes') gridPacientes: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;

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
  listaPacientes: Array<any>;
  rowindex: number = -1;
  banderaDepencia: boolean = false
  ocultarPdfViewer: boolean = true;
  ocultarGridReportes: boolean = false;
  pdfSrc: string = '';
  isCollapsed: boolean = false;

  ngOnInit() {
    this.listadoPacientes()
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
    },
    {
      'id': '4',
      'text': 'Historial Médico Paciente',
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
    const selectedrowindex = this.gridPacientes.getselectedrowindex();
    const idPersonaSel = this.gridPacientes.getcellvalue(selectedrowindex, 'idPersona');
    const idPacienteSel = this.gridPacientes.getcellvalue(selectedrowindex, 'idPaciente');
    var opt = event.args.innerText;

    switch (opt) {
      case 'Nuevo':
        this.router.navigate(['consultorio/persona-edicion', 0, 'pac']);
        break;
      case 'Editar':
        if (idPersonaSel) {
          this.setFormularioState();
          this.router.navigate(['consultorio/persona-edicion', idPersonaSel, 'pac']);
        } else {
          this.myModal.alertMessage({ title: 'Registro de Pacientes', msg: 'Seleccione un Paciente!' });
        }
        break;
      case 'Eliminar':
        if (idPersonaSel) {
          if (this.banderaDepencia == false) {
            this.myModal.alertQuestion({
              title: 'Registro de Pacientes',
              msg: 'Desea eliminar este registro?',
              result: (k) => {
                if (k) {
                  // this.eliminarPaciente(idPersonaSel)
                  this.myModal.alertMessage({ title: 'Registro de Pacientes', msg: 'Paciente eliminado Correctamente!' });
                  this.gridPacientes.clear()
                  this.gridPacientes.clearselection()
                  this.listadoPacientes()
                  this.gridPacientes.refreshdata()
                }
              }
            })
          } else {
            this.myModal.alertMessage({
              title: 'Registro de Pacientes',
              msg: 'No es posible eliminar este registro activo, por sus dependencias con otros registros!'
            });
          }
        } else {
          this.myModal.alertMessage({ title: 'Registro de Pacientes', msg: 'Seleccione un Paciente!' });
        }
        break;
      case 'Historial Médico Paciente':
        if (idPersonaSel) {
          this.reportAgendaMedico(idPacienteSel)
        } else {
          this.myModal.alertMessage({ title: 'Registro de Médicos', msg: 'Seleccione un Médico!' });
        }
        break;
        break;
      default:
    }
  };


  // eliminarPaciente(idPersona: number) {
  //   this.MatriculasService.borrarPaciente(idPersona).subscribe(result => {
  //   }, error => console.error(error));
  // }

  sourcePacientes: any =
    {
      datatype: 'array',
      id: 'idPersona',
      datafields:
        [
          { name: 'idPersona', type: 'int' },
          { name: 'idPaciente', type: 'int' },
          { name: 'idUsuario', type: 'int' },
          { name: 'identificacion', type: 'string' },
          { name: 'nombresCompletos', type: 'string' },
          { name: 'direccion', type: 'string' },
          { name: 'celular', type: 'string' },
        ],
      hierarchy:
      {
        keyDataField: { name: 'idPersona' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterPacientes: any = new jqx.dataAdapter(this.sourcePacientes);

  //metodo de reinderizado de filas del grid
  rendergridrows = (params: any): any[] => {
    return params.data;
  }

  listadoPacientes() {
    this.consultorioService.getListadoPacientes().subscribe(data => {
      this.listaPacientes = data;
      this.sourcePacientes.localdata = data;
      this.dataAdapterPacientes.dataBind();
      this.gridPacientes.gotopage(this.pageinformation.page)
    });
  }

  columnsPaciente: any[] =
    [
      { text: 'Id Persona', datafield: 'idPersona', width: '5%', filtertype: 'none' },
      { text: 'Id Paciente', datafield: 'idPaciente', width: '5%', hidden: true, filtertype: 'none' },
      { text: 'Id Usuario', datafield: 'idUsuario', width: '5%', hidden: true, filtertype: 'none' },
      { text: 'Identificacion', datafield: 'identificacion', width: '15%', cellsalign: 'center', center: 'center' },
      { text: 'Nombres', datafield: 'nombresCompletos', width: '30%' },
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
    let gridState = JSON.stringify(this.gridPacientes.savestate())
    this.pageinformation.page = JSON.parse(gridState).pagenum;
    localStorage.setItem('pageinformation', JSON.stringify(this.pageinformation));
    localStorage.setItem('gridPacientestate', gridState);
  }

  getStorageFormularioState() {
    if (localStorage.getItem('gridPacientestate')) {
      //carga el estado recuperado de los combobox y grid
      let gridState = JSON.parse(localStorage.getItem('gridPacientestate'));
      this.gridPacientes.loadstate(gridState);
      this.pageinformation.page = JSON.stringify(gridState.pagenum)
      //recupera y asigana puntero fila del grid seleccionad
      this.gridPacientes.gotopage(this.pageinformation.page)
      //borra la variable temporal de control de estados del grid
      localStorage.removeItem('gridPacientestate');
    }
  }

  nombreArchivo(): string {
    let filename = "";
    var fecha = new Date();
    filename = fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getDate() + "_" + fecha.getMonth() + "_" + fecha.getFullYear()
    return filename;
  }

  reportAgendaMedico(idPaciente: number) {
    this.ocultarReporte();
    this.consultorioService.getHistorialPaciente(idPaciente).subscribe((blob: Blob) => {
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
