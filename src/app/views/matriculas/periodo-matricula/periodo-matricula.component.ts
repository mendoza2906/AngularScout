import { Component, OnInit, ViewChild } from '@angular/core';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { Observable } from 'rxjs';
import { Alert } from 'selenium-webdriver';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';

@Component({
  selector: 'app-periodo-matricula',
  templateUrl: './periodo-matricula.component.html',
  styleUrls: ['./periodo-matricula.component.scss']
})
export class PeriodoMatriculaComponent implements OnInit {

  @ViewChild('mySelectDepartamento', { read: false }) mySelectDepartamento: jqxComboBoxComponent;
  @ViewChild('mySelectOferta') mySelectOferta: jqxComboBoxComponent;
  @ViewChild('mySelectTipoMovilidad') mySelectTipoMovilidad: jqxComboBoxComponent;
  @ViewChild('mySelectSubtipoMovilidad') mySelectSubtipoMovilidad: jqxComboBoxComponent;
  @ViewChild('myGridPeriodosMatricula') gridPeriodosMatricula: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private MatriculasService: MatriculasService) { }


  banderaPeriodoActual: boolean;
  labelPeriodoAcademico: string;
  banderaEdicionUltimoPeriodo: boolean;
  banderaDepencia: boolean = false
  pageinformation: any = {
    "page": "0",
    "size":20,
    "sortfield": "id",
    "direction": "DESC",
    "filterInformation": []
  };
  //Variable paa cargar datos del objeto 
  rowindex: number = -1;
  ngOnInit() {
    this.listarPeriodosMatricula()
    this.detalleTipoMatricula();
    this.recuperarUltimoPeriodoAcademico()

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
    var opt = event.args.innerText;
    const selectedrowindex = this.gridPeriodosMatricula.getselectedrowindex();
    const idMatriculaGeneralSel = this.gridPeriodosMatricula.getcellvalue(selectedrowindex, 'idMatriculaGeneral')

    switch (opt) {
      case 'Nuevo':
        this.validarUltimoPeriodoMatricula()
        // this.router.navigate(['matriculas/periodo-configuracion', 0]);
        break;
      case 'Editar':
        if (idMatriculaGeneralSel) {
          if (this.banderaEdicionUltimoPeriodo == true) {
            this.setFormularioState()
            this.router.navigate(['matriculas/periodo-configuracion', idMatriculaGeneralSel]);
          } else {
            this.myModal.alertMessage({
              title: 'Periodo de Matrícula',
              msg: 'Solo es posible editar el periodo actual ' + this.labelPeriodoAcademico + '!'
            });
          }
        } else {
          this.myModal.alertMessage({ title: 'Periodo de Matrícula', msg: 'Seleccione un periodo de Matrícula!' });
        }
        break;
      case 'Eliminar':
        if (idMatriculaGeneralSel != null) {
          if (this.banderaEdicionUltimoPeriodo == true) {
            if (this.banderaDepencia == false) {
              this.myModal.alertQuestion({
                title: 'Periodo de Matrícula',
                msg: 'Desea eliminar este registro?',
                result: (k) => {
                  if (k) {
                    this.eliminarPeriodoMatricula(idMatriculaGeneralSel)
                    this.myModal.alertMessage({ title: 'Periodo de Matrícula', msg: 'Eliminado Correctamente!' });
                    this.gridPeriodosMatricula.clear()
                    this.gridPeriodosMatricula.clearselection()
                    this.listarPeriodosMatricula()
                    this.gridPeriodosMatricula.refreshdata()
                  }
                }
              })
            } else {
              this.myModal.alertMessage({
                title: 'Periodo de Matrícula',
                msg: 'No es posible eliminar este registro activo, por sus dependencias con otros registros!'
              });
            }
          } else {
            this.myModal.alertMessage({
              title: 'Periodo de Matrícula',
              msg: 'Solo es posible eliminar el periodo actual ' + this.labelPeriodoAcademico + '!'
            });
          }
        } else {
          this.myModal.alertMessage({ title: 'Periodo de Matrícula', msg: 'Seleccione un periodo de Matrícula!' });
        }
        break;
      default:
    }
  };


  eliminarPeriodoMatricula(idMatriculaGeneral: number) {
    this.MatriculasService.borrarPeriodoMatricula(idMatriculaGeneral).subscribe(result => {
    }, error => console.error(error));
  }


  recuperarUltimoPeriodoAcademico() {
    this.MatriculasService.getRecuperarUltimoPeriodoAcademico().subscribe(data => {
      this.labelPeriodoAcademico = data[0].codigoPeriodo
    })
  }


  validarEdicion(event: any): void {
    let idPeriodoAcademico = event.args.row.idPeriodoAcademico;
    this.MatriculasService.getRecuperarUltimoPeriodoAcademico().subscribe(data => {
      if (data.length > 0) {
        if (data[0].idPeriodoAcademico == idPeriodoAcademico) {
          this.banderaEdicionUltimoPeriodo = true
        } else {
          this.banderaEdicionUltimoPeriodo = false
        }
      }
    });
  }


  validarUltimoPeriodoMatricula() {
    this.MatriculasService.getValidarUltimoPeriodoMatricula().subscribe(data => {
      if (data.length > 0) {
        this.myModal.alertMessage({ title: 'Periodo de Matrícula', msg: 'Ya existe el Periodo de Matrícula ' + this.labelPeriodoAcademico + '! Seleccionelo y elija la opción Editar' });
      } else {
        this.setFormularioState()
        this.router.navigate(['matriculas/periodo-configuracion', 0]);
      }
    });
  }
  sourceListadoPeriodosMatricula: any =
    {
      datatype: 'array',
      id: 'idMatriculaGeneral',
      datafields:
        [
          { name: 'idMatriculaGeneral', type: 'string' },
          { name: 'codigo', type: 'string' },
          { name: 'descripcion', type: 'string' },
          { name: 'idPeriodoAcademico', type: 'number' },
          { name: 'fechaDesde', type: 'date' },
          { name: 'fechaHasta', type: 'date' },
        ],
      hierarchy:
      {
        keyDataField: { name: 'idMatriculaGeneral' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterListadoPeriodoMatricula: any = new jqx.dataAdapter(this.sourceListadoPeriodosMatricula);


  listarPeriodosMatricula() {
    this.MatriculasService.getListarPeriodosMatricula().subscribe(data => {
      this.sourceListadoPeriodosMatricula.localdata = data;
      this.dataAdapterListadoPeriodoMatricula.dataBind();
    });
  }


  columnsPeriodoMatricula: any[] =
    [
      { text: 'Id periodo Aca', datafield: 'idPeriodoAcademico', width: '10%', filtertype: 'none', hidden: true },
      { text: 'Periodo Académico', datafield: 'codigo', width: '15%' },
      { text: 'Descripcion', datafield: 'descripcion', width: '35%' },
      { text: 'Id matricula General', datafield: 'idMatriculaGeneral', width: '10%', filtertype: 'none', hidden: true },
      {
        text: 'Fecha Desde', columntype: 'datetimeinput', datafield: 'fechaDesde', width: '15%', cellsformat: 'd',
        filtertype: 'none'
      },
      {
        text: 'Fecha Hasta', columntype: 'datetimeinput', datafield: 'fechaHasta', width: '15%', cellsformat: 'd',
        filtertype: 'none'
      }
    ];

  localization: any = getLocalization('es');

  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }
    return 850;
  }

  //metodo de reinderizado de filas del grid
  rendergridrows = (params: any): any[] => {
    return params.data;
  }


  nestedGrids: any[] = new Array();

  detalleTipoMatricula() {
    this.MatriculasService.getListarPeriodosTipoMatricula().subscribe(data => {
      this.sourceTipoMatricula.localdata = data;
      this.dataAdapterTipoMatricula.dataBind();
    })
  }

  //FUENTE DE DATOS PARA EL COMBOBOX DE TIPO DE MATRICULA
  sourceTipoMatricula: any =
    {
      localData:
        [],
      id: 'idMatriculaGeneral',
      dataType: 'array',
      dataFields:
        [
          { name: 'idTipoMatricula', map: 'idTipoMatricula', type: 'int' },
          { name: 'tipoMatricula', map: 'tipoMatricula', type: 'string' },
          { name: 'idMatriculaGeneral', map: 'idMatriculaGeneral', type: 'int' },
          { name: 'fechaHastaTm', map: 'fechaHastaTm', type: 'date' },
          { name: 'fechaDesdeTm', map: 'fechaDesdeTm', type: 'date' },
          { name: 'idPeriodoAcademico', map: 'idPeriodoAcademico', type: 'int' },
          { name: 'idTipoMatriculaFecha', map: 'idTipoMatriculaFecha', type: 'int' },

        ]
    };
  //CARGAR ORIGEN DEL COMBOBOX DE TIPO DE MATRICULA
  dataAdapterTipoMatricula: any = new jqx.dataAdapter(this.sourceTipoMatricula);

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
    let orders = this.dataAdapterTipoMatricula.records;
    //console.log(orders)
    let ordersbyid = [];

    for (let i = 0; i < orders.length; i++) {
      let result = filter.evaluate(orders[i]['idMatriculaGeneral']);
      if (result) {
        ordersbyid.push(orders[i]);
      }
    }

    let sourceCarrera = {
      datafields: [
        { name: 'idTipoMatricula', type: 'int' },
        { name: 'tipoMatricula', type: 'string' },
        { name: 'idMatriculaGeneral', type: 'int' },
        { name: 'fechaHastaTm', type: 'date' },
        { name: 'fechaDesdeTm', type: 'date' },
        { name: 'idPeriodoAcademico', type: 'int' },
        { name: 'idTipoMatriculaFecha', type: 'int' },


      ],
      id: 'idMatriculaGeneral',
      localdata: ordersbyid
    }
    let nestedGridAdapter = new jqx.dataAdapter(sourceCarrera);
    if (nestedGridContainer != null) {
      let settings = {
        width: '75%',
        // height: "130",
        theme: "darkblue",
        autoheight: true,
        source: nestedGridAdapter,
        columns: [
          { text: 'Id Tipo Matricula', datafield: 'idTipoMatricula', width: '20%', hidden: true },
          { text: 'Tipo Matricula ', datafield: 'tipoMatricula', width: '40%' },
          { text: 'Id Matricula General', datafield: 'idMatriculaGeneral', width: '20%', hidden: true },
          { text: 'Fecha Desde', datafield: 'fechaDesdeTm', width: '30%', columntype: 'datetimeinput', cellsformat: 'd' },
          { text: 'Fecha Hasta', datafield: 'fechaHastaTm', width: '30%', columntype: 'datetimeinput', cellsformat: 'd' },
          { text: 'Id Periodo Academico', datafield: 'idPeriodoAcademico', width: '10%', hidden: true },
          { text: 'Id Tipo Matricula Fecha', datafield: 'idTipoMatriculaFecha', width: '20%', hidden: true },

        ]
      };
      jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
      this.ready();
    }
  }
  ready = (): void => {
  };

  //graba el estado del grid y combox
  setFormularioState() {
    //Prepara estado de grabado del grid
    let gridState = JSON.stringify(this.gridPeriodosMatricula.savestate())
    this.pageinformation.page=JSON.parse(gridState).pagenum;
    localStorage.setItem('pageinformation', JSON.stringify(this.pageinformation));
    localStorage.setItem('gridPeriodoMatriculaState', gridState);
  }

  getStorageFormularioState() {
    if (localStorage.getItem('gridPeriodoMatriculaState')) {
      //recupera el estado del grid 
      let gridState = JSON.parse(localStorage.getItem('gridPeriodoMatriculaState'));
      this.gridPeriodosMatricula.loadstate(gridState);
      this.pageinformation.page=JSON.stringify(gridState.pagenum)
      //recupera y asigana puntero fila del grid seleccionada
     /// this.rowindex = gridState.selectedrowindex;
     this.gridPeriodosMatricula.gotopage(this.pageinformation.page)
      //borra la variable temporal de control de estados del grid
      localStorage.removeItem('gridPeriodoMatriculaState');

    }
  }

}
