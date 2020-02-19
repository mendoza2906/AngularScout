import { Component, OnInit, ViewChild } from '@angular/core';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { Observable } from 'rxjs';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';

@Component({
  selector: 'app-parametricas-listado',
  templateUrl: './parametricas-listado.component.html',
  styleUrls: ['./parametricas-listado.component.scss']
})
export class ParametricasListadoComponent implements OnInit {
  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private MatriculasService: MatriculasService) { }

  @ViewChild('comboParametricas') comboParametricas: jqxComboBoxComponent;
  @ViewChild('gridDatosParametricas') gridDatosParametricas: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;

  pageinformation:any={
    "page":"0",
    // "size":this.pagesize,
    "sortfield":"id",
    "direction":"DESC",
    "filterInformation":[]
  };

  //Variable paa cargar datos del objeto 
  listaEstudiantes: Array<any>;
  rowindex: number = -1;
  banderaDepencia: boolean = false

  ngOnInit() {
    // this.listarDatosParametricas()
   
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

    let selectedrowindex = this.gridDatosParametricas.getselectedrowindex();
    let idRegistroSel = this.gridDatosParametricas.getcellvalue(selectedrowindex, 'id');
    let idComboParametrica = this.comboParametricas.val()
    var opt = event.args.innerText;

    switch (opt) {
      case 'Nuevo':
        if (idComboParametrica) {
          this.setFormularioState()
          this.router.navigate(['matriculas/parametricas-edicion', 0, idComboParametrica]);
        } else {
          this.myModal.alertMessage({ title: 'Registro de Paramétricas', msg: 'Seleccione una Tabla!' });
        }
        break;
      case 'Editar':
        if (idRegistroSel) {
          this.setFormularioState()
          this.router.navigate(['matriculas/parametricas-edicion', idRegistroSel, idComboParametrica]);
        } else {
          this.myModal.alertMessage({ title: 'Registro de Paramétricas', msg: 'Seleccione un Registro!' });
        }
        break;
      case 'Eliminar':
        if (idRegistroSel) {
          if (this.banderaDepencia == false) {
            this.myModal.alertQuestion({
              title: 'Registro de Paramétricas',
              msg: 'Desea eliminar este registro?',
              result: (k) => {
                if (k) {
                  this.eliminarRegistroParametrica(idRegistroSel)
                  this.myModal.alertMessage({ title: 'Registro de Paramétricas', msg: 'Eliminado Correctamente!' });
                  this.gridDatosParametricas.clear()
                  this.gridDatosParametricas.clearselection()
                  this.gridDatosParametricas.refreshdata()
                }
              }
            })
          } else {
            this.myModal.alertMessage({
              title: 'Registro de Paramétricas',
              msg: 'No es posible eliminar este registro activo, por sus dependencias con otros registros!'
            });
          }
        } else {
          this.myModal.alertMessage({ title: 'Registro de Paramétricas', msg: 'Seleccione un Registro!' });
        }
        break;
      default:
    }
  };

  sourceParametricas: any =
    {
      datatype: 'array',
      id: 'id',
      datafields:
        [
          { name: 'id', type: 'int' },
          { name: 'codigo', type: 'string' },
          { name: 'descripcion', type: 'string' },
          { name: 'tipoMovilidad', type: 'string' },
          { name: 'descripcionCorta', type: 'stringint' },
          { name: 'valor', type: 'number' },
          { name: 'estado', type: 'string' }
        ],
      hierarchy:
      {
        keyDataField: { name: 'id' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterParametricas: any = new jqx.dataAdapter(this.sourceParametricas);


  sourceTablasParametricas = [{ "tabla": "Tipos de Estudiante", "codigo": 'TIPEST' },
  { "tabla": "Tipos de Ingreso Estudiantes", "codigo": 'TIPING' }, { "tabla": "Tipos de Reglamentos", "codigo": 'TIPREG' },
  { "tabla": "Tipos de Oferta", "codigo": 'TIPOFE' }, { "tabla": "Tipos de Matrícula", "codigo": 'TIPMAT' },
  { "tabla": "Tipos de Movilidad", "codigo": 'TIPMOV' }, { "tabla": "Subtipos de Movilidad", "codigo": 'SUBMOV' },
  { "tabla": "Costos de Asignatura", "codigo": 'COSASI' }];


  listarDatosParametricas() {
    this.gridDatosParametricas.clearselection()
    if (this.comboParametricas.val() == 'TIPEST') {
      this.gridDatosParametricas.setcolumnproperty('descripcionCorta', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('tipoMovilidad', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('valor', 'hidden', true)
      this.listadoTiposEstudiantes()
    } else if (this.comboParametricas.val() == 'TIPING') {
      this.gridDatosParametricas.setcolumnproperty('descripcionCorta', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('tipoMovilidad', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('valor', 'hidden', true)
      this.listadoTiposIngresoEstudiante()
    } else if (this.comboParametricas.val() == 'TIPREG') {
      this.gridDatosParametricas.setcolumnproperty('descripcionCorta', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('tipoMovilidad', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('valor', 'hidden', true)
      this.listadoTiposReglamentos()
    } else if (this.comboParametricas.val() == 'TIPOFE') {
      this.gridDatosParametricas.setcolumnproperty('tipoMovilidad', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('valor', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('descripcionCorta', 'hidden', false)
      this.listadoTiposOferta()
    } else if (this.comboParametricas.val() == 'TIPMAT') {
      this.gridDatosParametricas.setcolumnproperty('descripcionCorta', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('tipoMovilidad', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('valor', 'hidden', true)
      this.listadoTiposMatricula()
    } else if (this.comboParametricas.val() == 'TIPMOV') {
      this.gridDatosParametricas.setcolumnproperty('descripcionCorta', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('tipoMovilidad', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('valor', 'hidden', true)
      this.listadoTiposMovilidad()
    } else if (this.comboParametricas.val() == 'SUBMOV') {
      this.gridDatosParametricas.setcolumnproperty('descripcionCorta', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('valor', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('tipoMovilidad', 'hidden', false)
      this.listadoSubtiposMovilidad()
    } else if (this.comboParametricas.val() == 'COSASI') {
      this.gridDatosParametricas.setcolumnproperty('descripcionCorta', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('tipoMovilidad', 'hidden', true)
      this.gridDatosParametricas.setcolumnproperty('valor', 'hidden', false)
      this.listadoCostosAsignatura()
    }
  }

  //metodo de reinderizado de filas del grid
  rendergridrows = (params: any): any[] => {
    return params.data;
  }

  listadoTiposMatricula() {
    this.MatriculasService.getListadoTiposMatricula().subscribe(data => {
      this.sourceParametricas.localdata = data;
      this.dataAdapterParametricas.dataBind();
    })
  }

  listadoTiposMovilidad() {
    this.MatriculasService.getListadoTiposMovilidad().subscribe(data => {
      this.sourceParametricas.localdata = data;
      this.dataAdapterParametricas.dataBind();
    })
  }

  listadoTiposReglamentos() {
    this.MatriculasService.getListadoTiposReglamentos().subscribe(data => {
      this.sourceParametricas.localdata = data;
      this.dataAdapterParametricas.dataBind();
    })
  }

  listadoTiposEstudiantes() {
    this.MatriculasService.getListadoTiposEstudiantes().subscribe(data => {
      this.sourceParametricas.localdata = data;
      this.dataAdapterParametricas.dataBind();
    })
  }

  listadoTiposIngresoEstudiante() {
    this.MatriculasService.getListadoTiposIngresoEstudiante().subscribe(data => {
      this.sourceParametricas.localdata = data;
      this.dataAdapterParametricas.dataBind();
    })
  }

  listadoSubtiposMovilidad() {
    this.MatriculasService.getListadoSubtiposMovilidad().subscribe(data => {
      this.sourceParametricas.localdata = data;
      this.dataAdapterParametricas.dataBind();
    })
  }

  listadoTiposOferta() {
    this.MatriculasService.getListadoTiposOferta().subscribe(data => {
      this.sourceParametricas.localdata = data;
      this.dataAdapterParametricas.dataBind();
    })
  }

  listadoCostosAsignatura() {
    this.MatriculasService.getListadoCostosAsignatura().subscribe(data => {
      this.sourceParametricas.localdata = data;
      this.dataAdapterParametricas.dataBind();
    })
  }

  eliminarRegistroParametrica(idParametrica: any) {
    if (this.comboParametricas.val() == 'TIPEST') {
      this.MatriculasService.borrarTipoEstudiante(idParametrica).subscribe(result => {
        this.listarDatosParametricas()
      }, error => console.error(error));
    } else if (this.comboParametricas.val() == 'TIPING') {
      this.MatriculasService.borrarTipoIngresoEstudiante(idParametrica).subscribe(result => {
        this.listarDatosParametricas()
      }, error => console.error(error));
    } else if (this.comboParametricas.val() == 'TIPREG') {
      this.MatriculasService.borrarTipoReglamento(idParametrica).subscribe(result => {
        this.listarDatosParametricas()
      }, error => console.error(error));
    } else if (this.comboParametricas.val() == 'TIPOFE') {
      this.MatriculasService.borrarTipoOferta(idParametrica).subscribe(result => {
        this.listarDatosParametricas()
      }, error => console.error(error));
    } else if (this.comboParametricas.val() == 'TIPMAT') {
      this.MatriculasService.borrarTipoMatricula(idParametrica).subscribe(result => {
        this.listarDatosParametricas()
      }, error => console.error(error));
    } else if (this.comboParametricas.val() == 'TIPMOV') {
      this.MatriculasService.borrarTipoMovilidad(idParametrica).subscribe(result => {
        this.listarDatosParametricas()
      }, error => console.error(error));
    } else if (this.comboParametricas.val() == 'SUBMOV') {
      this.MatriculasService.borrarSubtipoMovilidad(idParametrica).subscribe(result => {
        this.listarDatosParametricas()
      }, error => console.error(error));
    } else if (this.comboParametricas.val() == 'COSASI') {
      this.MatriculasService.borrarCostoAsignatura(idParametrica).subscribe(result => {
        this.listarDatosParametricas()
      }, error => console.error(error));
    }
  }

  columnsParametricas: any[] =
    [
      // hidden: true
      { text: 'Id Parametrica', datafield: 'id', width: '5%', filtertype: 'none', },
      { text: 'Código', datafield: 'codigo', width: '10%', cellsalign: 'center', center: 'center' },
      { text: 'Descripción', datafield: 'descripcion', width: '40%' },
      { text: 'Estado', datafield: 'estado', width: '8%', filtertype: 'none' },
      { text: 'Descripción Corta', datafield: 'descripcionCorta', width: '20%', hidden: true },
      { text: 'Tipo de Movilidad', datafield: 'tipoMovilidad', width: '20%', hidden: true },
      { text: 'Valor', datafield: 'valor', width: '10%', filtertype: 'none', hidden: true, cellsalign: 'right', cellsformat: 'c2' },
    ];

  localization: any = getLocalization('es');

    //graba el estado del grid y combox
    setFormularioState() {
      //Prepara estado de grabado del grid
      let parametricaState = JSON.stringify(this.comboParametricas.getSelectedItem());
      let gridState = JSON.stringify(this.gridDatosParametricas.savestate())
      this.pageinformation.page=JSON.parse(gridState).pagenum;
      localStorage.setItem('pageinformation', JSON.stringify(this.pageinformation));
      localStorage.setItem('cbxParametricaState', parametricaState);
      localStorage.setItem('gridParametricaState', gridState);
    }
  
    getStorageFormularioState() {
      if (localStorage.getItem('gridParametricaState')) {
        //recupera el estado del grid y combobox
        let parametricaState = JSON.parse(localStorage.getItem('cbxParametricaState'));
        //carga el estado recuperado de los combobox y grid
        this.comboParametricas.selectedIndex(parametricaState.index);

        let gridState = JSON.parse(localStorage.getItem('gridParametricaState'));
        this.gridDatosParametricas.loadstate(gridState);
        this.pageinformation.page=JSON.stringify(gridState.pagenum)
        //recupera y asigana puntero fila del grid seleccionada
       /// this.rowindex = gridState.selectedrowindex;
       this.gridDatosParametricas.gotopage(this.pageinformation.page)
        //borra la variable temporal de control de estados del grid
        localStorage.removeItem('cbxParametricaState');
        localStorage.removeItem('gridParametricaState');
  
      }
    }

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


}
