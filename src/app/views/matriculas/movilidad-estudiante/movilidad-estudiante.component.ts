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
  selector: 'app-movilidad-estudiante',
  templateUrl: './movilidad-estudiante.component.html',
  styleUrls: ['./movilidad-estudiante.component.scss']
})
export class MovilidadEstudianteComponent implements OnInit {

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private MatriculasService: MatriculasService) { }

  @ViewChild('mySelectDepartamento',{read: false}) mySelectDepartamento: jqxComboBoxComponent;
  @ViewChild('mySelectOferta') mySelectOferta: jqxComboBoxComponent;
  @ViewChild('mySelectTipoMovilidad') mySelectTipoMovilidad: jqxComboBoxComponent;
  @ViewChild('mySelectSubtipoMovilidad') mySelectSubtipoMovilidad: jqxComboBoxComponent;
  @ViewChild('gridlistaEstudianteOferta') gridlistaEstudianteOferta: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;

  //Variable paa cargar datos del objeto 
  listaEstudiantes: Array<any>;
  periodo: Array<any>;
  facultad: Array<any>;
  carrera: Array<any>;
  tipoMovilidad: Array<any>;
  subtipoMovilidad: Array<any>;
  banderaMovilidad: boolean;
  pojoMobilidad: Array<any>;
  rowindex: number = -1;
  banderaDepencia: boolean = false
  ngOnInit() {

    this.ListarDepartamento();

  }

  ngAfterViewInit(): void {
    this.ListarTipoMovilidad();
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
    // captura el id seleccionado
    const selectedrowindex = this.gridlistaEstudianteOferta.getselectedrowindex();
    const idSubTipoMovilidad = this.mySelectSubtipoMovilidad.val();
    const idEstudianteOfertaSel = this.gridlistaEstudianteOferta.getcellvalue(selectedrowindex, 'idEstudianteOferta');

    this.validarEstudianteRegistraMovilidad(idEstudianteOfertaSel, idSubTipoMovilidad, opt);


  };


  ListarDepartamento() {
    this.MatriculasService.listarDepartamento().subscribe(data => {
      //alert(JSON.stringify(data));
      this.facultad = data;
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
    if (this.mySelectDepartamento.val() == "") {
      // this.messagerService.alert({title: 'Selección ',msg: 'Seleccione una facultad'});
      return;
    }
    //console.log(this.mySelectDepartamento.val());
    this.MatriculasService.listarOferta(this.mySelectDepartamento.val()).subscribe(data => {
      //alert(JSON.strin gify(data));
      this.carrera = data;
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
          { name: 'oferta', type: 'string' },
          { name: 'estado', type: 'string' }

        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE OFERTA
  dataAdapterOferta: any = new jqx.dataAdapter(this.sourceOferta);

  ListarTipoMovilidad() {
    this.MatriculasService.listarTipoMovilidad().subscribe(data => {
      this.tipoMovilidad = data;
      this.sourceTipoMovilidad.localdata = data;
      this.dataAdapterTipoMovilidad.dataBind();
    })
  }


  //FUENTE DE DATOS PARA EL COMBOBOX DE TIPO DE MOVILIDAD
  sourceTipoMovilidad: any =
    {
      datatype: 'json',
      id: 'id',
      localdata:
        [
          { name: 'id', type: 'int' },
          { name: 'codigo', type: 'string' },
          { name: 'descripcion', type: 'string' },
          { name: 'estado', type: 'string' }

        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE TIPO DE MOVILIDAD
  dataAdapterTipoMovilidad: any = new jqx.dataAdapter(this.sourceTipoMovilidad);


  ListarSubtipoMovilidad() {
    if (this.mySelectTipoMovilidad.val() == "") {
      // this.messagerService.alert({title: 'Selección ',msg: 'Seleccione una facultad'});
      return;
    }

    this.MatriculasService.listarSubtipoMovilidad(this.mySelectTipoMovilidad.val()).subscribe(data => {
      //alert(JSON.strin gify(data));
      this.subtipoMovilidad = data;
      this.sourceSubtipoMovilidad.localdata = data;
      this.dataAdapterSubtipoMovilidad.dataBind();
    })
  }



  //FUENTE DE DATOS PARA EL COMBOBOX DE SUBTIPO DE MOVILIDAD
  sourceSubtipoMovilidad: any =
    {
      datatype: 'json',
      id: 'id',
      localdata:
        [
          { name: 'id', type: 'int' },
          { name: 'codigo', type: 'string' },
          { name: 'descripcion', type: 'string' },
          { name: 'estado', type: 'string' }

        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE SUBTIPO DE MOVILIDAD
  dataAdapterSubtipoMovilidad: any = new jqx.dataAdapter(this.sourceSubtipoMovilidad);

  sourceListadoEstudiantesOferta: any =
    {
      datatype: 'array',
      id: 'idEstudianteOferta',
      datafields:
        [
          { name: 'idEstudiante', type: 'int' },
          { name: 'idEstudianteOferta', type: 'int' },
          { name: 'identificacion', type: 'string' },
          { name: 'apellidosNombres', type: 'string' },
          { name: 'idOferta', type: 'int' },
          { name: 'idMalla', type: 'int' },
          { name: 'malla', type: 'string' },
          { name: 'tipoIngreso', type: 'string' },
        ],
      hierarchy:
      {
        keyDataField: { name: 'idEstudianteOferta' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterListaEstudianteOferta: any = new jqx.dataAdapter(this.sourceListadoEstudiantesOferta);

  //metodo de reinderizado de filas del grid
  rendergridrows = (params: any): any[] => {
    return params.data;
  }
  columnsEstudiante: any[] =
    [
      { text: 'Id Estudiante', datafield: 'idEstudiante', width: '10%',filtertype: 'none', hidden: true },
      { text: 'Cédula', datafield: 'identificacion', width: '15%' },
      { text: 'Nombres', datafield: 'apellidosNombres', width: '35%' },
      { text: 'Id Estudiante Oferta', datafield: 'idEstudianteOferta', width: '5%', hidden: true },
      { text: 'Id Oferta', datafield: 'idOferta', width: '5%', hidden: true },
      { text: 'Id Malla', datafield: 'idMalla', width: '5%', hidden: true },
      { text: 'Malla', datafield: 'malla', width: '30%' },
      { text: 'Malla', datafield: 'tipoIngreso', width: '20%' },
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
    if (this.mySelectOferta.val() == "") {
      // this.messagerService.alert({title: 'Selección ',msg: 'Seleccione una facultad'});
      return;
    }
    //   this.MatriculasService.listarEstudianteOferta(96).subscribe(data => {
    this.MatriculasService.listarEstudianteOferta(this.mySelectOferta.val()).subscribe(data => {
      // alert(JSON.stringify(data));
      this.listaEstudiantes = data;
      this.sourceListadoEstudiantesOferta.localdata = data;
      this.dataAdapterListaEstudianteOferta.dataBind();
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
    let departamentoState = JSON.stringify(this.mySelectDepartamento.getSelectedItem());
    let ofertaState = JSON.stringify(this.mySelectOferta.getSelectedItem());
    let tipoMovilidadState = JSON.stringify(this.mySelectTipoMovilidad.getSelectedItem());
    let subtipoMovilidadState = JSON.stringify(this.mySelectSubtipoMovilidad.getSelectedItem());
    let gridState = JSON.stringify(this.gridlistaEstudianteOferta.savestate())
    //graba en memoria estado de combobox y grid
    localStorage.setItem('cbxDepartamentoState', departamentoState);
    localStorage.setItem('cbxOfertaState', ofertaState);
    localStorage.setItem('cbxTipoMovilidadState', tipoMovilidadState);
    localStorage.setItem('cbxsubtipoMovilidadState', subtipoMovilidadState);
    localStorage.setItem('gridEstudianteState', gridState);
  }

  getStorageFormularioState() {
    if (localStorage.getItem('gridEstudianteState')) {
      //recupera el estado del grid y combobox
      let departamentoState = JSON.parse(localStorage.getItem('cbxDepartamentoState'));
      let ofertaState = JSON.parse(localStorage.getItem('cbxOfertaState'));
      let tipoMovilidadState = JSON.parse(localStorage.getItem('cbxTipoMovilidadState'));
      let subtipoMovilidadState = JSON.parse(localStorage.getItem('cbxsubtipoMovilidadState'));

      //JSON.stringify(data)
      //carga el estado recuperado de los combobox y grid
      this.mySelectDepartamento.selectedIndex(departamentoState.index);
      this.mySelectOferta.selectedIndex(ofertaState.index);
      this.mySelectTipoMovilidad.selectedIndex(tipoMovilidadState.index);
      this.mySelectSubtipoMovilidad.selectedIndex(subtipoMovilidadState.index)
      
      let gridState = JSON.parse(localStorage.getItem('gridEstudianteState'));
      this.gridlistaEstudianteOferta.loadstate(gridState);
      //recupera y asigana puntero fila del grid seleccionada
      this.rowindex = gridState.selectedrowindex;
      //this.getselectedrowindex = gridState.selectedrowindex;
      //borra la variable temporal de control de estados del grid
      localStorage.removeItem('cbxDepartamentoState');
      localStorage.removeItem('cbxOfertaState');
      localStorage.removeItem('cbxTipoMovilidadState');
      localStorage.removeItem('cbxsubtipoMovilidadState');
      localStorage.removeItem('gridEstudianteState');
      //muestra traza de ejecucion
      // this.loadedCharacter= gridState;
    }
  }

  borrarMovilidadEstudiante(idEstudianteMatricula:number){
    this.MatriculasService.borrarMovilidadEstudiante(idEstudianteMatricula).subscribe(result => {
      this.listarEstudiantes()
    }, error => console.error(error));
  }


  validarEstudianteRegistraMovilidad(idEstudianteOferta: number, idSubTipoMovilidad: number, opt: string) {
    if (idEstudianteOferta && idSubTipoMovilidad) {
      this.MatriculasService.recuperarDetalleMovilidad(idEstudianteOferta, idSubTipoMovilidad)
        .subscribe(data => {
          this.pojoMobilidad
          if (data) {
            if (opt == 'Nuevo') {
              this.myModal.alertMessage({ title: 'Movilidad Estudiantil', msg: 'Estudiante ya está registrado en este Subtipo de Movilidad!  Edite!' })
            } else if (opt == 'Editar') {
              this.setFormularioState();
              this.router.navigate(['matriculas/movilidad-detalle', idEstudianteOferta, idSubTipoMovilidad]);
            }else if (opt == 'Eliminar') {
              if (this.banderaDepencia == false) {
                this.myModal.alertQuestion({
                  title: 'Periodo de Matrícula',
                  msg: 'Desea eliminar esta matrícula?',
                  result: (k) => {
                    if (k) {
                      this.borrarMovilidadEstudiante(data.id)
                      this.myModal.alertMessage({ title: 'Movilidad Estudiantil', msg: 'Registro de Movilidad eliminado correctamente!' });
                      this.gridlistaEstudianteOferta.clear()
                      this.gridlistaEstudianteOferta.clearselection()
                      this.gridlistaEstudianteOferta.refreshdata()
                      this.gridlistaEstudianteOferta.refresh()
                    }
                  }
                })
              } else {
                this.myModal.alertMessage({
                  title: 'Matriculación Estudiantil',
                  msg: 'No es posible eliminar una matricula con calificaciones!'
                });
              }
            }
          } else {
            if (opt == 'Nuevo') {
              this.setFormularioState();
              this.router.navigate(['matriculas/movilidad-detalle', idEstudianteOferta, idSubTipoMovilidad]);
            } else if (opt == 'Editar') {
              this.myModal.alertMessage({ title: 'Movilidad', msg: 'Estudiante no tiene registro en este Subtipo de Movilidad!  Nuevo!' });
            }else if (opt == 'Eliminar') {
              this.myModal.alertMessage({ title: 'Movilidad', msg: 'Estudiante no tiene registro en este Subtipo de Movilidad!  Nuevo!' });
            }
          }
        });
    } else {
      this.myModal.alertMessage({ title: 'Movilidad Estudiantil', msg: 'Seleccione a un estudiante y un Subtipo de Movilidad!' });
    }
  }

}
