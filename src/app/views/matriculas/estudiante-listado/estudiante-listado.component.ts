import { Component, OnInit, ViewChild } from '@angular/core';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';

@Component({
  selector: 'app-estudiante-listado',
  templateUrl: './estudiante-listado.component.html',
  styleUrls: ['./estudiante-listado.component.scss']
})
export class EstudianteListadoComponent implements OnInit {
  @ViewChild('comboDepartamento', { read: false }) comboDepartamento: jqxComboBoxComponent;
  @ViewChild('comboOferta') comboOferta: jqxComboBoxComponent;
  @ViewChild('gridEstudiantesRegistrados') gridEstudiantesRegistrados: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private MatriculasService: MatriculasService) { }


  pageinformation: any = {
    "page": "0",
    // "size":this.pagesize,
    "sortfield": "id",
    "direction": "DESC",
    "filterInformation": []
  };

  //Variable paa cargar datos del objeto 
  listaEstudiantes: Array<any>;
  rowindex: number = -1;
  banderaDepencia: boolean = false

  ngOnInit() {
    this.ListarDepartamento();
    // this.ListarOferta()
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
    // captura el id seleccionado
    const selectedrowindex = this.gridEstudiantesRegistrados.getselectedrowindex();
    const idPersonaSel = this.gridEstudiantesRegistrados.getcellvalue(selectedrowindex, 'idPersona');
    let idComboOferta = this.comboOferta.val()
    var opt = event.args.innerText;

    switch (opt) {
      case 'Nuevo':
        // if (idComboOferta)
        // if (this.verificarCarreraOfertada()) {
        //   this.setFormularioState();
        this.router.navigate(['matriculas/estudiante-edicion', 0, 0]);
        // } else {
        //   this.myModal.alertMessage({ title: 'Registro de Estudiantes', msg: 'No es posible registrar estudinates en una carrera no ofertada!' });
        // }
        // else
        //   this.myModal.alertMessage({ title: 'Registro de Estudiantes', msg: 'Seleccione una facultad y carrera!' });
        break;
      case 'Editar':
        if (idComboOferta) {
          if (idPersonaSel) {
            this.setFormularioState();
            this.router.navigate(['matriculas/estudiante-edicion', idPersonaSel, idComboOferta]);
          } else {
            this.myModal.alertMessage({ title: 'Registro de Estudiantes', msg: 'Seleccione un Estudiante!' });
          }
        } else {
          this.myModal.alertMessage({ title: 'Registro de Estudiantes', msg: 'Seleccione una facultad y carrera!' });
        }
        break;
      case 'Eliminar':
        if (idComboOferta) {
          if (idPersonaSel) {
            if (this.banderaDepencia == false) {
              this.myModal.alertQuestion({
                title: 'Registro de Estudiantes',
                msg: 'Desea eliminar este registro?',
                result: (k) => {
                  if (k) {
                    this.eliminarEstudiante(idPersonaSel)
                    this.myModal.alertMessage({ title: 'Registro de Estudiantes', msg: 'Estudiante eliminado Correctamente!' });
                    this.gridEstudiantesRegistrados.clear()
                    this.gridEstudiantesRegistrados.clearselection()
                    this.listarEstudiantes()
                    this.gridEstudiantesRegistrados.refreshdata()
                  }
                }
              })
            } else {
              this.myModal.alertMessage({
                title: 'Registro de Estudiantes',
                msg: 'No es posible eliminar este registro activo, por sus dependencias con otros registros!'
              });
            }
          } else {
            this.myModal.alertMessage({ title: 'Registro de Estudiantes', msg: 'Seleccione un Estudiante!' });
          }
        } else {
          this.myModal.alertMessage({ title: 'Registro de Estudiantes', msg: 'Seleccione una facultad y carrera!' });
        }
        break;
      default:
    }
  };


  eliminarEstudiante(idPersona: number) {
    this.MatriculasService.borrarEstudiante(idPersona).subscribe(result => {
    }, error => console.error(error));
  }

  ListarDepartamento() {
    this.MatriculasService.listarDepartamento().subscribe(data => {

      this.sourceDepartamento.localdata = data;
      this.dataAdapterDepartamento.dataBind();
    })

  }

  //FUENTE DE DATOS PARA EL COMBOBOX DE DEPARTAMENTO
  sourceDepartamento: any =
    {
      datatype: 'json',
      id: 'idDepartamento',
      localdata:
        [
          { name: 'idDepartamento', type: 'int' },
          { name: 'departamento', type: 'string' },
          { name: 'estado', type: 'string' }

        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE DEPARTAMENTO
  dataAdapterDepartamento: any = new jqx.dataAdapter(this.sourceDepartamento);

  ListarOferta() {
    this.MatriculasService.listaCarrerasOfertadas(this.comboDepartamento.val()).subscribe(data => {
      this.sourceOferta.localdata = data;
      this.dataAdapterOferta.dataBind();
    })
  }



  //FUENTE DE DATOS PARA EL COMBOBOX DE OFERTA
  sourceOferta: any =
    {
      datatype: 'json',
      id: 'idOferta',
      localdata:
        [
          { name: 'idOferta', type: 'int' },
          { name: 'idDepartamentoOferta', type: 'int' },
          { name: 'oferta', type: 'string' },
          { name: 'estado', type: 'string' },
          { name: 'nivelMin', type: 'string' }
        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE OFERTA
  dataAdapterOferta: any = new jqx.dataAdapter(this.sourceOferta);

  verificarCarreraOfertada(): boolean {
    let idDepartamentoOferta: number = this.comboOferta.val()
    let dataAdapter = this.dataAdapterOferta;
    let length = dataAdapter.records.length;
    for (let i = 0; i < length; i++) {
      let record = dataAdapter.records[i];
      if (record.nivelMin == 1 && record.idDepartamentoOferta == idDepartamentoOferta) {
        return true
      }
    }
    return false
  }

  sourceEstudiantesRegistrados: any =
    {
      datatype: 'array',
      id: 'idPersona',
      datafields:
        [
          { name: 'idPersona', type: 'int' },
          { name: 'identificacion', type: 'string' },
          { name: 'nombresCompletos', type: 'string' },
          { name: 'idEstudiante', type: 'int' },
          { name: 'idEstudianteOferta', type: 'int' },
          { name: 'idDepartamentoOferta', type: 'int' },
          { name: 'tipoDeIngreso', type: 'string' },
          { name: 'estadoEstudiante', type: 'string' },
          { name: 'idOferta', type: 'int' },
          { name: 'idMalla', type: 'int' },
          { name: 'malla', type: 'string' },
        ],
      hierarchy:
      {
        keyDataField: { name: 'idPersona' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterEstudiantesRegistrados: any = new jqx.dataAdapter(this.sourceEstudiantesRegistrados);

  //metodo de reinderizado de filas del grid
  rendergridrows = (params: any): any[] => {
    return params.data;
  }

  columnsEstudiante: any[] =
    [
      { text: 'Id Persona', datafield: 'idPersona', width: '5%', filtertype: 'none' },
      { text: 'Identificacion', datafield: 'identificacion', width: '15%', cellsalign: 'center', center: 'center' },
      { text: 'Nombres', datafield: 'nombresCompletos', width: '35%' },
      { text: 'Id Estudiante', datafield: 'idEstudiante', width: '5%', hidden: true, filtertype: 'none' },
      { text: 'Id EstudianteOferta', datafield: 'idEstudianteOferta', width: '5%', hidden: true, filtertype: 'none' },
      { text: 'Id DepartamentoOferta', datafield: 'idDepartamentoOferta', width: '5%', hidden: true, filtertype: 'none' },
      { text: 'Tipo Ingreso', datafield: 'tipoDeIngreso', width: '12%', cellsalign: 'center', center: 'center' },
      { text: 'Estado Estudiante', datafield: 'estadoEstudiante', width: '12%', cellsalign: 'center', center: 'center' },
      { text: 'Id Oferta', datafield: 'idOferta', width: '5%', hidden: true, filtertype: 'none' },
      { text: 'Id Malla', datafield: 'idMalla', width: '5%', hidden: true, filtertype: 'none' },
      { text: 'Malla', datafield: 'malla', width: '20%' },
    ];

  localization: any = getLocalization('es');

  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }
    return 850;
  }

  //Busca todas las oferta_distrbiutivo
  listarEstudiantes() {
    if (this.comboOferta.val() == "") {
      // this.messagerService.alert({title: 'Selección ',msg: 'Seleccione una facultad'});
      return;
    }
    this.MatriculasService.getListarEstudianteRegistrados(this.comboOferta.val()).subscribe(data => {
      this.listaEstudiantes = data;
      this.sourceEstudiantesRegistrados.localdata = data;
      this.dataAdapterEstudiantesRegistrados.dataBind();
      this.gridEstudiantesRegistrados.gotopage(this.pageinformation.page)
    });
  }

  getEvents(event): void {
    if (event.val == "ok") {
      //this.save(this.distributivoDocente); 
    }
  }

  //graba el estado del grid y combox
  setFormularioState() {
    //Prepara estado de grabado del grid
    let departamentoState = JSON.stringify(this.comboDepartamento.getSelectedItem());
    let ofertaState = JSON.stringify(this.comboOferta.getSelectedItem());
    let gridState = JSON.stringify(this.gridEstudiantesRegistrados.savestate())
    this.pageinformation.page = JSON.parse(gridState).pagenum;
    localStorage.setItem('pageinformation', JSON.stringify(this.pageinformation));
    localStorage.setItem('cbxDepartamentoState', departamentoState);
    localStorage.setItem('cbxOfertaState', ofertaState);
    localStorage.setItem('gridEstudianteState', gridState);
  }

  getStorageFormularioState() {
    if (localStorage.getItem('gridEstudianteState')) {
      //recupera el estado del grid y combobox
      let departamentoState = JSON.parse(localStorage.getItem('cbxDepartamentoState'));
      let ofertaState = JSON.parse(localStorage.getItem('cbxOfertaState'));
      //carga el estado recuperado de los combobox y grid
      this.comboDepartamento.selectedIndex(departamentoState.index);
      this.comboOferta.selectedIndex(ofertaState.index);

      let gridState = JSON.parse(localStorage.getItem('gridEstudianteState'));
      this.gridEstudiantesRegistrados.loadstate(gridState);
      this.pageinformation.page = JSON.stringify(gridState.pagenum)
      //recupera y asigana puntero fila del grid seleccionada
      /// this.rowindex = gridState.selectedrowindex;
      this.gridEstudiantesRegistrados.gotopage(this.pageinformation.page)
      //borra la variable temporal de control de estados del grid
      localStorage.removeItem('cbxDepartamentoState');
      localStorage.removeItem('cbxOfertaState');
      localStorage.removeItem('gridEstudianteState');

    }
  }

}
