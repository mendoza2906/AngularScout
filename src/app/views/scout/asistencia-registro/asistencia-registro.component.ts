import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import { ScoutService } from '../../../services/scout/scout.service';
import { jqxListBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';


@Component({
  selector: 'app-asistencia-registro',
  templateUrl: './asistencia-registro.component.html',
  styleUrls: ['./asistencia-registro.component.scss']
})
export class AsistenciaRegistroComponent implements OnInit {
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('comboRama') comboRama: jqxComboBoxComponent;
  @ViewChild('comboGrupo') comboGrupo: jqxComboBoxComponent;
  @ViewChild('comboActividad') comboActividad: jqxComboBoxComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;
  @ViewChild('dateActividad') dateActividad: jqxDateTimeInputComponent;
  @ViewChild('listBoxScouts') listBoxScouts: jqxListBoxComponent;
  @ViewChild('txtAreaObservacion') txtAreaObservacion: jqxTextAreaComponent

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

  sub: Subscription;
  //Variable paa cargar datos del objeto
  listaScouts: Array<any>;
  rowindex: number = -1;
  banderaDepencia: boolean = false
  idAsistenciaPar: number
  AsistenciaAng: any = {}
  detalleAsistencias: any = {};
  varFechaActividad: any = new Date();
  banderaDatosValidos: boolean = false

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.idAsistenciaPar = params['idAsistencia'];
      // Evalua si el parametro id se paso.
      this.listarRamas();
      this.listarActividades()
      if (this.idAsistenciaPar == 0) {
        this.nuevoAsistencia()
      } else {
        this.recuperarAsistenciaId(this.idAsistenciaPar)
      }
    });
  }

  ngAfterViewInit(): void {

  }

  //datos de jqxMenu
  dataMenu = [
    {
      'id': '1',
      'text': 'Grabar',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'id': '2',
      'text': 'Cancelar',
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
  menu = this.getAdapter(this.sourceMenu).getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);

  itemclick(event: any): void {
    let idComboEspecialidad = this.comboRama.val()
    var opt = event.args.innerText;

    switch (opt) {
      case 'Grabar':
        this.myValidator.validate(document.getElementById('formAsistencia'));
        if (this.validaDatos()) {
          if(this.listBoxScouts.getSelectedItems().length>0){
            this.myModal.alertQuestion({
              title: 'Registro de Asistencia',
              msg: '¿Desea grabar sus registros?',
              result: (k) => {
                if (k) {
                  this.ScoutService.grabarAsistencia(this.AsistenciaAng).subscribe(result => {
                    this.gotoList();
                  }, error => console.error(error));
                }
              }
            })
          }else{
            this.myModal.alertMessage({
              title: 'Registro de Asistencia',
              msg: 'Seleccione al menos un Scout!'
            });
          }
        } else {
          this.myModal.alertMessage({
            title: 'Registro de Asistencia',
            msg: 'Verifique que todos los campos esten llenados correctamente!'
          });
        }
        break;
      case 'Cancelar':
        this.myValidator.hide();
        this.gotoList()
        break;
      default:
    }
  };

  ValidationSuccess(event: any): void {
    this.banderaDatosValidos = true
  }


  gotoList() {
    this.router.navigate(['scout/asistencia-listado']);
  }


  valueChangedFechaActividad() {
    let fechaActividad: Date
    fechaActividad = this.dateActividad.value()
    this.varFechaActividad = fechaActividad
    if (this.AsistenciaAng) {
      this.AsistenciaAng.fechaAsistencia = fechaActividad
    }
  }

  nuevoAsistencia() {
    this.AsistenciaAng.id = null;
    this.AsistenciaAng.estado = "A";
    this.AsistenciaAng.version = 0;
    this.AsistenciaAng.detalleAsistencias = [];
    // let items = this.listBoxTiposOflistBoxScoutsertas.getCheckedItems()
    // for (let i = 0; i < items.length; i++) {
    //   if (i < items.length) {
    //     this.detalleAsistencias = {
    //       "id": null, "idAsistencia": this.comboGrupo.val(), "idScout": items[i].value,"asistio": true,
    //       "estado": "A", "version": 0
    //     };
    //   }
    //   this.reglamentoAng['reglamentoTipoOfertas'].push(this.reglamentoTipoOfertasAng);
    // }
  }
  recuperarAsistenciaId(idAsistencia: number) {
    this.ScoutService.getRecuperarAsistenciaId(idAsistencia).subscribe(data => {
      if (data) {
        this.AsistenciaAng = data
        this.comboActividad.val(data.idActividades)
        this.varFechaActividad = new Date(data.fechaAsistencia);
        this.dateActividad.disabled(true)
        this.recuperarCombosAnidados(data.detalleAsistencias[0].idScout)
      }
    })
  }

  recuperarCombosAnidados(idScout: number) {
    this.ScoutService.getRecuperarCombosScouts(idScout).subscribe(data => {
      if (data.length > 0) {
        this.comboRama.val(data[0].idRama)
        this.ScoutService.getListarGrupos(data[0].idRama).subscribe(data => {
          this.sourceGrupos.localdata = data;
          this.dataAdapterGrupos.dataBind();
          let dataAdapter = this.sourceGrupos.localdata;
          for (let i = 0; i < dataAdapter.length; i++) {
            let record = dataAdapter[i];
            if (record.idGrupoRama == data[0].idGrupoRama) {
              this.comboGrupo.selectIndex(i + 1)
            }
          }
        })
      }
    });
  }

  //FUENTE DE DATOS PARA EL LIST BOX TIPOS DE OFERTAS
  sourceScouts: any =
    {
      datatype: 'json',
      id: 'idScout',
      localdata:
        [
          { name: 'idScout', type: 'int' },
          { name: 'identificacion', type: 'string' },
          { name: 'nombresCompletos', type: 'string' },
          { name: 'tipoScout', type: 'string' },
          { name: 'direccion', type: 'string' },
          { name: 'celular', type: 'string' },
        ],
    };
  dataAdapterScouts: any = new jqx.dataAdapter(this.sourceScouts);

  listarScouts() {
    if (!this.comboRama.val()) {
      return;
    }
    this.ScoutService.getListarScouts(this.comboGrupo.val()).subscribe(data => {
      this.sourceScouts.localdata = data;
      this.dataAdapterScouts.dataBind();
      this.checkScuots()
      this.comboRama.disabled(true)
      this.comboGrupo.disabled(true)
    });
  }

  checkScuots() {
    if (this.AsistenciaAng) {
      let detalleAsistencias = this.AsistenciaAng.detalleAsistencias
      for (let i = 0; i < detalleAsistencias.length; i++) {
        this.listBoxScouts.checkItem(detalleAsistencias[i].idScout)
      }
    }
  }

  checkChange(event: any): void {
    let varIdAsistencia: any
    let banderaEsta: boolean
    if (this.AsistenciaAng) {
      varIdAsistencia = this.AsistenciaAng.id
      let detalleAsistencias = [];
      detalleAsistencias = this.AsistenciaAng.detalleAsistencias
      banderaEsta = false
      for (let i = 0; i < detalleAsistencias.length; i++) {
        if (detalleAsistencias[i].idScout == event.args.value) {
          banderaEsta = true
          if (detalleAsistencias[i].id != null) {
            if (event.args.checked) {
              // detalleAsistencias[i].estado = 'A'
              detalleAsistencias[i].asistio = true
            } else {
              detalleAsistencias[i].estado = 'I'
              // detalleAsistencias[i].asistio = false
            }
          }
          else {
            if (!event.args.checked)
              detalleAsistencias.splice(i, i);
          }
        }
      }
      if (banderaEsta == false) {
        if (event.args.checked) {
          let detalleAsistencia = {
            "id": null, "idAsistencia": varIdAsistencia, "idScout": event.args.value, "asistio": true,
            "estado": "A", "version": 0
          };
          detalleAsistencias.push(detalleAsistencia);
        }
      }
      this.AsistenciaAng.detalleAsistencias = detalleAsistencias
    }
  }


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

  //FUENTE DE DATOS PARA EL COMBOBOX DE ACTIVIDADES
  sourceActividades: any =
    {
      datatype: 'json',
      id: 'idActividad',
      localdata:
        [
          { name: 'idActividad', type: 'string' },
          { name: 'codigo', type: 'string' },
          { name: 'actividad', type: 'string' },
          { name: 'descripcion', type: 'string' },
        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE ACTIVIDADES
  dataAdapterActividades: any = new jqx.dataAdapter(this.sourceActividades);

  listarActividades() {
    this.ScoutService.getListarActividades().subscribe(data => {
      this.sourceActividades.localdata = data;
      this.dataAdapterActividades.dataBind();
    })
  }

  //Reglas de validación formulario
  rules =
    [
      { input: '.observacionInput', message: 'Observación requerida!', action: 'keyup, blur', rule: 'required' },
      { input: '.observacionInput', message: 'Observación deben tener entre 10 e 100 caracteres!', action: 'keyup', rule: 'length=10,100' },
      {
        input: '.fechaActividadInput', message: 'Solo se puede registrar asistencia de actividades realizadas hast 3 dias atrás!', action: 'keyup',
        rule: (input: any, commit: any): any => {
          return (this.validaFechaAsistencia(this.dateActividad.value()));
        }
      },
      {
        input: '.actividadInput', message: 'Seleccione una actividad', action: 'change',
        rule: (input: any, commit: any): any => {
          if (!this.comboActividad.val()) { return false; };
        }
      },
      {
        input: '.ramaInput', message: 'Seleccione una Rama', action: 'change',
        rule: (input: any, commit: any): any => {
          if (!this.comboRama.val()) { return false; };
        }
      },
      {
        input: '.grupoInput', message: 'Seleccione Grupo', action: 'change',
        rule: (input: any, commit: any): any => {
          if (!this.comboGrupo.val()) { return false; };
        }
      }
    ];

  validaFechaAsistencia(fecha: any) {
    let fecha_actual = new Date();
    let year = fecha_actual.getFullYear()
    let mes = fecha_actual.getMonth() + 1
    let diaFrom = fecha_actual.getDate() - 3
    let diaTo = fecha_actual.getDate()
    let date = new Date(fecha)
    let result = date.getFullYear() == year && date.getMonth() + 1 == mes &&
      (date.getDate() >= diaFrom && date.getDate() <= diaTo);
    return result;
  }

  validaDatos(): boolean {
    let valido = true
    if (!this.txtAreaObservacion.val()) {
      valido = false
      return valido
    }
    if (!this.validaFechaAsistencia(this.dateActividad.value())) {
      valido = false
      return valido
    }
    if (!this.comboActividad.val() || !this.comboGrupo.val() || !this.comboRama.val()) {
      valido = false
      return valido
    }
    return valido
  }


}
