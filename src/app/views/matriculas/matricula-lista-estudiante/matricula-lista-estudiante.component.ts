import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';

@Component({
  selector: 'app-matricula-lista-estudiante',
  templateUrl: './matricula-lista-estudiante.component.html',
  styleUrls: ['./matricula-lista-estudiante.component.css']
})
export class MatriculaListaEstudianteComponent implements OnInit, AfterViewInit {
  @ViewChild('eventLog') eventLog: ElementRef;
  @ViewChild('gridlistaEstudianteMatricula') gridlistaEstudianteMatricula: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('comboDepartamento', { read: false }) comboDepartamento: jqxComboBoxComponent;
  @ViewChild('comboOferta') comboOferta: jqxComboBoxComponent;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private MatriculasService: MatriculasService,
  ) { }
  //Variable Objeto habilitada para el paso de parametros de filtrado, paginado y ordenando en formato Json mediante metodo post 
  pagesize: number = 15;

  pageinformation: any = {
    "page": "0",
    "size": this.pagesize,
    "sortfield": "id",
    "direction": "DESC",
    "filterInformation": []
  };

  //Variable paa cargar datos del objeto 
  listaEstudiantes: Array<any>;

  //declaraciones para paginacion
  paginginformation: any
  pagesizeoptions: [10, 20, 30];
  pages: number = -1;
  totalPages: number = -1;
  totalElements: number = -1;
  //declaraciones para ordenamiento
  sortinformation: any

  editrow: number = -1;
  rowindex: number = -1;
  idPeriodoActualGlobal: any;
  banderaMatriculaActual: boolean;
  // banderaPerdioCarrera: boolean;
  banderaPeriodoMatriculaHabilitado: boolean;
  labelPeriodoActual: string;
  labelPeriodoAcademico: string;
  banderaDepencia: boolean = false


  Rowselect(event: any): void {
    // Obtengo el rowindex
    this.rowindex = event.args.rowindex;
  }



  ngOnInit() {
    this.ListarDepartamento();
    // this.listarEstudiantes();
    this.validarEstudianteRegistraMatricula();
    this.recuperarLabelPeriodoMatricula();

  }

  ngAfterViewInit(): void {
    this.getStorageFormularioState();
  }
  //datos de jqxMenu
  data = [
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
      'text': 'Anular/Retirar',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
  ];

  source1 =
    {
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
  menuMatricula = this.getAdapter(this.source1).getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);

  itemclick(event: any): void {
    var opt = event.args.innerText;
    // captura el id seleccionado
    const selectedrowindex = this.gridlistaEstudianteMatricula.getselectedrowindex();
    const idEstudianteOfertaSel = this.gridlistaEstudianteMatricula.getcellvalue(selectedrowindex, 'idEstudianteOferta')
    const idEstudianteMatricula = this.gridlistaEstudianteMatricula.getcellvalue(selectedrowindex, 'idEstudianteMatricula')
    let ultimoPeriodo = this.gridlistaEstudianteMatricula.getcellvalue(selectedrowindex, 'ultimoPeriodo')
    let primerSemestre = this.gridlistaEstudianteMatricula.getcellvalue(selectedrowindex, 'sinComprobantes')
    let perdioCarrera = this.gridlistaEstudianteMatricula.getcellvalue(selectedrowindex, 'perdioCarrera')
    let opcion: number;

    switch (opt) {
      //Opciones de Crud  
      case 'Nuevo':
        opcion = 1
        if (idEstudianteOfertaSel != null) {
          if (this.banderaPeriodoMatriculaHabilitado == false) {
            this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'El periodo de Matricula ' + this.labelPeriodoAcademico + ' ha concluido!' });
          } else {
            // if (this.banderaMatriculaActual == false){
            if (this.labelPeriodoActual != ultimoPeriodo) {
              if (perdioCarrera == 1) {
                // if (this.banderaPerdioCarrera == true) {
                this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'No se puede matricular, estudiante perdió la Carrera!' });
              } else {
                this.setFormularioState();
                this.router.navigate(['matriculas/matricula-estudiante', idEstudianteOfertaSel, opcion,primerSemestre]);
              }
            } else {
              this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Estudiante ya registra Matrícula para el periodo actual ' + this.labelPeriodoActual + '!  Edite!' });
            }
          }
        } else {
          this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Seleccione a un estudiante!' });
        }
        break;
      case 'Editar':
        opcion = 2
        if (idEstudianteOfertaSel) {
          if (this.banderaPeriodoMatriculaHabilitado == false) {
            this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'El periodo de Matricula ' + this.labelPeriodoAcademico + ' ha concluido!' });
          } else {
            // if (this.banderaMatriculaActual == false)
            if (this.labelPeriodoActual != ultimoPeriodo)
              this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Estudiante no tiene registro de Matrícula en el periodo actual ' + this.labelPeriodoActual + '!  Nuevo!' });
            else{
              this.setFormularioState();
              this.router.navigate(['matriculas/matricula-estudiante', idEstudianteOfertaSel, opcion,primerSemestre]);
            }  
          }
        } else {
          this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Seleccione a un estudiante!' });
        }
        break;
      case 'Eliminar':
        if (idEstudianteOfertaSel) {
          if(idEstudianteMatricula){
            if (this.banderaDepencia == false) {
              this.myModal.alertQuestion({
                title: 'Matriculación Estudiantil',
                msg: 'Desea eliminar esta matrícula?',
                result: (k) => {
                  if (k) {
                    this.borrarMatriculaEstudiante(idEstudianteMatricula)
                    this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Matrícula eliminada correctamente!' });
                    this.gridlistaEstudianteMatricula.clear()
                    this.gridlistaEstudianteMatricula.clearselection()
                    this.gridlistaEstudianteMatricula.refreshdata()
                    this.gridlistaEstudianteMatricula.refresh()
                  }
                }
              })
            } else {
              this.myModal.alertMessage({
                title: 'Matriculación Estudiantil',
                msg: 'No es posible eliminar una matricula con calificaciones!'
              });
            }
          }else {
            this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Este estudiante aún no esta matrículado!' });
          }
        }else {
          this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Seleccione a un estudiante!' });
        }
        break;
      case 'Anular/Retirar':
        opcion = 3
        if (idEstudianteOfertaSel) {
          if (this.labelPeriodoActual != ultimoPeriodo)
            // if (this.banderaMatriculaActual == false)
            this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Estudiante no tiene registro de Matrícula en el periodo actual ' + this.labelPeriodoActual + '!  Nuevo!' });
          else{
            this.setFormularioState();
            this.router.navigate(['matriculas/matricula-estudiante', idEstudianteOfertaSel, opcion,primerSemestre]);
          }
        } else {
          this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'Seleccione a un estudiante!' });
        }
        break;
      default:
    }
  };


  borrarMatriculaEstudiante(idEstudianteMatricula:number){
    this.MatriculasService.borrarMatricula(idEstudianteMatricula).subscribe(result => {
      this.listarEstudiantes()
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
    this.MatriculasService.listarOferta(this.comboDepartamento.val()).subscribe(data => {
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
          { name: 'estado', type: 'string' }

        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE OFERTA
  dataAdapterOferta: any = new jqx.dataAdapter(this.sourceOferta);

  // validarEstudiante(event: any): void {
  //   let idEstudianteOferta = event.args.row.idEstudianteOferta;
  //   this.comprobarEstudianteHabilitado(idEstudianteOferta);
  //   if(this.idPeriodoActualGlobal){
  //     this.MatriculasService.getVerificarMatriculaActual(this.idPeriodoActualGlobal, idEstudianteOferta).subscribe(matriculaActual => {
  //       if (matriculaActual.length == 0)
  //         this.banderaMatriculaActual = false
  //       else
  //         this.banderaMatriculaActual = true
  //     });
  //   }
  // }
  sourcePeriodoActual: any =
    {
      datatype: 'array',
      id: 'idPeriodoActual',
      datafields:
        [
          { name: 'idPeriodoActual', type: 'string' },
          { name: 'idMatriculaGeneral', type: 'string' },
          { name: 'codigo', type: 'string' },
          { name: 'fechaHasta', type: 'string' },
          { name: 'descripcionTipoOferta', type: 'string' }
        ],
      hierarchy:
      {
        keyDataField: { name: 'idPeriodoActual' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterPeriodoActual: any = new jqx.dataAdapter(this.sourcePeriodoActual);

  validarEstudianteRegistraMatricula() {
    this.MatriculasService.getRecuperarUltimoPeriodoMatricula().subscribe(data => {
      this.sourcePeriodoActual.localdata = data;
      if (data.length > 0) {
        this.idPeriodoActualGlobal = data[0].idPeriodoActual;
        this.labelPeriodoActual = data[0].codigo;
        this.banderaPeriodoMatriculaHabilitado = true
      } else {
        this.banderaPeriodoMatriculaHabilitado = false
      }
    });
  }

  recuperarLabelPeriodoMatricula() {
    this.MatriculasService.getRecuperarLabelPeriodoMatricula().subscribe(data => {
      if (data.length > 0) {
        this.labelPeriodoAcademico = data[0].codigo;
      }
    });
  }

  sourceListadoEstudiantesMatricular: any =
    {
      datatype: 'array',
      id: 'idEstudiante',
      datafields:
        [
          { name: 'carrera', type: 'string' },
          { name: 'idEstudianteMatricula', type: 'string' },
          { name: 'idEstudianteOferta', type: 'string' },
          { name: 'idEstudiante', type: 'string' },
          { name: 'identificacion', type: 'string' },
          { name: 'nombres', type: 'string' },
          { name: 'ultimoPeriodo', type: 'string' },
          { name: 'perdioCarrera', type: 'string' },
          { name: 'sinComprobantes', type: 'string' }
        ],
      hierarchy:
      {
        keyDataField: { name: 'idEstudiante' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterListadoEstudiantes: any = new jqx.dataAdapter(this.sourceListadoEstudiantesMatricular);

  //Busca todas las oferta_distrbiutivo
  listarEstudiantes() {
    this.MatriculasService.getListarEstudiantesMatricular(this.comboOferta.val()).subscribe(data => {
      this.listaEstudiantes = data;
      this.sourceListadoEstudiantesMatricular.localdata = data;
      this.dataAdapterListadoEstudiantes.dataBind();
      this.gridlistaEstudianteMatricula.gotopage(this.pageinformation.page)
    });
  }


  //metodo de reinderizado de filas del grid
  rendergridrows = (params: any): any[] => {
    return params.data;
  }
  columnsOferta: any[] =
    [
      { text: 'idEstudiante', datafield: 'idEstudiante', width: '5%', hidden: true, filtertype: 'none' },
      { text: 'idEstudianteOferta', datafield: 'idEstudianteOferta', width: '5%', filtertype: 'none' },
      { text: 'idEstudianteMatricula', datafield: 'idEstudianteMatricula', width: '8%', hidden: true, filtertype: 'none' },
      { text: 'Ultimo Periodo ', datafield: 'ultimoPeriodo', width: '15%', cellsalign: 'center', align: 'center' },
      { text: 'Cedula', datafield: 'identificacion', width: '15%', cellsalign: 'center', align: 'center' },
      { text: 'Nombre ', datafield: 'nombres', width: '50%' },
      { text: 'Perdio Carrera', datafield: 'perdioCarrera', width: '8%', hidden: true, filtertype: 'none' },
      { text: 'Nunca Matriculado', datafield: 'sinComprobantes', width: '8%', hidden: true, filtertype: 'none' },
      {
        text: 'Historial', datafield: 'Ver', columntype: 'button', width: '15%', filtertype: 'none',
        cellsrenderer: (): string => {
          return 'Historial';
        },
        buttonclick: (row: number): void => {

          const selectedrowindex = this.gridlistaEstudianteMatricula.getselectedrowindex();
          const idEstudianteOferta = this.gridlistaEstudianteMatricula.getcellvalue(selectedrowindex, 'idEstudianteOferta')
          const sinComprobantes = this.gridlistaEstudianteMatricula.getcellvalue(selectedrowindex, 'sinComprobantes')
          if (sinComprobantes == 1)
            this.router.navigate(['matriculas/matricula-detalle', idEstudianteOferta]);
          else
            this.myModal.alertMessage({ title: 'Matriculación Estudiantil', msg: 'El estudiante aún no registra comprobantes de matriculas anteriores!' });
        }
      },
    ];

  localization: any = getLocalization('es');
  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }
    return 850;
  }

  //para manejar los eventos de los botones 
  count = 0;
  clearLog(): void {
    this.count++;
    let log = this.eventLog.nativeElement;
    if (this.count >= 2) {
      log.innerHTML = '';
      this.count = 0;
    }
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
    let gridState = JSON.stringify(this.gridlistaEstudianteMatricula.savestate())
    this.pageinformation.page=JSON.parse(gridState).pagenum;
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
      this.gridlistaEstudianteMatricula.loadstate(gridState);
      this.pageinformation.page=JSON.stringify(gridState.pagenum)
      //recupera y asigana puntero fila del grid seleccionada
     /// this.rowindex = gridState.selectedrowindex;
     this.gridlistaEstudianteMatricula.gotopage(this.pageinformation.page)
      //borra la variable temporal de control de estados del grid
      localStorage.removeItem('cbxDepartamentoState');
      localStorage.removeItem('cbxOfertaState');
      localStorage.removeItem('gridEstudianteState');

    }
  }

}
