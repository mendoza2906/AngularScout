import { Component, OnInit, ViewChild } from '@angular/core';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';

@Component({
  selector: 'app-creacion-reglamentos',
  templateUrl: './creacion-reglamentos.component.html',
})
export class CreacionReglamentosComponent implements OnInit {
  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private MatriculasService: MatriculasService) { }


  @ViewChild('gridReglamentos') gridReglamentos: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;

  banderaPeriodoActual: boolean;
  labelPeriodoAcademico: string;
  banderaEdicionUltimoPeriodo: boolean;
  banderaDepencia: boolean = false
  pageinformation:any={
    "page":"0",
    // "size":this.pagesize,
    "sortfield":"id",
    "direction":"DESC",
    "filterInformation":[]
  };


  //Variable paa cargar datos del objeto 
  rowindex: number = -1;
  ngOnInit() {
    this.listarTodosReglamentos()
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
    const selectedrowindex = this.gridReglamentos.getselectedrowindex();
    const idReglamentoSel = this.gridReglamentos.getcellvalue(selectedrowindex, 'idReglamento')

    switch (opt) {
      case 'Nuevo':
        this.setFormularioState()
        this.router.navigate(['matriculas/edicion-reglamentos', 0]);
        break;
      case 'Editar':
        this.setFormularioState()
        if (idReglamentoSel) {
          this.router.navigate(['matriculas/edicion-reglamentos', idReglamentoSel]);
        } else {
          this.myModal.alertMessage({ title: 'Reglamentos Institucionales', msg: 'Seleccione un Reglamento!' });
        }
        break;
      case 'Eliminar':
        if (idReglamentoSel) {
          if (this.banderaDepencia == false) {
            this.myModal.alertQuestion({
              title: 'Reglamentos Institucionales',
              msg: 'Desea eliminar este registro?',
              result: (k) => {
                if (k) {
                  this.eliminarReglamento(idReglamentoSel)
                  this.myModal.alertMessage({ title: 'Reglamentos Institucionales', msg: 'EliminadoCorrectamente!' });
                  this.gridReglamentos.clear()
                  this.gridReglamentos.clearselection()
                  this.listarTodosReglamentos()
                  this.gridReglamentos.refreshdata()
                }
              }
            })
          } else {
            this.myModal.alertMessage({
              title: 'Reglamentos Institucionales',
              msg: 'No es posible eliminar este registro activo, por sus dependencias con otros registros!'
            });
          }
        } else {
          this.myModal.alertMessage({ title: 'Reglamentos Institucionales', msg: 'Seleccione un Reglamento!' });
        }
        break;
      default:
    }
  };

  eliminarReglamento(idReglamento:number){
    this.MatriculasService.borrarReglamento(idReglamento).subscribe(result => {
    }, error => console.error(error));
  }

  sourceReglamentos: any =
    {
      datatype: 'array',
      id: 'idReglamento',
      datafields:
        [
          { name: 'idReglamento', type: 'string' },
          { name: 'idTipoReglamento', type: 'string' },
          { name: 'nombreReglamento', type: 'string' },
          { name: 'reglamentoNacional', type: 'string' },
          { name: 'tipoReglamento', type: 'string' },
          { name: 'fechaAprobacionIes', type: 'date' },
        ],
      hierarchy:
      {
        keyDataField: { name: 'idReglamento' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterReglamentos: any = new jqx.dataAdapter(this.sourceReglamentos);


  listarTodosReglamentos() {
    this.MatriculasService.getListarTodosReglamentos().subscribe(data => {
      this.sourceReglamentos.localdata = data;
      this.dataAdapterReglamentos.dataBind();
    });
  }
  columnsReglamentos: any[] =
    [
      { text: 'Id Reglamento', datafield: 'idReglamento', width: '10%', filtertype: 'none', hidden: true },
      { text: 'IdTipo', datafield: 'idTipoReglamento', width: '7%', filtertype: 'none', hidden: true },
      { text: 'Nombre', datafield: 'nombreReglamento', width: '50%' },
      { text: 'Reglamento Nacional', datafield: 'reglamentoNacional', width: '15%' },
      { text: 'Tipo Reglamento', datafield: 'tipoReglamento', width: '15%' },
      {
        text: 'Fecha Aprobacion IES', columntype: 'datetimeinput', datafield: 'fechaAprobacionIes', width: '20%', cellsformat: 'd',
        filtertype: 'none'
      }
    ];
  localization: any = getLocalization('es');

  setFormularioState() {
    //Prepara estado de grabado del grid

    let gridState = JSON.stringify(this.gridReglamentos.savestate())
    this.pageinformation.page=JSON.parse(gridState).pagenum;
    localStorage.setItem('pageinformation', JSON.stringify(this.pageinformation));
    localStorage.setItem('gridReglamentosState', gridState);
  }

  getStorageFormularioState() {
    if (localStorage.getItem('gridReglamentosState')) {
      //carga el estado recuperado del grid
      let gridState = JSON.parse(localStorage.getItem('gridReglamentosState'));
      this.gridReglamentos.loadstate(gridState);
      this.pageinformation.page=JSON.stringify(gridState.pagenum)
      //recupera y asigana puntero fila del grid seleccionada
     /// this.rowindex = gridState.selectedrowindex;
     this.gridReglamentos.gotopage(this.pageinformation.page)
      //borra la variable temporal de control de estados del grid
      localStorage.removeItem('gridEstudianteState');
    }
  }





}
