import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxCheckBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcheckbox';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';

@Component({
  selector: 'app-periodo-configuracion',
  templateUrl: './periodo-configuracion.component.html',
  styleUrls: ['./periodo-configuracion.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PeriodoConfiguracionComponent implements OnInit {

  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  // @ViewChild('eventLog', { read: false }) eventLog: ElementRef;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('comboReglamento') comboReglamento: jqxComboBoxComponent;
  @ViewChild('dateDesdeOrd') dateDesdeOrd: jqxDateTimeInputComponent;
  @ViewChild('dateHastaOrd') dateHastaOrd: jqxDateTimeInputComponent;
  @ViewChild('dateDesdeExtra') dateDesdeExtra: jqxDateTimeInputComponent;
  @ViewChild('dateHastaExtra') dateHastaExtra: jqxDateTimeInputComponent;
  @ViewChild('dateDesdeEsp') dateDesdeEsp: jqxDateTimeInputComponent;
  @ViewChild('dateHastaEsp') dateHastaEsp: jqxDateTimeInputComponent;
  @ViewChild('checkNivel') checkNivel: jqxCheckBoxComponent;
  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private matriculasService: MatriculasService,
    private validadorService: ValidadorService,
  ) { }


  idMatriculaGeneralpar: number;
  tipoMovilidad: Array<any>;
  subtipoMovilidad: number;
  sub: Subscription;
  pojoMatriculaGeneral: any;
  tipoMatriculaFechasAng: any;
  matriculageneralAng: any;
  idPeriodoAcademicoGlobal: number;
  labelPeriodoAcademico: string;
  validacionGeneralAng: any;
  
  //variables usadas para recuperar los datos en la edición
  varDesdeOrd: any = new Date();
  varHastaOrd: any = new Date();
  varDesdeExt: any = new Date();
  varHastaExt: any = new Date();
  varDesdeEsp: any = new Date();
  varHastaEsp: any = new Date();

  opcion: string

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.idMatriculaGeneralpar = params['idMatriculaGeneral'];
      // Evalua si el parametro id se paso.
      if (this.idMatriculaGeneralpar) {
        this.recuperarUltimoPeriodoAcademico()
        this.listarTipoMatricula()
        this.listarReglamentosMatricula()
        if (this.idMatriculaGeneralpar != 0) {
          this.recuperarMatriculaGeneral(this.idMatriculaGeneralpar)
          this.opcion ='Edición '
        }else{
          this.opcion ='Creación '
        }
      }
    });
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
    this.router.navigate(['/matriculas/periodo-matricula']);
  }

  itemclick(event: any): void {
    var opt = event.args.innerText;
    switch (opt) {
      case 'Grabar':
        this.generarJsonMatriculaGeneral(this.idMatriculaGeneralpar)
        if (this.comboReglamento.val()) {
          if (!this.controlarFechasFormulario()) {
            this.myModal.alertQuestion({
              title: 'Configuración de Periodo de Matrícula',
              msg: 'Desea grabar sus registros?',
              result: (k) => {
                if (k) {
                  this.matriculasService.grabarMatriculaGeneral(this.matriculageneralAng).subscribe(result => {
                    this.gotoList();
                  }, error => console.error(error));
                  this.myValidator.hide();
                }
              }
            })

          }
        } else {
          this.myModal.alertMessage({ title: 'Configuración de Periodo de Matrícula', msg: 'Seleccione un Reglamento!' });
          this.myValidator.validate(document.getElementById('formMovilidad'));
        }
        break;
      case 'Cancelar':
        this.gotoList();
        break;
      default:
    }
  };

  generarJsonMatriculaGeneral(idMatriculaGeneral: number) {
    if (idMatriculaGeneral != 0) {
      this.recuperarMatriculaGeneral(idMatriculaGeneral)
    }
    let datosMatriculaGeneral: any = {};
    let varIdMatriculaGeneral: any
    if (this.pojoMatriculaGeneral) {
      varIdMatriculaGeneral = this.pojoMatriculaGeneral.id
    } else {
      varIdMatriculaGeneral = null
    }
    // genera la matricula general
    datosMatriculaGeneral['id'] = null;
    datosMatriculaGeneral['idPeriodoAcademico'] = this.idPeriodoAcademicoGlobal
    datosMatriculaGeneral['idReglamento'] = this.comboReglamento.val();
    datosMatriculaGeneral['matriculaNivel'] = this.checkNivel.val()
    datosMatriculaGeneral['fechaDesde'] = this.dateDesdeOrd.value();
    datosMatriculaGeneral['fechaHasta'] = this.dateHastaEsp.value();
    datosMatriculaGeneral['estado'] = "A";
    datosMatriculaGeneral['usuarioIngresoId'] = "1";
    datosMatriculaGeneral['version'] = 0;
    datosMatriculaGeneral['tipoMatriculaFechas'] = [];
    //generar detalleMovilidad
    let dataAdapter = this.dataAdapterTiposMatricula;
    let length = dataAdapter.records.length;
    for (let i = 0; i < length; i++) {
      let record = dataAdapter.records[i];
      let idTipoMatricula = record.idTipoMatricula
      let fechaDesde: Date
      let fechaHasta: Date
      if (record.codigoTipo == 'ORD') {
        fechaDesde = this.dateDesdeOrd.value()
        fechaHasta = this.dateHastaOrd.value()
      } else if (record.codigoTipo == 'EXT') {
        fechaDesde = this.dateDesdeExtra.value()
        fechaHasta = this.dateHastaExtra.value()
      } else {
        fechaDesde = this.dateDesdeEsp.value()
        fechaHasta = this.dateHastaEsp.value()
      }
      let datosTipoMatriculaFechas: any = {
        "id": null, "idMatriculaGeneral": varIdMatriculaGeneral, "idTipoMatricula": idTipoMatricula,
        "fechaDesde": fechaDesde, "fechaHasta": fechaHasta, "estado": "A", "usuarioIngresoId": "1", "version": 0
      };
      datosMatriculaGeneral['tipoMatriculaFechas'].push(datosTipoMatriculaFechas);
    }

    this.tipoMatriculaFechasAng = datosMatriculaGeneral['tipoMatriculaFechas']
    if (this.pojoMatriculaGeneral) {
      if (this.pojoMatriculaGeneral.tipoMatriculaFechas.length == 0) {
        this.pojoMatriculaGeneral.tipoMatriculaFechas = datosMatriculaGeneral['tipoMatriculaFechas']
      }
      this.pojoMatriculaGeneral.matriculaNivel = this.checkNivel.val()
      this.matriculageneralAng = this.pojoMatriculaGeneral
    } else {
      this.matriculageneralAng = datosMatriculaGeneral
    }
  }

  recuperarMatriculaGeneral(idMatriculaGeneral: number) {
    this.matriculasService.getRecuperarMatriculaGeneral(idMatriculaGeneral).subscribe((datos: any) => {
      if (datos) {
        this.comboReglamento.selectItem(datos.idReglamento)
        this.checkNivel.checked(datos.matriculaNivel)
        this.pojoMatriculaGeneral = datos
        let dataAdapter = this.dataAdapterTiposMatricula;
        for (let i = 0; i < datos.tipoMatriculaFechas.length; i++) {
          if (datos) {
            let length = dataAdapter.records.length;
            for (let j = 0; j < length; j++) {
              let record = dataAdapter.records[j];
              let idTipoMatricula = record.idTipoMatricula
              if (idTipoMatricula == datos.tipoMatriculaFechas[i].idTipoMatricula) {
                if (record.codigoTipo == 'ORD') {
                  this.varDesdeOrd = new Date(datos.tipoMatriculaFechas[i].fechaDesde);
                  // console.log(datos.tipoMatriculaFechas[i].fechaDesde)
                  this.varHastaOrd = new Date(datos.tipoMatriculaFechas[i].fechaHasta);
                } else if (record.codigoTipo == 'EXT') {
                  this.varDesdeExt = new Date(datos.tipoMatriculaFechas[i].fechaDesde);
                  this.varHastaExt = new Date(datos.tipoMatriculaFechas[i].fechaHasta);
                } else {
                  this.varDesdeEsp = new Date(datos.tipoMatriculaFechas[i].fechaDesde);
                  this.varHastaEsp = new Date(datos.tipoMatriculaFechas[i].fechaHasta);
                }
              }
            }
          }
        }
      }
    });
  }
  valueChangedDesdeOrd() {
    this.setearNuevaFechaPojo('desdeOrd')
  }
  valueChangedHastaOrd() {
    this.setearNuevaFechaPojo('hastaOrd')
  }
  valueChangedDesdeExt() {
    this.setearNuevaFechaPojo('desdeExtra')
  }
  valueChangedHastaExt() {
    this.setearNuevaFechaPojo('hastaExtra')
  }
  valueChangedDesdeEsp() {
    this.setearNuevaFechaPojo('desdeEsp')
  }
  valueChangedHastaEsp() {
    this.setearNuevaFechaPojo('hastaEsp')
  }

  setearNuevaFechaPojo(identificador: string) {
    // alert(JSON.stringify(event.args.value));
    // if(!this.controlarFechasFormulario()){
    if (this.pojoMatriculaGeneral) {
      let registrosTipoMatriculaFechas = []
      registrosTipoMatriculaFechas = this.pojoMatriculaGeneral.tipoMatriculaFechas
      let dataAdapter = this.dataAdapterTiposMatricula;
      for (let i = 0; i < registrosTipoMatriculaFechas.length; i++) {
        let length = dataAdapter.records.length;
        for (let j = 0; j < length; j++) {
          let record = dataAdapter.records[j];
          let idTipoMatricula = record.idTipoMatricula
          if (idTipoMatricula == registrosTipoMatriculaFechas[i].idTipoMatricula) {
            if (record.codigoTipo == 'ORD') {
              if (identificador == 'desdeOrd') {
                let desdeOrd: Date
                desdeOrd = this.dateDesdeOrd.value();
                registrosTipoMatriculaFechas[i].fechaDesde = desdeOrd
                this.pojoMatriculaGeneral.fechaDesde= desdeOrd
              } else if (identificador == 'hastaOrd') {
                let hastaOrd: Date
                hastaOrd = this.dateHastaOrd.value();
                registrosTipoMatriculaFechas[i].fechaHasta = hastaOrd
              }
            }
            else if (record.codigoTipo == 'EXT') {
              if (identificador == 'desdeExtra') {
                let desdeExt: Date
                desdeExt = this.dateDesdeExtra.value();
                registrosTipoMatriculaFechas[i].fechaDesde = desdeExt
              } else if (identificador == 'hastaExtra') {
                let hastaExt: Date
                hastaExt = this.dateHastaExtra.value();
                registrosTipoMatriculaFechas[i].fechaHasta = hastaExt
              }
            } else if (record.codigoTipo == 'ESP') {
              if (identificador == 'desdeEsp') {
                let desdeEsp: Date
                desdeEsp = this.dateDesdeEsp.value();
                registrosTipoMatriculaFechas[i].fechaDesde = desdeEsp
              } else if (identificador == 'hastaEsp') {
                let hastaEsp: Date
                hastaEsp = this.dateHastaEsp.value();
                registrosTipoMatriculaFechas[i].fechaHasta = hastaEsp
                this.pojoMatriculaGeneral.fechaHasta = hastaEsp
              }
            }
          }
        }
      }
      this.pojoMatriculaGeneral.tipoMatriculaFechas = registrosTipoMatriculaFechas
    }
    // }
  }

  // setearEncabezadoMovilidad(): void {
  //   let opcion1: string
  //   if (this.idMatriculaGeneralpar == 0){
  //     opcion1 = 'Creación '
  //     this.opcion ='Creación '
  //   }
  //   else{
  //     opcion1 = 'Edición '
  //     this.opcion ='Edición '
  //   }
  //   this.eventLog.nativeElement.innerHTML = '<div>' + opcion1 + ' del Periodo de Matrícula ' + this.labelPeriodoAcademico + '</div>'
  // }


  //FUENTE DE DATOS PARA EL COMBOBOX DE REGLAMENTO DE MATRICULA
  sourceReglamentoMatricula: any =
    {
      datatype: 'json',
      id: 'idReglamento',
      localdata:
        [
          { name: 'idReglamento', type: 'int' },
          { name: 'nombreReglamento', type: 'string' },
          { name: 'codigoTipoReglamento', type: 'string' },
          { name: 'codigoTipoOferta', type: 'string' }
        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE TIPO DE MOVILIDAD
  dataAdapterReglamentoMatricula: any = new jqx.dataAdapter(this.sourceReglamentoMatricula);

  listarReglamentosMatricula() {
    this.matriculasService.getListarReglamentosMatricula().subscribe(data => {
      this.sourceReglamentoMatricula.localdata = data;
      this.dataAdapterReglamentoMatricula.dataBind();
    })
  }


  //FUENTE DE DATOS PARA TIPOS DE MATRICULA
  sourceTiposMatricula: any =
    {
      datatype: 'json',
      id: 'idTipoMatricula',
      localdata:
        [
          { name: 'idTipoMatricula', type: 'int' },
          { name: 'codigoTipo', type: 'string' },
          { name: 'nombreTipoMatricula', type: 'string' }

        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE TIPO DE MOVILIDAD
  dataAdapterTiposMatricula: any = new jqx.dataAdapter(this.sourceTiposMatricula);

  listarTipoMatricula() {
    this.matriculasService.getListarTiposMatricula().subscribe(data => {
      this.sourceTiposMatricula.localdata = data;
      this.dataAdapterTiposMatricula.dataBind();
    })
  }

  recuperarUltimoPeriodoAcademico() {
    this.matriculasService.getRecuperarUltimoPeriodoAcademico().subscribe(data => {
      this.idPeriodoAcademicoGlobal = data[0].idPeriodoAcademico;
      this.labelPeriodoAcademico = data[0].codigoPeriodo
      // this.setearEncabezadoMovilidad()
    })
  }

    // FUENTE DE DATOS PARA EL DATAGRID
    sourceValidacionesReglamento: any =
    {
      datatype: 'array',
      // id: 'id',
      datafields:
        [
          { name: 'id', type: 'number' },
          { name: 'idReglamento', type: 'number' },
          { name: 'codigo', type: 'string' },
          { name: 'descripcion', type: 'string' },
          { name: 'valor', type: 'number' },
          { name: 'estado', type: 'string' },
          { name: 'usuarioIngresoId', type: 'string' },
          { name: 'version', type: 'number' }
        ],
      hierarchy:
      {
        keyDataField: { name: 'id' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterValidacionesReglamento: any = new jqx.dataAdapter(this.sourceValidacionesReglamento);

  recuperarValidacionesReglamento() {
    if (this.comboReglamento.val() == "") {
      return;
    }
    this.matriculasService.getRecuperarReglamentoPojo(this.comboReglamento.val()).subscribe(data => {
      if (data) {
        if (data.reglamentoValidaciones.length > 0) {
          this.sourceValidacionesReglamento.localdata = data.reglamentoValidaciones;
          this.dataAdapterValidacionesReglamento.dataBind();
        }
      }
    });
  }
  columnasValidacion: any[] =
  [
    { text: 'Id Reg Validacion', datafield: 'id', width: '7%', hidden: true },
    { text: 'id Reglamento', datafield: 'idReglamento', width: '7%', hidden: true },
    { text: 'Código', datafield: 'codigo', width: '15%', createeditor: (row: number, cellvalue: any, editor: any): void => {
        editor.jqxInput({ maxLength: 5 });
      }, 
    },
    { text: 'Nombre Validacion', datafield: 'descripcion', width: '70%', createeditor: (row: number, cellvalue: any, editor: any): void => {
        editor.jqxInput({ maxLength: 35 });
      }, 
    },
    { text: 'Valor', datafield: 'valor', width: '15%', cellsalign: 'right', inputmode: 'simple', cellsformat: 'd2',
      createeditor: (row: number, cellvalue: any, editor: any): void => {
        editor.jqxNumberInput({ digits: 3 });
      },
      validation: (cell: any, value: number): any => {
        if (value < 1 || value > 100) {
          return { result: false, message: 'El valor debe  estar en el rango 1-100 ' };
        }
        return true;
      }
    },
    { text: 'Estado', datafield: 'estado', width: '10%',hidden: true }
  ];
localization: any = getLocalization('es');


  controlarFechasFormulario(): boolean {
    if (this.validadorService.validarFechas(this.dateDesdeOrd.value(), this.dateHastaOrd.value())) {
      this.myModal.alertMessage({
        title: 'Configuración de Periodo de Matrícula',
        msg: 'La fecha Hasta del Periodo Ordinario debe ser posterior a la fecha desde!'
      })
      return true;
    }
    if (this.validadorService.validarFechas(this.dateDesdeOrd.value(), this.dateHastaOrd.value(), true)) {
      this.myModal.alertMessage({
        title: 'Configuración de Periodo de Matrícula',
        msg: 'El Periodo Ordinario no puede aperturarse y cerrarse el mismo día!'
      })
      return true;
    }
    if (this.validadorService.validarFechas(this.dateHastaOrd.value(), this.dateDesdeExtra.value())) {
      this.myModal.alertMessage({
        title: 'Configuración de Periodo de Matrícula',
        msg: 'La fecha Desde del Periodo Extraordinario debe ser posterior a la fecha hasta del Periodo Ordinario!'
      })
      return true;
    }
    if (this.validadorService.validarFechas(this.dateHastaOrd.value(), this.dateDesdeExtra.value(), true)) {
      this.myModal.alertMessage({
        title: 'Configuración de Periodo de Matrícula',
        msg: 'La fecha Desde del Periodo Extraordinario no puede ser igual que la fecha hasta del Periodo Ordinario!'
      })
      return true;
    }
    if (this.validadorService.validarFechas(this.dateDesdeExtra.value(), this.dateHastaExtra.value(), true)) {
      this.myModal.alertMessage({
        title: 'Configuración de Periodo de Matrícula',
        msg: 'El Periodo Extraordinario no puede aperturarse y cerrarse el mismo día!'
      })
      return true;
    }
    if (this.validadorService.validarFechas(this.dateDesdeExtra.value(), this.dateHastaExtra.value())) {
      this.myModal.alertMessage({
        title: 'Configuración de Periodo de Matrícula',
        msg: 'La fecha Hasta del Periodo Extraordinario debe ser posterior a la fecha desde!'
      })
      return true;
    }
    if (this.validadorService.validarFechas(this.dateHastaExtra.value(), this.dateDesdeEsp.value())) {
      this.myModal.alertMessage({
        title: 'Configuración de Periodo de Matrícula',
        msg: 'La fecha Desde del Periodo Especial debe ser posterior a la fecha hasta del Periodo Extraordinario!'
      })
      return true;
    }
    // alert(this.dateDesdeEsp.value()+ this.dateHastaEsp.value())
    if (this.validadorService.validarFechas(this.dateDesdeEsp.value(), this.dateHastaEsp.value())) {
      this.myModal.alertMessage({
        title: 'Configuración de Periodo de Matrícula',
        msg: 'La fecha Hasta del Periodo Especial debe ser posterior a la fecha desde!'
      })
      return true;
    }
    if (this.validadorService.validarFechas(this.dateHastaEsp.value(), this.dateDesdeEsp.value(), true)) {
      this.myModal.alertMessage({
        title: 'Configuración de Periodo de Matrícula',
        msg: 'El Periodo Especial no puede aperturarse y cerrarse el mismo día!'
      })
      return true;
    }
  }

}
