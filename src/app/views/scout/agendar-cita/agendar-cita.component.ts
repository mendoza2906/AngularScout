import { Router, ActivatedRoute } from '@angular/router';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';

import { OnInit, AfterViewInit, ElementRef, ViewChild, Component } from '@angular/core';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxwindow';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxdatetimeinput';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { jqxCalendarComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxcalendar';
import { ScoutService } from '../../../services/scout/scout.service';

@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-cita.component.html',
  styleUrls: ['./agendar-cita.component.scss']
})
export class AgendarCitaComponent implements OnInit, AfterViewInit {
  @ViewChild('eventLog') eventLog: ElementRef;
  @ViewChild('gridListaCitas') gridListaCitas: jqxGridComponent;
  // @ViewChild(ModalCitaComponent) modalCita: ModalCitaComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('comboEspecialidad', { read: false }) comboEspecialidad: jqxComboBoxComponent;
  @ViewChild('comboMedico') comboMedico: jqxComboBoxComponent;
  @ViewChild('comboPaciente') comboPaciente: jqxComboBoxComponent;
  @ViewChild('comboEstadoCita') comboEstadoCita: jqxComboBoxComponent;
  @ViewChild('comboHora') comboHora: jqxComboBoxComponent;
  @ViewChild('botonAnular') botonAnular: jqxButtonComponent;
  @ViewChild('botonAgregarNuevo') botonAgregarNuevo: jqxButtonComponent;
  @ViewChild('txtObservacion') txtObservacion: jqxTextAreaComponent;
  @ViewChild('dateFechaCita') dateFechaCita: jqxDateTimeInputComponent;
  @ViewChild('myWindow') myWindow: jqxWindowComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('txtMotivoConsulta') txtMotivoConsulta: jqxInputComponent;
  @ViewChild('myCalendar') myCalendar: jqxCalendarComponent;


  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private consultorioService: ScoutService,
    private validadorService: ValidadorService,
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
  citaAng: any = {};
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
  labelDisponibles: string;
  labelOcupados: string;
  labelHora: string;
  labelMedico: string;
  labelEstado: string;
  varFechaCalendario: string;
  varFechaCal: any = new Date();
  varFechaCita: any = new Date();
  ocultarLabels: boolean = false;
  ocultarComponente: boolean = true;
  ngOnInit() {
    this.listarEspecialidades();
    this.listarPacientes();

  }

  ngAfterViewInit(): void {
    // this.getStorageFormularioState();
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
    this.router.navigate(['consultorio/consulta-medica']);
  }

  itemclick(event: any): void {
    var opt = event.args.innerText;
    switch (opt) {
      case 'Grabar':
        this.myValidator.validate(document.getElementById('formCitas'));
        this.generarJsonGrabar()
        if (this.validaDatos()) {
          this.myValidator.hide();
          this.myModal.alertQuestion({
            title: 'Registro de Citas',
            msg: '¿Desea grabar este registro?',
            result: (k) => {
              if (k) {
                this.consultorioService.grabarCita(this.citaAng).subscribe(result => {
                  this.salir()
                  this.listarCitas()
                }, error => console.error(error));
              }
            }
          })
        } else {
          this.myModal.alertMessage({
            title: 'Registro de Citas',
            msg: 'Verifique que todos los campos esten llenados correctamente!'
          });
        }
        break;
      case 'Cancelar':
        this.myValidator.hide();
        this.salir();
        break;
      default:
    }
  };

  nuevaCita() {
    //PARA ARAMAR EL JASON CITA 
    this.txtMotivoConsulta.val('')
    this.txtObservacion.val('')
    this.comboPaciente.selectIndex(-1)
    this.citaAng = {};
    this.citaAng.id = null
    // this.citaAng.estadoCita = 'CIT'
    this.citaAng.estado = "A"
    this.citaAng.usuarioIngresoId = "1"
    this.citaAng.version = "0"
  }

  recuperarCita(idCita: number) {
    this.consultorioService.getListarCitaId(idCita).subscribe(data => {
      if (data) {
        this.citaAng = data;
        this.varFechaCita = new Date(data.fechaCita)
        this.comboEstadoCita.val(data.estadoCita)
        this.comboPaciente.val(data.idPaciente)
        this.comboHora.val(data.citaAng.idHora)
      }
    });
  }

  generarJsonGrabar() {
    let idCita = this.gridListaCitas.getcellvalue(this.rowindex, 'idCita')
    let idHora = this.gridListaCitas.getcellvalue(this.rowindex, 'idHora')
    if (!idCita) {
      this.citaAng.estadoCita = "CIT"
      this.citaAng.fechaCita = this.varFechaCal
      this.citaAng.idHora = idHora
    } else {
      this.citaAng.estadoCita = this.comboEstadoCita.val()
      this.citaAng.idHora = this.comboHora.val()
    }
  }

