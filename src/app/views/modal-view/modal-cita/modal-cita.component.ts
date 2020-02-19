import { Component, ViewChild, ViewEncapsulation, OnInit, Output, ElementRef, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxvalidator';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';

import { ValidadorService } from '../../../services/validacion/validador.service';
import { ModalComponentComponent } from '../modal-component/modal-component.component';
import { ScoutService } from '../../../services/scout/scout.service';

@Component({
  selector: 'app-modal-cita',
  templateUrl: './modal-cita.component.html',
  styleUrls: ['./modal-cita.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalCitaComponent implements OnInit {

  @ViewChild('template') private template: ModalDirective;
  @ViewChild('templateQuestion') private templateQuestion: ModalDirective;
  @ViewChild('formNuevo') private formNuevo: ModalDirective;
  @ViewChild('myDiv') myDiv: ElementRef;
  @ViewChild('eventLog') eventLog: ElementRef;
  @ViewChild('comboEspecialidad', { read: false }) comboEspecialidad: jqxComboBoxComponent;
  @ViewChild('comboMedico') comboMedico: jqxComboBoxComponent;
  @ViewChild('comboPaciente') comboPaciente: jqxComboBoxComponent;
  @ViewChild('comboEstadoCita') comboEstadoCita: jqxComboBoxComponent;
  @ViewChild('comboHora') comboHora: jqxComboBoxComponent;
  @ViewChild('botonAnular') botonAnular: jqxButtonComponent;
  @ViewChild('botonAgregarNuevo') botonAgregarNuevo: jqxButtonComponent;
  @ViewChild('txtObservacion') txtObservacion: jqxTextAreaComponent;
  @ViewChild('dateFechaCita') dateFechaCita: jqxDateTimeInputComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('txtMotivoConsulta') txtMotivoConsulta: jqxInputComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;


  @Output() protected PassMethods = new EventEmitter();//variable para escuchar eventos del componente
  protected a: string;
  protected opcion: any = {};
  protected periodoCheck: any;


  //--------------------------------------------------------------------------------------

  /**Permite controlar que no salga del modal sin presionar algun boton de éste */
  protected config = { backdrop: true, ignoreBackdropClick: true };
  labelOpcion: string;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private consultorioService: ScoutService,
    private validadorService: ValidadorService,
  ) { }

  sub: Subscription;
  //Variable paa cargar datos del objeto 
  citaAng: any = {};
  editrow: number = -1;
  rowindex: number = -1;
  idPeriodoActualGlobal: any;
  banderaMatriculaActual: boolean;
  labelHora: string;
  labelMedico: string;
  labelEstado: string;
  varFechaCalendario: string;
  varFechaCal: any = new Date();
  varFechaCita: any = new Date();
  ocultarLabels: boolean = false;
  ocultarComponente: boolean = true;
  idCitaPar: number;

  ngOnInit() {
    this.listarEspecialidades();
    this.listarPacientes();

  }

  ngAfterViewInit(): void {

  }

  formularioNuevo(idCita: any, idHora: any, idEspecilidad: any) {
    this.listarMedicos(idEspecilidad)
    let date = this.dateFechaCita.value()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    if (month < 10) {
      this.varFechaCalendario = `${year}-0${month}-${day}`
    } else {
      this.varFechaCalendario = `${year}-${month}-${day}`
    }
    if (this.comboMedico.val())
      this.listarHoras(this.comboMedico.val(), this.varFechaCalendario, idHora);
    if (idCita) {
      this.ocultarComponente = false
      this.ocultarLabels = true
      this.buscarCita(idCita)
    } else {
      this.nuevaCita()
      this.labelEstado = 'Citado'
      this.ocultarComponente = true
      this.ocultarLabels = false
    }
    console.log(JSON.stringify(this.citaAng))
    this.formNuevo.show();//Muesta el modal
    this.formNuevo.config = this.config;//Establece las configuraciones para el modal
    this.PassMethods.subscribe((h) => {
      if (h.val == 'ok') {

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

  itemclick(event: any): void {
    var opt = event.args.innerText;
    switch (opt) {
      case 'Grabar':
        this.myValidator.validate(document.getElementById('formCitas'));
        if (this.validaDatos()) {
          this.myValidator.hide();
          this.myModal.alertQuestion({
            title: 'Registro de Citas',
            msg: '¿Desea grabar este registro?',
            result: (k) => {
              if (k) {
                this.consultorioService.grabarCita(this.citaAng).subscribe(result => {
                  this.formNuevo.hide()
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
        this.formNuevo.hide()
        break;
      default:
    }
  };

  buscarCita(idCita: number) {
    this.consultorioService.getListarCitaId(idCita).subscribe(data => {
      if (data) {
        this.editarCita(data)
      }
    });
  }

  nuevaCita() {
    //PARA ARAMAR EL JASON CITA 
    this.citaAng = {};
    this.citaAng.id = null
    this.citaAng.estadoCita = "CIT"
    this.citaAng.estado = "A"
    this.citaAng.usuarioIngresoId = "1"
    this.citaAng.version = "0"
    this.txtMotivoConsulta.val('')
    this.txtObservacion.val('')
    this.comboPaciente.selectIndex(-1)

  }

  editarCita(cita: any) {
    this.citaAng = cita;
    this.varFechaCita = new Date(this.citaAng.fechaCita)
    this.comboEstadoCita.val(this.citaAng.estadoCita)
    this.comboPaciente.val(this.citaAng.idPaciente)
    this.comboHora.val(this.citaAng.idHora)
  }

  valueChangedFechaCita() {
    let fechaCita: Date
    fechaCita = this.dateFechaCita.value()
    this.varFechaCita = fechaCita
    if (this.citaAng) {
      this.citaAng.fechaCita = fechaCita
    }
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

  listarMedicos(idEspecilidad: number) {
    this.consultorioService.getListarMedicos(idEspecilidad).subscribe(data => {
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

  obtenerLabel(event: any) {
    let args = event.args;
    this.labelMedico = args.item.label
  }

  obtenerLabelHora(event: any) {
    let args = event.args;
    this.labelHora = args.item.label
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
    if (!this.comboEstadoCita.val() || !this.comboHora.val() || !this.comboPaciente.val()) {
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


  alertMessage(opt: any): void {
    this.opcion.title = opt.title;
    this.opcion.msg = opt.msg;
    this.template.show();
    this.template.config = this.config
  }


  alertQuestion(opt: any) {
    this.opcion.title = opt.title;//Establece el titulo para el modal
    this.opcion.msg = opt.msg;//Establece el mensaje para el modal
    this.templateQuestion.show();//Muesta el modal
    this.templateQuestion.config = this.config;//Establece las configuraciones para el modal
    this.PassMethods.subscribe((t) => {
      if (t.val == 'ok') {
        opt.result('ok');
      }
    });
  }



}
