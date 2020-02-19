import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { jqxNumberInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxnumberinput'
import { jqxDropDownListComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { jqxListBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
// import { VBModal } from 'bootstrap-vue'
// Note: Vue automatically prefixes the directive name with 'v-'


@Component({
  selector: 'app-edicion-reglamentos',
  templateUrl: './edicion-reglamentos.component.html',
  styleUrls: ['./edicion-reglamentos.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EdicionReglamentosComponent implements OnInit, AfterContentInit {

  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('comboTiposReglamento') comboTiposReglamento: jqxDropDownListComponent;
  @ViewChild('dateFechaAprobacion') dateFechaAprobacion: jqxDateTimeInputComponent;
  @ViewChild('dateHasta') dateHasta: jqxDateTimeInputComponent;
  @ViewChild('txtNombre') txtNombre: jqxInputComponent;
  @ViewChild('txtReglamentoNacional') txtReglamentoNacional: jqxInputComponent;
  @ViewChild('listBoxTiposOfertas') listBoxTiposOfertas: jqxListBoxComponent;
  @ViewChild('gridValidaciones') gridValidaciones: jqxGridComponent;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private matriculasService: MatriculasService,
    private validadorService: ValidadorService,
  ) { }

  sub: Subscription;
  pojoReglamento: any;
  // pojoValidacionGenerals: any;
  reglamentoTipoOfertasAng: any;
  reglamentoAng: any = {};
  validacionGeneralsAng: any = {};
  reglamentoValidacionesAng: any = {};
  idReglamentoPar: number;
  tipoMovilidad: Array<any>;
  subtipoMovilidad: number;
  labelOpcion: string;
  validacionesTemp = new Array();

  //variables usadas para recuperar los datos en la edición
  varFechaAprobacion: any = new Date();
  varHasta: any = new Date();
  //VARIABLE PARA EL ARCHIVO JSON ENTRANTE AL RECUPERAR PARA LA EDICION



  ngOnInit() {


  }

  ngAfterContentInit() {
    this.sub = this.route.params.subscribe(params => {
      this.idReglamentoPar = params['idReglamento'];
      // Evalua si el parametro id se paso.
      if (this.idReglamentoPar) {
        this.listarTipoReglamentos()
        this.listarTipoOfertas()
        if (this.idReglamentoPar != 0) {
          this.labelOpcion = 'Edición '
          this.editarReglamento(this.idReglamentoPar)
        } else {
          this.labelOpcion = 'Creación '
          this.nuevoReglamento()
        }
      }
    });
    this.gridValidaciones.createComponent(this.configuracionGrid)
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
    this.router.navigate(['/matriculas/creacion-reglamentos']);
  }

  itemclick(event: any): void {
    var opt = event.args.innerText;
    switch (opt) {
      case 'Grabar':
        if (!this.validarParametrosReglamento()) {
          if (!this.validarCamposValidaciones()) {
            this.generarJsonReglamento()
            this.generarValidacionesReglamento()
            this.myModal.alertQuestion({
              title: 'Reglamentos Institucionales',
              msg: 'Desea grabar sus registros?',
              result: (k) => {
                if (k) {
                  this.matriculasService.grabarReglamento(this.reglamentoAng).subscribe(result => {
                    this.gotoList();
                  }, error => console.error(error));
                }
              }
            })
            this.gridValidaciones.disabled(false)
            this.gridValidaciones.editable(true)
          }
        }
        break;
      case 'Cancelar':
        this.gotoList();
        break;
      default:
    }
  };

  generarJsonReglamento() {
    let varIdReglamento: any
    if (this.pojoReglamento) {
      varIdReglamento = this.pojoReglamento.id
      if (this.pojoReglamento.reglamentoTipoOfertas.length == 0) {
        let reglamentoTipoOfertas = [];
        let items = this.listBoxTiposOfertas.getCheckedItems()
        for (let i = 0; i < items.length; i++) {
          if (i < items.length) {
            this.reglamentoTipoOfertasAng = {
              "id": null, "idReglamento": varIdReglamento, "idTipoOferta": items[i].value,
              "estado": "A", "usuarioIngresoId": "1", "version": 0
            };
          }
          reglamentoTipoOfertas.push(this.reglamentoTipoOfertasAng);
        }
        this.pojoReglamento.reglamentoTipoOfertas = reglamentoTipoOfertas
      }
      this.reglamentoAng = this.pojoReglamento
    } else {
      this.nuevoReglamento()
    }
  }



  nuevoReglamento() {
    let varIdReglamento = null
    // genera la matricula general
    this.reglamentoAng['id'] = null;
    this.reglamentoAng['fechaAprobacionIes'] = this.dateFechaAprobacion.value();
    this.reglamentoAng['fechaHasta'] = this.dateHasta.value();
    this.reglamentoAng['estado'] = "A";
    this.reglamentoAng['usuarioIngresoId'] = "1";
    this.reglamentoAng['version'] = 0;
    // this.reglamentoAng['validacionGenerals'] = [];
    this.reglamentoAng['reglamentoTipoOfertas'] = [];

    let items = this.listBoxTiposOfertas.getCheckedItems()
    for (let i = 0; i < items.length; i++) {
      if (i < items.length) {
        this.reglamentoTipoOfertasAng = {
          "id": null, "idReglamento": varIdReglamento, "idTipoOferta": items[i].value,
          "estado": "A", "usuarioIngresoId": "1", "version": 0
        };
      }
      this.reglamentoAng['reglamentoTipoOfertas'].push(this.reglamentoTipoOfertasAng);
    }
  }

  checkChange(event: any): void {
    let varIdReglamento: any
    let banderaEsta: boolean
    if (this.pojoReglamento) {
      varIdReglamento = this.pojoReglamento.id
      let reglamentoTipoOfertas = [];
      reglamentoTipoOfertas = this.pojoReglamento.reglamentoTipoOfertas
      banderaEsta = false
      for (let i = 0; i < reglamentoTipoOfertas.length; i++) {
        if (reglamentoTipoOfertas[i].idTipoOferta == event.args.value) {
          banderaEsta = true
          if (reglamentoTipoOfertas[i].id != null) {
            if (event.args.checked)
              reglamentoTipoOfertas[i].estado = 'A'
            else
              reglamentoTipoOfertas[i].estado = 'I'
          }
          else {
            if (!event.args.checked)
              reglamentoTipoOfertas.splice(i, i);
          }
        }
      }
      if (banderaEsta == false) {
        if (event.args.checked) {
          let reglamentoTipoOferta = {
            "id": null, "idReglamento": varIdReglamento, "idTipoOferta": event.args.value,
            "estado": "A", "usuarioIngresoId": "1", "version": 0
          };
          reglamentoTipoOfertas.push(reglamentoTipoOferta);
        }
      }
      this.pojoReglamento.reglamentoTipoOfertas = reglamentoTipoOfertas
    }
  }

  valueChangedFechaAprobacion() {
    let fechaAprobacion: Date
    fechaAprobacion = this.dateFechaAprobacion.value();
    if (this.pojoReglamento) {
      this.pojoReglamento.fechaAprobacionIes = fechaAprobacion
    }
  }
  valueChangedHasta() {
    let hasta: Date
    hasta = this.dateHasta.value();
    if (this.pojoReglamento) {
      this.pojoReglamento.fechaHasta = hasta
    }

  }
  checkTiposOfertas() {
    if (this.pojoReglamento) {
      let reglamentoTipoOfertas = this.pojoReglamento.reglamentoTipoOfertas
      for (let i = 0; i < reglamentoTipoOfertas.length; i++) {
        this.listBoxTiposOfertas.checkItem(reglamentoTipoOfertas[i].idTipoOferta)
      }
    }
  }

  //FUENTE DE DATOS PARA EL COMBOBOX DE TIPOS DE REGLAMENTO
  sourceTiposReglamento: any =
    {
      datatype: 'json',
      id: 'idTipoReglamento',
      localdata:
        [
          { name: 'idTipoReglamento', type: 'string' },
          { name: 'descripcionTipo', type: 'string' },
          { name: 'codigoTipo', type: 'string' }
        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE TIPOS DE REGLAMENTO
  dataAdapterTiposReglamento: any = new jqx.dataAdapter(this.sourceTiposReglamento);

  listarTipoReglamentos() {
    this.matriculasService.getListarTipoReglamentos().subscribe(data => {
      this.sourceTiposReglamento.localdata = data;
      this.dataAdapterTiposReglamento.dataBind();
    })
  }

  //FUENTE DE DATOS PARA EL LIST BOX TIPOS DE OFERTAS
  sourceTiposOfertas: any =
    {
      datatype: 'json',
      id: 'idTipoOferta',
      localdata:
        [
          { name: 'idTipoOferta', type: 'string' },
          { name: 'descripcion', type: 'string' },
          { name: 'codigoTipoOferta', type: 'string' }
        ],
    };
  //CARGAR ORIGEN DEL  LIST BOX TIPOS DE OFERTAS 
  dataAdapterTiposOfertas: any = new jqx.dataAdapter(this.sourceTiposOfertas);

  listarTipoOfertas() {
    this.matriculasService.getListarTipoOfertas().subscribe(data => {
      this.sourceTiposOfertas.localdata = data;
      this.dataAdapterTiposOfertas.dataBind();
    })
  }


  editarReglamento(idReglamento: number) {
    this.matriculasService.getRecuperarReglamentoPojo(idReglamento).subscribe(data => {
      if (data) {
        this.pojoReglamento = data
        this.reglamentoAng = data
        this.checkTiposOfertas()
        if (data.reglamentoValidaciones.length > 0) {
          this.sourceValidacionesReglamento.localdata = data.reglamentoValidaciones;
          this.dataAdapterValidacionesReglamento.dataBind();
          this.reglamentoValidacionesAng = data.reglamentoValidaciones
        }
        this.varFechaAprobacion = new Date(data.fechaAprobacionIes);
        this.txtNombre.val(data.nombre)
        this.txtReglamentoNacional.val(data.reglamentoNacional)
        if (data.fechaHasta == null)
          this.varHasta = new Date()
        else
          this.varHasta = new Date(data.fechaHasta);
        this.comboTiposReglamento.val(data.idTipoReglamento)
      }
    });
  }


  validarParametrosReglamento(): boolean {
    if (!this.txtNombre.val() || !this.txtReglamentoNacional.val() || !this.comboTiposReglamento.val()) {
      this.myModal.alertMessage({
        title: 'Reglamentos Institucionales',
        msg: 'Verifique que todos campos requeridos se encuentren llenos correctamente!'
      })
      return true;
    }
    let items = this.listBoxTiposOfertas.getCheckedItems()
    if (items.length <= 0) {
      this.myModal.alertMessage({
        title: 'Reglamentos Institucionales',
        msg: 'Marque al menos un Tipo Oferta!'
      })
      return true;
    }
  }
  validarCamposValidaciones(): boolean {
    let rowsJson = this.gridValidaciones.getrows()
    for (let i = 0; i < rowsJson.length; i++) {
      let codigo = this.gridValidaciones.getcellvalue(i, 'codigo')
      let descripcion = this.gridValidaciones.getcellvalue(i, 'descripcion')
      let valor = this.gridValidaciones.getcellvalue(i, 'valor')
      if (!codigo) {
        this.myModal.alertMessage({
          title: 'Reglamentos Institucionales',
          msg: 'Existe una Validación sin Código!'
        })
        return true;
      }
      if (!descripcion) {
        this.myModal.alertMessage({
          title: 'Reglamentos Institucionales',
          msg: 'Existe una Validación sin Descripción!'
        })
        return true;
      }

      if (valor < 0 || valor > 100) {
        alert(valor + '' + i)
        this.myModal.alertMessage({
          title: 'Reglamentos Institucionales',
          msg: 'Existe una Validación sin Valor!'
        })
        return true;
      }
    }
  }

  generarValidacionesReglamento() {
    for (let i = 0; i < this.validacionesTemp.length; i++) {
      if (this.validacionesTemp[i].id == null) {
        this.validacionesTemp.splice(0, i);
      }
    }
    let dataAdapter = this.dataAdapterValidacionesReglamento;
    let length = dataAdapter.records.length;
    for (let i = 0; i < length; i++) {
      let record = dataAdapter.records[i];
      if (this.idReglamentoPar != 0) {
        record.idReglamento = this.idReglamentoPar
        record.codigo = record.codigo.toUpperCase()
        if (!record.valor)
          record.valor = 0
      }
      delete record.uid
      delete record.boundindex
      delete record.uniqueid
      delete record.visibleindex
      this.validacionesTemp[this.validacionesTemp.length] = record;
    }
    this.reglamentoAng.reglamentoValidaciones = this.validacionesTemp
  }

  generaterow(): any {
    let row = {
      "id": null, "idReglamento": null, "codigo": "", "descripcion": "", "valor": 0,
      "estado": "A", "usuarioIngresoId": "1", "version": 0
    };
    return row;
  }

  generateData(): any {
    let data = {};
    for (let i = 0; i < 1; i++) {
      let row = this.generaterow();
      data[i] = row;
    }
    return data;
  }

  rendertoolbar = (toolbar: any): void => {
    let container = document.createElement('div');
    container.style.margin = '5px';
    let botonNuevo = document.createElement('div');
    let botonEliminar = document.createElement('div');
    botonNuevo.id = 'botonNuevo';
    botonEliminar.id = 'botonEliminar';
    botonNuevo.style.cssText = 'float: left';
    botonEliminar.style.cssText = 'float: left; margin-left: 5px';
    container.appendChild(botonNuevo);
    container.appendChild(botonEliminar);
    toolbar[0].appendChild(container);
    let anadirBoton = jqwidgets.createInstance('#botonNuevo', 'jqxButton', { width: 130, value: 'Nuevo Registro', theme: 'darkblue' });
    let borrarBoton = jqwidgets.createInstance('#botonEliminar', 'jqxButton', { width: 130, value: 'Eliminar Registro', theme: 'darkblue' });

    anadirBoton.addEventHandler('click', () => {
      let datarow = this.generaterow();
      this.gridValidaciones.addrow(null, datarow)
    })
    borrarBoton.addEventHandler('click', () => {
      let selectedrowindex = this.gridValidaciones.getselectedrowindex()
      let rowscount = this.gridValidaciones.getdatainformation().rowscount;
      if (selectedrowindex >= 0 && selectedrowindex < parseFloat(rowscount)) {
        let id = this.gridValidaciones.getrowid(selectedrowindex);
        let filaEliminada = this.gridValidaciones.getrowdatabyid(id)
        filaEliminada.estado = "I"
        delete filaEliminada.uid
        delete filaEliminada.boundindex
        delete filaEliminada.uniqueid
        delete filaEliminada.visibleindex
        // alert(filaEliminada.id)
        if (filaEliminada.id != null) {
          //falta condicinon si esta repetido
          this.validacionesTemp[this.validacionesTemp.length] = filaEliminada;
        }
        this.gridValidaciones.deleterow(id);
      }
    })
  };

  recuperarValidacionesUltimoReglamento() {
    if (this.idReglamentoPar == 0) {
      this.matriculasService.getRecuperarValidacionesUltimoReglamento(this.comboTiposReglamento.val()).subscribe(data => {
        if (data.length > 0) {
          this.sourceValidacionesReglamento.localdata = data
          this.dataAdapterValidacionesReglamento.dataBind();
        } else {
          this.sourceValidacionesReglamento.localdata = ''
          this.dataAdapterValidacionesReglamento.dataBind();
        }
      });
    }
  }
  //FUENTE DE DATOS PARA EL DATAGRID
  sourceValidacionesReglamento: any =
    {
      localdata: this.generateData(),
      datatype: 'array',
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

  columnasValidacion: any[] =
    [
      { text: 'Id Reg Validacion', datafield: 'id', width: '7%', hidden: true },
      { text: 'id Reglamento', datafield: 'idReglamento', width: '7%', hidden: true },
      {
        text: 'Código', datafield: 'codigo', width: '10%', editable: true, createeditor: (row: number, cellvalue: any, editor: any): void => {
          editor.jqxInput({ maxLength: 5 })
        },
      },
      {
        text: 'Nombre Validacion', datafield: 'descripcion', width: '80%', editable: true,
        createeditor: (row: number, cellvalue: any, editor: any): void => {
          editor.jqxInput({ maxLength: 100, dropDownWidth: 200, width: 200 });
        },
      },
      {
        text: 'Valor', datafield: 'valor', width: '10%', cellsalign: 'right', cellsformat: 'd2', editable: true,
        validation: (cell: any, value: number): any => {
          if (value < 0 || value > 50) {
            return { result: false, message: 'El valor debe  estar en el rango 0-50 ' };
          }
          return true;
        }, createeditor: (row: number, cellvalue: any, editor: any): void => {
          editor.jqxNumberInput({ digits: 3, spinButtons: true });
        }
      },
      { text: 'Estado', datafield: 'estado', width: '10%', hidden: true }
    ];
  localization: any = getLocalization('es');

  configuracionGrid: jqwidgets.GridOptions = {
    theme: 'material',
    autoheight: false,
    columns: this.columnasValidacion,
    editable: true,
    height: 450,
    width: "'100%'",
    localization: this.localization,
    source: this.dataAdapterValidacionesReglamento,
    showcolumnheaderlines: true,
    showtoolbar: true,
    rendertoolbar: this.rendertoolbar,
    autoloadstate: false,
    selectionmode: 'singlecell',
    editmode: 'dblclick'
  }
}
