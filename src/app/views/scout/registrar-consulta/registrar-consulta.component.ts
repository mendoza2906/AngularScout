import { Component, ViewChild, ViewEncapsulation, ElementRef, OnDestroy, OnInit, AfterViewInit, ɵConsole } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';

import { ValidadorService } from '../../../services/validacion/validador.service';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';
import { ScoutService } from '../../../services/scout/scout.service';

@Component({
  selector: 'app-registrar-consulta',
  templateUrl: './registrar-consulta.component.html',
  styleUrls: ['./registrar-consulta.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrarConsultaComponent implements OnInit, AfterViewInit {
  @ViewChild('myInputFechaDesde') myInputFechaDesde: jqxDateTimeInputComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('comboEstadoCita') comboEstadoCita: jqxComboBoxComponent;
  @ViewChild('gridDetalleConsulta', { read: false }) gridDetalleConsulta: jqxGridComponent;
  @ViewChild('txtObservacion') txtObservacion: jqxTextAreaComponent;
  @ViewChild('txtDiagnostico') txtDiagnostico: jqxInputComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public messagerService: MessagerService,
    private consultorioService: ScoutService,
    private validadorService: ValidadorService) { }

  sub: Subscription;
  adapterProcedimientos: any;
  editrow: number = -1;
  procedimientosTemp = new Array();
  detallesTemp = new Array();
  consultaAng: any = {};
  detalleConsultaAng: any = {};
  citaRec: any = {};
  idCitaPar: number;
  idConsultaPar: number;
  labelOpcion: string;
  labelPaciente: string;
  labelMedico: string;
  labelFecha: string;
  labelHora: string;
  labelMotivoConsulta: string;

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.idCitaPar = params['idCita'];
      this.idConsultaPar = params['idConsulta'];
      // Evalua si el parametro id se paso.
      this.listarProcedimientos()
      this.recuperarDatosCita()
      if (this.idCitaPar) {
        if (this.idConsultaPar != 0) {
          this.labelOpcion = 'Edición '
          this.recuperarConsulta(this.idConsultaPar)
          // this.recuperarCombosGrilla()
        } else {
          this.labelOpcion = 'Creación '
          this.nuevaConsulta()
        }
      }
    });
  }

  ngAfterViewInit(): void {

  }


  //datos de jqxMenu
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

  // prepare the data
  source1 = {
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
    // create data adapter and perform data
    return new jqx.dataAdapter(this.source1, { autoBind: true });
  };
  menus = this.getAdapter(this.source1).getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);
  itemclick(event: any): void {
    //this.eventLog.nativeElement.innerHTML = 'Id: ' + event.args.id + ', Text: ' + event.args.innerText;
    var opt = event.args.innerText;
    switch (opt) {
      case 'Grabar':
        this.generarDetalleConsulta()
        if (!this.txtDiagnostico && !this.txtObservacion) {
          this.myModal.alertMessage({ title: 'Registro de Consultas', msg: 'Proporcione todos los campos requeridos!' });
        } else if (!this.validarCamposDetalleConsulta()) {
          // this.myModal.alertMessage({ title: 'Registro de Consultas', msg: 'Proporcione todos los campos requeridos!' });
          // }else{
          this.myModal.alertQuestion({
            title: 'Registro de Consultas',
            msg: '¿Desea grabar esta consulta?',
            result: (k) => {
              if (k) {
                this.consultorioService.grabarCita(this.citaRec).subscribe(result => {
                }, error => console.error(error));
                this.consultorioService.grabarConsulta(this.consultaAng).subscribe(result => {
                  this.gotoList();
                }, error => console.error(error));
              }
            }
          })
        }

        break;
      case 'Cancelar':
        this.gotoList();
        break;
      default:
    }
  };

  gotoList() {
    this.router.navigate(['consultorio/consulta-medica']);
  }

  recuperarDatosCita() {
    this.consultorioService.getRecuperarDatosCita(this.idCitaPar).subscribe(data => {
      console.log(JSON.stringify(data))
      this.labelPaciente = data[0].nombrePaciente
      this.labelMedico = data[0].nombreMedico
      this.labelMotivoConsulta = data[0].motivoConsulta
      this.labelHora = data[0].hora
    })
    this.consultorioService.getListarCitaId(this.idCitaPar).subscribe(data => {
      this.citaRec = data
      this.comboEstadoCita.val(data.estadoCita)
      let fechaCita = new Date(this.citaRec.fechaCita)
      let day = fechaCita.getDate()
      let month = fechaCita.getMonth() + 1
      let year = fechaCita.getFullYear()
      if (month < 10) {
        this.labelFecha = `${year}-0${month}-${day}`
      } else {
        this.labelFecha = `${year}-${month}-${day}`
      }
    })
  }

  recuperarConsulta(idConsulta: number) {
    this.consultorioService.getRecuperarConsultaId(idConsulta).subscribe(data => {
      if (data) {
        this.consultaAng = data;
        if (data.detallesConsulta.length > 0) {
          this.sourceDetalles.localdata = data.detallesConsulta;
          this.dataAdapterDetalles.dataBind();
          this.detalleConsultaAng = data.detallesConsulta
        }
        this.recuperarCombosGrilla()
      }
    });
  }

  recuperarCombosGrilla() {
    let rowsJson = this.gridDetalleConsulta.getrows()
    let dataAdapter = this.dataAdapteProcedimientos;
    let length = dataAdapter.records.length;
    let columnProcedi = this.gridDetalleConsulta.getcolumn('idProc');
    for (let i = 0; i < rowsJson.length; i++) {
      let idProcedimientoGRID = this.gridDetalleConsulta.getcellvalue(i, 'idProcedimiento')
      for (let j = 0; j < length; j++) {
        let record = dataAdapter.records[j];
        if (record.idProc == idProcedimientoGRID)
          this.gridDetalleConsulta.setcellvalue(i, columnProcedi.displayfield, record.descripcion)
      }
    }
  }

  generaterow(): any {
    let varIdConsulta: any
    if (this.idConsultaPar == 0)
      varIdConsulta = null
    else
      varIdConsulta = this.idConsultaPar
    let row = {
      "id": null, "idConsulta": varIdConsulta, "idProcedimiento": "", "cantidad": 1, "costo": 0,
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



  nuevaConsulta() {
    let varIdReglamento = null
    // genera la matricula general
    this.consultaAng.id = null;
    this.consultaAng.idCita = this.idCitaPar;
    this.consultaAng.estado = "A";
    this.consultaAng.usuarioIngresoId = "1";
    this.consultaAng.version = 0;
    this.consultaAng.detallesConsulta = [];
  }


  generarDetalleConsulta() {
    this.detallesTemp = []
    for (let i = 0; i < this.detallesTemp.length; i++) {
      if (this.detallesTemp[i].id == null) {
        this.detallesTemp.splice(0, this.detallesTemp.length);
      }
    }
    let dataAdapter = this.dataAdapterDetalles;
    let length = dataAdapter.records.length;
    for (let i = 0; i < length; i++) {
      let record = dataAdapter.records[i];
      // if (this.idCitaPar != 0) {
      //   let columnProc = this.gridDetalleConsulta.getcolumn('idProc');
      //   let idProc = this.gridDetalleConsulta.getcellvalue(i, columnProc.datafield);
      //   alert(idProc)
      //   record.idProcedimiento = idProc
      // }
      delete record.uid
      delete record.boundindex
      delete record.uniqueid
      delete record.visibleindex
      this.detallesTemp[this.detallesTemp.length] = record;
    }
    this.consultaAng.detallesConsulta = this.detallesTemp
  }


  //FUENTE DE DATOS PARA EL COMBOBOX DE PROCEDIMIENTO
  dataFieldsProcedimiento: any[] = [
    { name: 'idProc', type: 'string' },
    { name: 'codigo', type: 'string' },
    { name: 'descripcion', type: 'string' },
    { name: 'estado', type: 'string' },
    { name: 'tipoConcepto', type: 'string' },
  ];
  sourceProcedimientos: any = {
    id: 'idProc',
    datafields: this.dataFieldsProcedimiento,
    localData: [],

  };
  //CARGAR ORIGEN DEL COMBOBOX DE PROCEDIMIENTO
  dataAdapteProcedimientos: any = new jqx.dataAdapter(this.sourceProcedimientos);

  listarProcedimientos() {
    this.consultorioService.getListarProcedimientos().subscribe(data => {
      this.sourceProcedimientos.localdata = data;
      this.dataAdapteProcedimientos.dataBind();
    })
  }


  sourceEstadoCita = [{ "estado": "Atendido", "codigo": 'ATE' },
  { "estado": "Anulado", "codigo": 'ANU' },
  { "estado": "Pendiente", "codigo": 'PEN' },
  { "estado": "Atendiendose", "codigo": 'ATD' },
  { "estado": "Citado", "codigo": 'CIT' },
  { "estado": "Confirmado por Teléfono", "codigo": 'CON' },
  { "estado": "En sala de espera", "codigo": 'SAL' },
  { "estado": "No asiste", "codigo": 'NOA' },
  { "estado": "No confirmado", "codigo": 'NOC' }];

  generarDatosNuevos(): void {
    this.listarProcedimientos()
    let registrosProc = new Array();
    let dataAdapter = this.dataAdapteProcedimientos;
    let length = dataAdapter.records.length;
    registrosProc = dataAdapter.records

    let rowsJson = this.gridDetalleConsulta.getrows()
    for (let i = 0; i < length; i++) {
      let record = dataAdapter.records[i];
      for (let j = 0; j < rowsJson.length; j++) {
        let columnProc = this.gridDetalleConsulta.getcolumn('idProc');
        let idProcedimiento = this.gridDetalleConsulta.getcellvalue(j, 'idProcedimiento');
        let idComboProc = this.gridDetalleConsulta.getcellvalue(j, columnProc.datafield);
        if (record) {
          if (record.idProc == idComboProc || record.idProc == idProcedimiento) {
            registrosProc.splice(i, 1);
          }
        }
      }
    }

    let datasource = {
      datafields: this.dataFieldsProcedimiento,
      localdata: registrosProc
    }
    this.adapterProcedimientos = new jqx.dataAdapter(datasource);
  };

  //FUENTE DE DATOS PARA EL DATAGRID
  sourceDetalles: any =
    {
      // localdata: this.generateData(),
      datatype: 'array',
      datafields:
        [
          { name: 'id', type: 'number' },
          { name: 'idConsulta', type: 'number' },
          { name: 'idProcedimiento', type: 'number' },
          { name: 'cantidad', type: 'number' },
          { name: 'costo', type: 'number' },
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
  dataAdapterDetalles: any = new jqx.dataAdapter(this.sourceDetalles);

  columnsDetalles: any[] =
    [
      { text: 'id Consulta', datafield: 'idConsulta', width: '10%' },
      { text: 'id Detalle Consulta', datafield: 'id', width: '10%', hidden: false },
      { text: 'id Procedimiento', datafield: 'idProcedimiento', width: '10%', hidden: false },
      { text: 'Cantidad', datafield: 'cantidad', width: '10%', hidden: false },
      {
        text: 'Procedimiento', width: '40%', datafield: 'idProc', displayfield: 'descripcion',
        columntype: 'dropdownlist', editable: true,
        initeditor: (row: number, value: any, editor: any): void => {
          this.editrow = row;
          let dataRecord = this.gridDetalleConsulta.getrowdata(this.editrow)
          let idProcedimiento = dataRecord.idProcedimiento
          this.generarDatosNuevos()
          editor.jqxDropDownList({
            autoOpen: true, autoDropDownHeight: true, source: this.adapterProcedimientos, displayMember: 'descripcion',
            valueMember: 'idProc', animationType: 'slide', enableHover: true
          });
          editor.jqxDropDownList('selectItem', idProcedimiento);
        },
      },
      {
        text: 'Costo', datafield: 'costo', width: '20%', hidden: false, cellsformat: 'c2', editable: false,
        createeditor: (row: number, cellvalue: any, editor: any): void => {
          editor.jqxNumberInput({ decimalDigits: 2, digits: 3 });
        }
      },
    ];

  localization: any = getLocalization('es');

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
    let anadirBoton = jqwidgets.createInstance('#botonNuevo', 'jqxButton', { width: 130, value: 'Nuevo Registro', theme: 'material' });
    let borrarBoton = jqwidgets.createInstance('#botonEliminar', 'jqxButton', { width: 130, value: 'Eliminar Registro', theme: 'material' });

    anadirBoton.addEventHandler('click', () => {
      let datarow = this.generaterow();
      this.gridDetalleConsulta.addrow(null, datarow)
    })
    borrarBoton.addEventHandler('click', () => {
      let selectedrowindex = this.gridDetalleConsulta.getselectedrowindex()
      let rowscount = this.gridDetalleConsulta.getdatainformation().rowscount;
      if (selectedrowindex >= 0 && selectedrowindex < parseFloat(rowscount)) {
        let id = this.gridDetalleConsulta.getrowid(selectedrowindex);
        let filaEliminada = this.gridDetalleConsulta.getrowdatabyid(id)
        filaEliminada.estado = "I"
        delete filaEliminada.uid
        delete filaEliminada.boundindex
        delete filaEliminada.uniqueid
        delete filaEliminada.visibleindex
        if (filaEliminada.id != null) {
          this.procedimientosTemp[this.procedimientosTemp.length] = filaEliminada;
        }
        this.gridDetalleConsulta.deleterow(id);
      }
    })
  };

  validarCamposDetalleConsulta(): boolean {
    let rowsJson = this.gridDetalleConsulta.getrows()
    let varIdProcedimiento: any
    for (let i = 0; i < rowsJson.length; i++) {
      let cantidad = this.gridDetalleConsulta.getcellvalue(i, 'cantidad')
      let idProcedimientoGrid = this.gridDetalleConsulta.getcellvalue(i, 'idProcedimiento');
      let idDetalleConsulta = this.gridDetalleConsulta.getcellvalue(i, 'id');
      let columnProc = this.gridDetalleConsulta.getcolumn('idProc');
      let idProc = this.gridDetalleConsulta.getcellvalue(i, columnProc.datafield);
      if (idDetalleConsulta && idProcedimientoGrid)
        if (!idProc)
          varIdProcedimiento = idProcedimientoGrid
        else {
          this.gridDetalleConsulta.setcellvalue(i, 'idProcedimiento', idProc)
          varIdProcedimiento = idProc
        }
      else {
        this.gridDetalleConsulta.setcellvalue(i, 'idProcedimiento', idProc)
        varIdProcedimiento = idProc
      }

      if (!varIdProcedimiento) {
        this.myModal.alertMessage({
          title: 'Registro de Consultas',
          msg: 'No ha seleccionado correctamente un procedimiento en su detalle!'
        })
        return true;
      }
      if (!cantidad) {
        this.myModal.alertMessage({
          title: 'Registro de Consultas',
          msg: 'No ha ingresado una cantidad valida en su detalle!'
        })
        return true;
      }
    }
  }
}