  valueChangedFechaCita() {
    let fechaCita: Date
    fechaCita = this.dateFechaCita.value()
    this.varFechaCita = fechaCita
    let day = this.varFechaCita.getDate()
    let month = this.varFechaCita.getMonth() + 1
    let year = this.varFechaCita.getFullYear()
    if (month < 10) {
      this.varFechaCalendario = `${year}-0${month}-${day}`
    } else {
      this.varFechaCalendario = `${year}-${month}-${day}`
    }
    let idHora = this.gridListaCitas.getcellvalue(this.rowindex, 'idHora')
    this.listarHoras(this.comboMedico.val(), this.varFechaCalendario, idHora)
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


  listarEspecialidades() {
    this.consultorioService.getListarEspecialidades().subscribe(data => {
      this.sourceEspecilidad.localdata = data;
      this.dataAdapterEspecialidad.dataBind();
    })

  }

  //FUENTE DE DATOS PARA EL COMBOBOX DE ESPECIALIDAD
  sourceEspecilidad: any =
    {
      datatype: 'json',
      id: 'id',
      localdata:
        [
          { name: 'id', type: 'string' },
          { name: 'descripcion', type: 'string' },
          { name: 'codigo', type: 'string' },
          { name: 'estado', type: 'string' }
        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE ESPECIALIDAD
  dataAdapterEspecialidad: any = new jqx.dataAdapter(this.sourceEspecilidad);

  listarMedicos() {
    this.consultorioService.getListarMedicos(this.comboEspecialidad.val()).subscribe(data => {
      this.sourceMedicos.localdata = data;
      this.dataAdapterMedicos.dataBind();
    })
  }

  //FUENTE DE DATOS PARA EL COMBOBOX DE MEDICO
  sourceMedicos: any =
    {
      datatype: 'json',
      id: 'idMedico',
      localdata:
        [
          { name: 'idPersona', type: 'int' },
          { name: 'idMedico', type: 'int' },
          { name: 'nombres', type: 'string' },
          // { name: 'estado', type: 'string' }

        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE MEDICO
  dataAdapterMedicos: any = new jqx.dataAdapter(this.sourceMedicos);

  listarPacientes() {
    this.consultorioService.getListarPacientes().subscribe(data => {
      this.sourcePacientes.localdata = data;
      this.dataAdapterPacientes.dataBind();
    })
  }

  //FUENTE DE DATOS PARA EL COMBOBOX DE PACIENTE
  sourcePacientes: any =
    {
      datatype: 'json',
      id: 'idPaciente',
      localdata:
        [
          { name: 'idPersona', type: 'int' },
          { name: 'idPaciente', type: 'int' },
          { name: 'nombres', type: 'string' },
        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE PACIENTE
  dataAdapterPacientes: any = new jqx.dataAdapter(this.sourcePacientes);

  listarHoras(idMedico: any, fechaCita: any, idHora: number) {
    this.consultorioService.getListarHoras(idMedico, fechaCita, idHora).subscribe(data => {
      this.sourceHoras.localdata = data;
      this.dataAdapterHoras.dataBind();
    })
  }

  salir() {
    this.myWindow.close()
    this.myCalendar.disabled(false)
    this.gridListaCitas.disabled(false)
    this.comboEspecialidad.disabled(false)
    this.comboMedico.disabled(false)
  }

  abrirBloquear() {
    this.myWindow.open()
    this.myCalendar.disabled(true)
    this.gridListaCitas.disabled(true)
    this.comboEspecialidad.disabled(true)
    this.comboMedico.disabled(true)
  }

  //FUENTE DE DATOS PARA EL COMBOBOX DE PACIENTE
  sourceHoras: any =
    {
      datatype: 'json',
      id: 'idHora',
      localdata:
        [
          { name: 'idHora', type: 'int' },
          { name: 'hora', type: 'string' },
          { name: 'orden', type: 'string' },
        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE PACIENTE
  dataAdapterHoras: any = new jqx.dataAdapter(this.sourceHoras);

  myCalendarEvent(event: any): void {
    let date = event.args.date;
    let fechaCalendario = new Date();
    this.varFechaCal = date
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    if (month < 10) {
      this.varFechaCalendario = `${year}-0${month}-${day}`
    } else {
      this.varFechaCalendario = `${year}-${month}-${day}`
    }
  }

  sourceListadoCitas: any =
    {
      datatype: 'array',
      id: 'idCita',
      datafields:
        [
          { name: 'idPersona', type: 'string' },
          { name: 'idCita', type: 'string' },
          { name: 'idPaciente', type: 'string' },
          { name: 'idMedico', type: 'string' },
          { name: 'idHora', type: 'string' },
          { name: 'horaCita', type: 'string' },
          { name: 'nombres', type: 'string' },
          { name: 'historialMedico', type: 'string' },
          { name: 'observacion', type: 'string' },
          { name: 'motivoConsulta', type: 'string' },
          { name: 'horaCita2', type: 'string' },
          { name: 'fechaCita', type: 'string' },
          { name: 'estadoCita', type: 'string' }
        ],
      hierarchy:
      {
        keyDataField: { name: 'idCita' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterListadoCitas: any = new jqx.dataAdapter(this.sourceListadoCitas);

  //Busca todas las oferta_distrbiutivo
  listarCitas() {
    if (!this.varFechaCalendario) {
      this.myModal.alertMessage({
        title: 'Registro de Citas',
        msg: 'Elija una fecha válida!'
      });
    } else if (!this.comboMedico.val()) {
      this.myModal.alertMessage({
        title: 'Registro de Citas',
        msg: 'Elija un médico!'
      });
    } else {
      this.consultorioService.getListarCitasFn(this.comboMedico.val(), this.varFechaCalendario).subscribe(data => {
        this.sourceListadoCitas.localdata = data;
        this.dataAdapterListadoCitas.dataBind();
        this.setearLabelCitas()
        this.gridListaCitas.gotopage(this.pageinformation.page)
      });
    }
  }

  mostrarVentanaRegistroCita(event: any) {
    let argss = event.args;
    let row = event.args.rowindex;
    argss.value;
    this.labelEstado = 'Citado'
    this.rowindex = argss.rowindex
    this.labelHora = this.gridListaCitas.getcellvalue(argss.rowindex, 'horaCita')
    let idCita = this.gridListaCitas.getcellvalue(argss.rowindex, 'idCita')
    let idHora = this.gridListaCitas.getcellvalue(argss.rowindex, 'idHora')
    this.listarHoras(this.comboMedico.val(), this.varFechaCalendario, idHora);
    if (idCita) {
      this.ocultarComponente = false
      this.ocultarLabels = true
      this.recuperarCita(idCita)
    } else {
      this.nuevaCita()
      this.ocultarComponente = true
      this.ocultarLabels = false
    }
    this.myWindow.title('Registrar Cita')
    // this.modalCita.formularioNuevo(idCita, idHora, this.comboEspecialidad.val());
    this.abrirBloquear()
  }

  obtenerLabel(event: any) {
    let args = event.args;
    this.labelMedico = args.item.label
  }

  setearLabelCitas() {
    let rowsJson = this.gridListaCitas.getrows()
    let contadorOcupados = 0;
    for (let i = 0; i < rowsJson.length; i++) {
      let idCita = this.gridListaCitas.getcellvalue(i, 'idCita')
      if (idCita) {
        contadorOcupados++
      }
    }
    this.labelDisponibles = String(rowsJson.length - contadorOcupados)
    this.labelOcupados = String(contadorOcupados)
  }

  //metodo de reinderizado de filas del grid
  rendergridrows = (params: any): any[] => {
    return params.data;
  }
  columnsCitas: any[] =
    [
      { text: 'id Cita', datafield: 'idCita', width: '5%' },
      { text: 'id Persona', datafield: 'idPersona', width: '5%', hidden: true },
      { text: 'id Paciente', datafield: 'idPaciente', width: '5%', hidden: true },
      { text: 'id Hora', datafield: 'idHora', width: '5%', hidden: false },
      { text: 'Hora', datafield: 'horaCita', width: '10%', hidden: false },
      { text: 'Número de Historia ', datafield: 'historialMedico', width: '10%', cellsalign: 'center', align: 'center' },
      { text: 'Paciente', datafield: 'nombres', width: '40%', cellsalign: 'left', align: 'left' },
      { text: 'Motivo ', datafield: 'motivoConsulta', width: '15%' },
      { text: 'Observacion', datafield: 'observacion', width: '10%', hidden: true },
      { text: 'Estado', datafield: 'estadoCita', width: '15%' },
    ];

  localization: any = getLocalization('es');
  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }
    return 850;
  }


  //Reglas de validación formulario
  rules =
    [
      { input: '.motConsInput', message: 'Motivo de Consulta requerido!', action: 'keyup, blur', rule: 'required' },
      { input: '.observacionInput', message: 'Observación requerida!', action: 'keyup, blur', rule: 'required' },
      { input: '.observacionInput', message: 'Observación debe contener solo letras!', action: 'keyup', rule: 'notNumber' },
      // { input: '.apellidosInput', message: 'Apellidos deben tener entre 3 e 30 caracteress!', action: 'keyup', rule: 'length=2,30' },
      // {
      //   input: '.generoInput', message: 'Seleccione Género', action: 'change',
      //   rule: (input: any, commit: any): any => {
      //     let selectedIndex = this.comboGenero.selectIndex
      //     if (selectedIndex) { return selectedIndex; };
      //   }
      // },
    ];


  validaDatos(): boolean {
    let valido = true

    if (!this.validadorService.validaDireccion(this.txtObservacion.val())) {
      valido = false
      return valido
    }
    if (!this.validadorService.validaDireccion(this.txtMotivoConsulta.val())) {
      valido = false
      return valido
    }
    //validar combos
    if ((!this.comboEstadoCita.val() && !this.citaAng.estadoCita)
      || (!this.comboHora.val() && !this.citaAng.idHora) || !this.comboPaciente.val()) {
      valido = false
      return valido
    }
    return valido
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



}
