import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';

@Component({
  selector: 'app-movilidad-detalle',
  templateUrl: './movilidad-detalle.component.html',
  styleUrls: ['./movilidad-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MovilidadDetalleComponent implements OnInit {
  sub: Subscription;
  pojoMobilidad: any;
  detalleMovilidadAng: any;
  movilidadAng: any;
  descripcionTipoMovilidad: string;
  codigoMovilidad: string;
  banderaCalificacion: boolean;
  codigoSubTipoMovilidad: string;
  labelTipoMovilidad: string;
  labelSubtipoMovilidad: string;
  labelIdentificacion: string;
  labelCarrera: string;
  labelMalla: string;
  labelNombres: string;
  labelNumeroDocumento: string;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private matriculasService: MatriculasService
  ) { }
  idSubtipoMovilidadpar: number;
  idEstudianteOfertapar: number;
  tipoMovilidad: Array<any>;
  subtipoMovilidad: number;
  opcion: string;


  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('myNumDocumento') myNumDocumento: jqxInputComponent;
  @ViewChild('myGriDMovilidad', { read: false }) myGriDMovilidad: jqxGridComponent;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.idEstudianteOfertapar = params['idEstudianteOferta'];
      this.idSubtipoMovilidadpar = params['idSubtipoMovilidad'];
      // Evalua si el parametro id se paso.
      if (this.idEstudianteOfertapar && this.idSubtipoMovilidadpar) {
        this.ListarTipoMovilidad();
        this.recuperaDatosEstudianteMatricula(this.idEstudianteOfertapar);
        this.recuperarDetalleMovilidad(this.idEstudianteOfertapar, this.idSubtipoMovilidadpar)
        this.recuperarTipoSubTipoMovilidad(this.idSubtipoMovilidadpar)
        this.generarAsignaturasHabilitadas(this.idEstudianteOfertapar)
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.idEstudianteOfertapar && this.idSubtipoMovilidadpar) {

    }
  }
  data = [
    {
      'id': '1',
      'text': 'Grabar',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'text': 'Cancelar',
      'id': '2',
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
  menus = this.getAdapter(this.source1).getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);

  gotoList() {
    this.router.navigate(['/matriculas/movilidad-estudiante']);
  }

  itemclick(event: any): void {
    var opt = event.args.innerText;
    switch (opt) {
      case 'Grabar':
        let marcadas = [];
        marcadas = this.myGriDMovilidad.getselectedrowindexes();
        if (marcadas.length == 0) {
          if(this.pojoMobilidad){
            this.myModal.alertQuestion({
              title: 'Movilidad Estudiantil',
              msg: 'Desea editar sus registros?',
              result: (k) => {
                if (k) {
                  this.matriculasService.grabarMovilidad(this.pojoMobilidad).subscribe(result => {
                    this.gotoList();
                  }, error => console.error(error));
                  this.myValidator.hide();
                }
              }
            })
          }else{
            this.myModal.alertMessage({ title: 'Movilidad Estudiantil', msg: 'Seleccione al menos una asignatura!' });
          }
        } else {
          this.generarJsonMovilidadEstudiantes(this.idEstudianteOfertapar, this.idSubtipoMovilidadpar);
          if (this.banderaCalificacion == true) {
            this.myModal.alertMessage({ title: 'Movilidad Estudiantil', msg: 'Existe una asignatura sin Calificación!' });
          } else {
            if(this.myNumDocumento.val()){
              this.myModal.alertQuestion({
                title: 'Movilidad Estudiantil',
                msg: 'Desea grabar sus registros?',
                result: (k) => {
                  if (k) {
                    this.matriculasService.grabarMovilidad(this.movilidadAng).subscribe(result => {
                      this.gotoList();
                    }, error => console.error(error));
                    this.myValidator.hide();
                  }
                }
              })
            }else{
              this.myModal.alertMessage({ title: 'Movilidad Estudiantil', msg: 'Verifique que todos los campos estén llenados!' });
              this.myValidator.validate(document.getElementById('formMovilidad'));
            }  
          }
        }
        break;
      case 'Cancelar':
        this.myValidator.hide();
        this.gotoList();
        break;
      default:
    }
  };
  generarJsonMovilidadEstudiantes(idEstudianteOferta: number, idSubtipoMovilidad: number) {
    this.recuperarDetalleMovilidad(idEstudianteOferta, idSubtipoMovilidad)
    let datosMovilidad: any = {};
    let varIdMobilidad: any
    if (this.pojoMobilidad) {
      varIdMobilidad = this.pojoMobilidad.id
      this.pojoMobilidad.numeroDocumento = this.myNumDocumento.val();
    } else {
      varIdMobilidad = null
    }
    // genera la movilidad
    datosMovilidad['id'] = null;
    datosMovilidad['idEstudianteOferta'] = this.idEstudianteOfertapar
    datosMovilidad['idSubtipoMovilidad'] = this.idSubtipoMovilidadpar
    datosMovilidad['numeroDocumento'] = this.myNumDocumento.val();
    datosMovilidad['estado'] = "A";
    datosMovilidad['usuarioIngresoId'] = "1";
    datosMovilidad['version'] = 0;
    datosMovilidad['detalleMovilidad'] = [];
    //generar detalleMovilidad
    let filasSeleccionadas = [];
    filasSeleccionadas = this.myGriDMovilidad.getselectedrowindexes();
    for (let sel = 0; sel < filasSeleccionadas.length; sel++) {
      this.banderaCalificacion = false
      let i = filasSeleccionadas[sel]
      let idDetalleMovilidadGRID = this.myGriDMovilidad.getcellvalue(i, 'idDetalleMovilidad')
      let idMallaAsignatura = this.myGriDMovilidad.getcellvalue(i, 'idMallaAsignatura')
      let calificacion = this.myGriDMovilidad.getcellvalue(i, 'calificacion')
      if (!calificacion && this.codigoSubTipoMovilidad == 'RCM  ') {
        this.banderaCalificacion = true
      }
      if (!idDetalleMovilidadGRID) {
        let datosDetalleMovilidad: any = {
          "id": null, "idMovilidad": varIdMobilidad, "idMallaAsignatura": idMallaAsignatura,
          "calificacion": this.myGriDMovilidad.getcellvalue(i, 'calificacion'),
          "estado": "A", "usuarioIngresoId": "1", "version": 0
        };
        datosMovilidad['detalleMovilidad'].push(datosDetalleMovilidad);
        if (this.pojoMobilidad)
          this.pojoMobilidad.detalleMovilidad.push(datosDetalleMovilidad)
      }
    }
    this.detalleMovilidadAng = datosMovilidad['detalleMovilidad']
    if (this.pojoMobilidad) {
      this.movilidadAng = this.pojoMobilidad
    } else {
      this.movilidadAng = datosMovilidad
    }
  }

  eliminarRegistrosAnteriores(event: any) {
    if (this.pojoMobilidad) {
      let registrosMovilidad = []
      let banderaActivos : boolean = false
      registrosMovilidad = this.pojoMobilidad.detalleMovilidad
      let idDetalleMovilidad = event.args.row.idDetalleMovilidad;
      for (let i = 0; i < registrosMovilidad.length; i++) {
        if (registrosMovilidad[i].id == idDetalleMovilidad) 
          registrosMovilidad[i].estado = 'I'
        if (registrosMovilidad[i].estado == 'A') 
          banderaActivos= true  
      }
      if(banderaActivos==false){
        this.pojoMobilidad.estado = 'I'
      }
      this.pojoMobilidad.detalleMovilidad = registrosMovilidad
    }
  }

  activarRegistrosAnteriores(event: any) {
    if (this.pojoMobilidad) {
      let registrosMovilidad = []
      let banderaActivos : boolean = false
      registrosMovilidad = this.pojoMobilidad.detalleMovilidad
      let idDetalleMovilidad = event.args.row.idDetalleMovilidad;
      for (let i = 0; i < registrosMovilidad.length; i++) {
        if (registrosMovilidad[i].id == idDetalleMovilidad) 
          registrosMovilidad[i].estado = 'A'
        if (registrosMovilidad[i].estado == 'A') 
          banderaActivos= true
      }
      if(banderaActivos==true){
        this.pojoMobilidad.estado = 'A'
      }
      this.pojoMobilidad.detalleMovilidad = registrosMovilidad
    }
  }

  setAndCheckAsignturas() {
    let rowsJson = this.myGriDMovilidad.getrows()
    for (let i = 0; i < rowsJson.length; i++) {
      let idDetalleMovilidadGRID = this.myGriDMovilidad.getcellvalue(i, 'idDetalleMovilidad')
      if (idDetalleMovilidadGRID) {
        let idSubtipoMovilidadGRID = this.myGriDMovilidad.getcellvalue(i, 'idSubtipoMovilidad')
        if (idDetalleMovilidadGRID && Number(idSubtipoMovilidadGRID) == this.idSubtipoMovilidadpar) {
          this.myGriDMovilidad.selectrow(i);
          this.myGriDMovilidad.setcellvalue(i, 'valorCheck', true)
        } else if (idDetalleMovilidadGRID && Number(idSubtipoMovilidadGRID) != this.idSubtipoMovilidadpar) {
          this.myGriDMovilidad.setcellvalue(i, 'valorCheck', true)
        } else {
          this.myGriDMovilidad.setcellvalue(i, 'valorCheck', false)
        }
      }
    }
  }
  recuperaDatosEstudianteMatricula(idEstudianteOferta: number) {
    this.matriculasService.recuperarDatosEstudianteMovilidad(idEstudianteOferta).subscribe(data => {
      this.sourceMatriculaEstudiante.localdata = data;
      if(data.length>0){
        this.labelIdentificacion= data[0].identificacion
        this.labelMalla=data[0].malla
        this.labelCarrera=data[0].carrera
        this.labelNombres=data[0].nombreEstudiante
      }
    });
  }

  //Datos de los datos recuperados del estudiante
  sourceMatriculaEstudiante: any =
    {
      datatype: 'array',
      id: 'idEstudianteOferta',
      datafields:
        [
          { name: 'idEstudianteOferta', type: 'string' },
          { name: 'idMalla', type: 'string' },
          { name: 'malla', type: 'string' },
          { name: 'carrera', type: 'string' },
          { name: 'ultimoPeriodo', type: 'string' },
          { name: 'nombreEstudiante', type: 'string' },
          { name: 'identificacion', type: 'string' }
        ],
      hierarchy:
      {
        keyDataField: { name: 'idEstudianteOferta' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterMatriculaEstudiante: any = new jqx.dataAdapter(this.sourceMatriculaEstudiante);

  ListarTipoMovilidad() {
    this.matriculasService.listarTipoMovilidad().subscribe(data => {
      this.tipoMovilidad = data;
      this.sourceTipoMovilidad.localdata = data;
      this.dataAdapterTipoMovilidad.dataBind();
    })
  }

  recuperarTipoSubTipoMovilidad(idSubtipoMovilidad: number) {
    this.matriculasService.recuperarTipoSubTipoMovilidad(idSubtipoMovilidad).subscribe(data => {
      this.labelTipoMovilidad=data[0].movilidad
      this.descripcionTipoMovilidad = data[0].movilidad
      this.labelSubtipoMovilidad=data[0].subtipoMovilidad
      this.codigoMovilidad = data[0].codigoMovilidad
      this.codigoSubTipoMovilidad = data[0].codigoSubtipoMovilidad
      if (this.codigoSubTipoMovilidad != 'RCM  ') {
        this.myGriDMovilidad.hidecolumn('calificacion')
      }
      if(this.codigoSubTipoMovilidad == 'CCO  ' ||this.codigoSubTipoMovilidad == 'VCO  '||this.codigoSubTipoMovilidad == 'VTP  ' ){
        if(this.opcion=='Nuevo')
          this.opcion = 'Nueva'
      }
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

  //FUENTE DE DATOS PARA EL DATAGRID
  sourceDetalleMovilidadAsignatura: any =
    {
      datatype: 'array',
      id: 'idDetalleMovilidad',
      datafields:
        [
          { name: 'idDetalleMovilidad', type: 'int' },
          { name: 'idMallaAsignatura', type: 'int' },
          { name: 'idAsignatura', type: 'int' },
          { name: 'asignatura', type: 'string' },
          { name: 'nivel', type: 'int' },
          { name: 'numCreditos', type: 'int' },
          { name: 'calificacion', type: 'number' },
          { name: 'idSubtipoMovilidad', type: 'int' },
          { name: 'descripcionSubtipo', type: 'int' }
        ],
      hierarchy:
      {
        keyDataField: { name: 'idDetalleMovilidad' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterDetalleMovilidadAsig: any = new jqx.dataAdapter(this.sourceDetalleMovilidadAsignatura);
  generarAsignaturasHabilitadas(idEstudianteOferta: number) {
    this.matriculasService.listarDetalleMovilidadAsig(idEstudianteOferta).subscribe(data => {
      this.sourceDetalleMovilidadAsignatura.localdata = data;
      this.dataAdapterDetalleMovilidadAsig.dataBind();
      this.setAndCheckAsignturas()
    });
  }


  recuperarDetalleMovilidad(idEstudianteOferta: number, idSubtipoMovilidad: number) {
    this.matriculasService.recuperarDetalleMovilidad(idEstudianteOferta, idSubtipoMovilidad).subscribe((datos: any) => {
      if (datos) {
        this.pojoMobilidad = datos
        this.labelNumeroDocumento=this.pojoMobilidad.numeroDocumento
        this.opcion = 'Edición de'
        // this.myNumDocumento.val(datos.numeroDocumento)
      }else{
        this.opcion = 'Nuevo'
      }
    });
  }

  marcarAsignaturas(event: any) {
    this.cellEndEditEvent(event)
    let argss = event.args;
    let row = event.args.rowindex;
    argss.value;
    let idSubtipoMovilidad = event.args.row.idSubtipoMovilidad;
    let idDetalleMovilidad = event.args.row.idDetalleMovilidad;
    let columnheader = this.myGriDMovilidad.getcolumn(event.args.datafield).text;
    if (columnheader == 'Check') {
      if (argss.value == true) {
        if (Number(idSubtipoMovilidad) == this.idSubtipoMovilidadpar || !idDetalleMovilidad)
          this.myGriDMovilidad.selectrow(row)
        else
          this.myGriDMovilidad.setcellvalue(row, 'valorCheck', false)

      } else {
        this.myGriDMovilidad.unselectrow(row)
      }
    }
  }

  cellEndEditEvent(event: any): void {
    let args = event.args;
    if (args.datafield == 'calificacion' && this.pojoMobilidad) {
      let registrosMovilidad = []
      registrosMovilidad = this.pojoMobilidad.detalleMovilidad
      let idDetalleMovilidad = event.args.row.idDetalleMovilidad;
      let calificacion = event.args.row.calificacion;
      for (let i = 0; i < registrosMovilidad.length; i++) {
        if (registrosMovilidad[i].id == idDetalleMovilidad) {
          if (args.oldvalue != args.value) {
            registrosMovilidad[i].calificacion = args.value
          }
        }
      }
      this.pojoMobilidad.detalleMovilidad = registrosMovilidad
    }
  }

  rowEdit = (row: number, datafield: string, columntype: any, value: any): void | boolean => {
    let rowsJson = this.myGriDMovilidad.getrows()
    for (let i = 0; i < rowsJson.length; i++) {
      let idDetalleMovilidadGrid = this.myGriDMovilidad.getcellvalue(i, 'idDetalleMovilidad')
      let idSubtipoMovilidadGrid = this.myGriDMovilidad.getcellvalue(i, 'idSubtipoMovilidad')
      let columnheader = this.myGriDMovilidad.getcolumn(datafield).text;
      if (idDetalleMovilidadGrid && Number(idSubtipoMovilidadGrid) != this.idSubtipoMovilidadpar) {
        if (row == i) return false;
      }
    }
  }

  cellsrenderer = (row: number, column: any, value: any, defaultHtml: string): string => {
    let rowsJson = this.myGriDMovilidad.getrows()
    for (let i = 0; i < rowsJson.length; i++) {
      let idDetalleMovilidadGRID = this.myGriDMovilidad.getcellvalue(i, 'idDetalleMovilidad')
      let idSubtipoMovilidadGrid = this.myGriDMovilidad.getcellvalue(i, 'idSubtipoMovilidad')
      if (idDetalleMovilidadGRID && Number(idSubtipoMovilidadGrid) != this.idSubtipoMovilidadpar) {
        if (row == i) {
          let element = defaultHtml.substring(0, 61) + "; color: #999" + defaultHtml.substring(61);
          return element;
        }
      }
    }
    return defaultHtml;
  }

  rules =
  [
    { input: '.numeroDocInput', message: 'Número de documento requerido!', action: 'keyup, blur', rule: 'required' },
    { input: '.numeroDocInput', message: 'Número de documento no debe tener más de 20 caracteres!', action: 'keyup, blur', rule: 'length=2,20' },
  ];

  columnasMovilidad: any[] =
    [
      {
        text: 'Check', datafield: 'valorCheck', columntype: 'checkbox', width: '5%',//cellsrenderer: this.cellsrenderer
        cellbeginedit: this.rowEdit
      },
      {
        text: 'idDetMovilidad', columntype: 'textbox', datafield: 'idDetalleMovilidad', width: '5%', editable: false,hidden: true,
        cellsrenderer: this.cellsrenderer
      },
      {
        text: 'idSubti', columntype: 'textbox', datafield: 'idSubtipoMovilidad', width: '7%', editable: false,hidden: true,
        cellsrenderer: this.cellsrenderer
      },
      {
        text: 'Subtipo Movilidad', columntype: 'textbox', datafield: 'descripcionSubtipo', width: '20%', editable: false,
        // cellbeginedit: this.rowEdit,
        cellsrenderer: this.cellsrenderer
      },
      {
        text: 'idMallaAsignatura', columntype: 'textbox', datafield: 'idMallaAsignatura', width: '9%', editable: false,hidden: true,
        // cellbeginedit: this.rowEdit, 
        cellsrenderer: this.cellsrenderer
      },
      {
        text: 'idAsignatura', columntype: 'textbox', datafield: 'idAsignatura', width: '9%', editable: false,hidden: true, 
        cellsrenderer: this.cellsrenderer
      },
      {
        text: 'Nivel', columntype: 'textbox', datafield: 'nivel', width: '14%', editable: false,//hidden: true,
        // cellbeginedit: this.rowEdit,
        cellsrenderer: this.cellsrenderer
      },
      {
        text: 'Asignatura', columntype: 'textbox', datafield: 'asignatura', width: '35%', editable: false,
        cellsrenderer: this.cellsrenderer
      },
      {
        text: 'Número Créditos', columntype: 'textbox', datafield: 'numCreditos', width: '9%', cellsalign:'right',
        editable: false, cellsrenderer: this.cellsrenderer, align: 'center'
      },
      {
        text: 'Calificacion', columntype: 'numberinput', datafield: 'calificacion', width: '9%', editable: true,
        cellsalign: 'right', cellsformat: 'd2',
        cellbeginedit: this.rowEdit, cellsrenderer: this.cellsrenderer,
        validation: (cell: any, value: number): any => {
          if (value < 69 || value > 100) {
            return { result: false, message: 'Calificación debe estar en el rango 70-100 ' };
          }
          return true;
        }, createeditor: (row: number, cellvalue: any, editor: any): void => {
          editor.jqxNumberInput({ decimalDigits: 2,digits: 3 });
        }

      },
    ];
    localization: any = getLocalization('es');
}
