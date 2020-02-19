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
  selector: 'app-medico-listado',
  templateUrl: './medico-listado.component.html',
  styleUrls: ['./medico-listado.component.scss']
})
export class MedicoListadoComponent implements OnInit {
  @ViewChild('comboEspecialidad') comboEspecialidad: jqxComboBoxComponent;
  @ViewChild('gridMedicos') gridMedicos: jqxGridComponent;
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
  listaMedicos: Array<any>;
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
    this.listarEspecialidades();
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
      'text': 'Imprimir Agenda Médico',
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
    const selectedrowindex = this.gridMedicos.getselectedrowindex();
    const idPersonaSel = this.gridMedicos.getcellvalue(selectedrowindex, 'idPersona');
    const idMedicoSel = this.gridMedicos.getcellvalue(selectedrowindex, 'idMedico');
    let idComboEspecialidad = this.comboEspecialidad.val()
    var opt = event.args.innerText;

    switch (opt) {
      case 'Nuevo':
        this.setFormularioState();
        this.router.navigate(['consultorio/persona-edicion', 0, 'med']);
        break;
      case 'Editar':
        if (idPersonaSel) {
          this.setFormularioState();
          this.router.navigate(['consultorio/persona-edicion', idPersonaSel, 'med']);
        } else {
          this.myModal.alertMessage({ title: 'Registro de Médicos', msg: 'Seleccione un Estudiante!' });
        }
        break;
      case 'Eliminar':
        if (idPersonaSel) {
          if (this.banderaDepencia == false) {
            this.myModal.alertQuestion({
              title: 'Registro de Médicos',
              msg: 'Desea eliminar este registro?',
              result: (k) => {
                if (k) {
                  // this.eliminarEstudiante(idPersonaSel)
                  this.myModal.alertMessage({ title: 'Registro de Médicos', msg: 'Estudiante eliminado Correctamente!' });
                  this.gridMedicos.clear()
                  this.gridMedicos.clearselection()
                  this.listarMedicos()
                  this.gridMedicos.refreshdata()
                }
              }
            })
          } else {
            this.myModal.alertMessage({
              title: 'Registro de Médicos',
              msg: 'No es posible eliminar este registro activo, por sus dependencias con otros registros!'
            });
          }
        } else {
          this.myModal.alertMessage({ title: 'Registro de Médicos', msg: 'Seleccione un Estudiante!' });
        }
        break;
      case 'Imprimir Agenda Médico':
        if (idPersonaSel) {
          this.valueChangedFechas()
          // this.reportAgendaMedico(idMedicoSel, this.varDesde, this.varHasta)
          this.reportAgendaMedico(idMedicoSel, '2020-01-01', '2020-02-01')
        } else {
          this.myModal.alertMessage({ title: 'Registro de Médicos', msg: 'Seleccione un Médico!' });
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

  // eliminarEstudiante(idPersona: number) {
  //   this.MatriculasService.borrarEstudiante(idPersona).subscribe(result => {
  //   }, error => console.error(error));
  // }

  listarEspecialidades() {
    this.consultorioService.getListarEspecialidades().subscribe(data => {
      this.sourceEspecilidad.localdata = data;
      this.dataAdapterEspecialidad.dataBind();
    })

  }

  //FUENTE DE DATOS PARA EL COMBOBOX DE ESPECIALIDAD
  sourceEspecilidad: any =
    {
      datatype: 'json',
      id: 'id',
      localdata:
        [
          { name: 'id', type: 'string' },
          { name: 'descripcion', type: 'string' },
          { name: 'codigo', type: 'string' },
          { name: 'estado', type: 'string' }
        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE ESPECIALIDAD
  dataAdapterEspecialidad: any = new jqx.dataAdapter(this.sourceEspecilidad);

  sourceMedicos: any =
    {
      datatype: 'array',
      id: 'idPersona',
      datafields:
        [
          { name: 'idPersona', type: 'int' },
          { name: 'idMedico', type: 'int' },
          { name: 'idUsuario', type: 'int' },
          { name: 'identificacion', type: 'string' },
          { name: 'nombresCompletos', type: 'string' },
          { name: 'especilidad', type: 'string' },
          { name: 'direccion', type: 'string' },
          { name: 'celular', type: 'string' },
        ],
      hierarchy:
      {
        keyDataField: { name: 'idPersona' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterMedicos: any = new jqx.dataAdapter(this.sourceMedicos);

  //metodo de reinderizado de filas del grid
  rendergridrows = (params: any): any[] => {
    return params.data;
  }


  listarMedicos() {
    if (this.comboEspecialidad.val() == "") {
      return;
    }
    this.consultorioService.getListadoMedicos(this.comboEspecialidad.val()).subscribe(data => {
      this.listaMedicos = data;
      this.sourceMedicos.localdata = data;
      this.dataAdapterMedicos.dataBind();
      this.gridMedicos.gotopage(this.pageinformation.page)
    });
  }

  columnsMedico: any[] =
    [
      { text: 'Id Persona', datafield: 'idPersona', width: '5%', filtertype: 'none' },
      { text: 'Id Médico', datafield: 'idMedico', width: '5%', hidden: true, filtertype: 'none' },
      { text: 'Id Usuario', datafield: 'idUsuario', width: '5%', hidden: true, filtertype: 'none' },
      { text: 'Identificacion', datafield: 'identificacion', width: '15%', cellsalign: 'center', center: 'center' },
      { text: 'Nombres', datafield: 'nombresCompletos', width: '30%' },
      { text: 'Especilidad', datafield: 'especialidad', width: '25%' },
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
    let EspecialidadState = JSON.stringify(this.comboEspecialidad.getSelectedItem());
    let gridState = JSON.stringify(this.gridMedicos.savestate())
    this.pageinformation.page = JSON.parse(gridState).pagenum;
    localStorage.setItem('pageinformation', JSON.stringify(this.pageinformation));
    localStorage.setItem('cbxEspecialidadState', EspecialidadState);
    localStorage.setItem('gridMedicostate', gridState);
  }

  getStorageFormularioState() {
    if (localStorage.getItem('gridMedicostate')) {
      //recupera el estado del grid y combobox
      let EspecialidadState = JSON.parse(localStorage.getItem('cbxEspecialidadState'));
      //carga el estado recuperado de los combobox y grid
      this.comboEspecialidad.selectedIndex(EspecialidadState.index);
      let gridState = JSON.parse(localStorage.getItem('gridMedicostate'));
      this.gridMedicos.loadstate(gridState);
      this.pageinformation.page = JSON.stringify(gridState.pagenum)
      this.gridMedicos.gotopage(this.pageinformation.page)
      localStorage.removeItem('cbxEspecialidadState');
      localStorage.removeItem('gridMedicostate');
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
