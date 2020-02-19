import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { jqxDropDownListComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxdatetimeinput';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { jqxMaskedInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxmaskedinput';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import { jqxCheckBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcheckbox';
import { jqxPasswordInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpasswordinput';

import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu';
import { ScoutService } from '../../../services/scout/scout.service';
@Component({
  selector: 'app-persona-edicion',
  templateUrl: './persona-edicion.component.html',
  styleUrls: ['./persona-edicion.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PersonaEdicionComponent implements OnInit, AfterContentInit {

  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('txtIdenficacion') txtIdenficacion: jqxInputComponent;
  @ViewChild('txtApellidos') txtApellidos: jqxInputComponent;
  @ViewChild('txtNombres') txtNombres: jqxInputComponent;
  @ViewChild('dateFechaNace') dateFechaNace: jqxDateTimeInputComponent;
  @ViewChild('comboGenero') comboGenero: jqxDropDownListComponent;
  @ViewChild('masketCelular') masketCelular: jqxMaskedInputComponent;
  @ViewChild('txtEmailPersonal') txtEmailPersonal: jqxInputComponent;
  @ViewChild('txtAreaDireccion') txtAreaDireccion: jqxTextAreaComponent;
  @ViewChild('txtHistorialMed') txtHistorialMed: jqxInputComponent;
  @ViewChild('comboTipoSangre') comboTipoSangre: jqxDropDownListComponent;
  @ViewChild('txtUsuario') txtUsuario: jqxInputComponent;
  @ViewChild('passwordInput') passwordInput: jqxPasswordInputComponent;
  @ViewChild('passwordInputCon') passwordInputCon: jqxPasswordInputComponent;
  @ViewChild('checkBoxValCedula') checkBoxValCedula: jqxCheckBoxComponent;
  @ViewChild('chbAlgeria') chbAlgeria: jqxCheckBoxComponent;
  @ViewChild('comboEspecialidad') comboEspecialidad: jqxComboBoxComponent;
  @ViewChild('jqxMenu') jqxMenu: jqxMenuComponent;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private consultorioService: ScoutService,
    private validadorService: ValidadorService,
  ) { }

  sub: Subscription;
  personaAng: any = {};
  paciente: any = {};
  medico: any = {};
  usuario: any = {};
  idPersonaPar: number;
  idTipoPar: string;
  idUltimaMalla: number;
  labelOpcion: string;
  labelPersona: string;
  valido: boolean
  ocultarEspecialidad: boolean
  ocultarElementosPaciente: boolean
  //variables usadas para recuperar los datos en la edición
  varFechaNacimiento: any = new Date();

  ngOnInit() {
    this.listarEspecialidades()
  }

  ngAfterContentInit() {
    this.sub = this.route.params.subscribe(params => {
      this.idPersonaPar = params['idPersona'];
      this.idTipoPar = params['tipo'];
      // Evalua si el parametro id se paso.
      if (this.idPersonaPar) {
        if (this.idTipoPar == 'pac') {
          this.labelPersona = 'Paciente'
          this.ocultarEspecialidad = true
          this.ocultarElementosPaciente = false
        } else {
          this.labelPersona = 'Médico'
          this.ocultarEspecialidad = false
          this.ocultarElementosPaciente = true
        }
        if (this.idPersonaPar != 0) {
          this.labelOpcion = 'Edición '
          this.buscarPersona(this.idPersonaPar)
        } else {
          this.labelOpcion = 'Registro'
          this.listarPerfiles()
          this.nuevoPersona()
          if (this.idTipoPar == 'pac')
            this.generarHistorialMedico()
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
    if (this.idTipoPar == 'pac')
      this.router.navigate(['/consultorio/paciente-listado']);
    else
      this.router.navigate(['/consultorio/medico-listado']);
  }

  itemclick(event: any): void {
    var opt = event.args.innerText;
    switch (opt) {
      case 'Grabar':
        if (this.idTipoPar == 'pac') { this.personaAng.paciente.alergia = this.chbAlgeria.val() }
        this.myValidator.validate(document.getElementById('formPersona'));
        if (this.validaDatos()) {
          this.myValidator.hide();
          this.myModal.alertQuestion({
            title: 'Registro de ' + this.labelPersona,
            msg: '¿Desea grabar este registro?',
            result: (k) => {
              if (k) {
                this.consultorioService.grabarPersona(this.personaAng).subscribe(result => {
                  this.gotoList();
                }, error => console.error(error));
              }
            }
          })
        } else {
          this.myModal.alertMessage({
            title: 'Registro de ' + this.labelPersona,
            msg: 'Verifique que todos los campos esten llenados correctamente!'
          });
        }
        break;
      case 'Cancelar':
        this.myValidator.hide();
        this.gotoList();
        break;
      default:
    }
  };

  nuevoPersona() {
    //PARA ARAMAR EL JASON PERSONA 
    this.personaAng.id = null
    this.personaAng.estado = "A"
    this.personaAng.version = "0"
    this.personaAng.usuarioIngresoId = "1"
    //PARA ARAMAR EL JASON PACIENTE 
    this.paciente.id = null
    this.paciente.idPersona = null
    this.paciente.estado = "A"
    this.paciente.usuarioIngresoId = "1"
    this.paciente.version = "0"
    //PARA ARAMAR EL JASON PACIENTE 
    this.medico.id = null
    this.medico.idPersona = null
    this.medico.estado = "A"
    this.medico.usuarioIngresoId = "1"
    this.medico.version = "0"
    //PARA ARAMAR EL JASON USUARIO
    this.usuario.id = null
    this.usuario.idPersona = null
    this.usuario.estado = "A"
    this.usuario.usuarioIngresoId = "1"
    this.usuario.version = "0"
    this.personaAng.usuario = this.usuario;
    if (this.idTipoPar == 'pac')
      this.personaAng.paciente = this.paciente;
    else
      this.personaAng.medico = this.medico;
  }

  editarPersona(persona: any) {
    if (persona) {
      this.personaAng = persona;
      this.varFechaNacimiento = new Date(persona.fechaNace);
      this.comboGenero.val(persona.genero);
      if (this.idTipoPar == 'pac') {
        if (persona.paciente) {
          this.paciente = persona.paciente;
          this.comboTipoSangre.val(persona.paciente.tipoSangre)
          this.chbAlgeria.checked(persona.paciente.alergia)
        } else {
          this.personaAng.paciente = this.paciente;
        }
      } else if (this.idTipoPar == 'med') {
        if (persona.medico) {
          this.medico = persona.medico;
          this.comboEspecialidad.val(persona.medico.idEspecialidad)
        } else {
          this.personaAng.medico = this.medico;
        }
      }
      if (persona.usuario) {
        this.usuario = persona.usuario
      } else {
        this.listarPerfiles()
        this.usuario.id = null
        this.usuario.idPersona = persona.id
        this.usuario.estado = "A"
        this.usuario.usuarioIngresoId = "1"
        this.usuario.version = "0"
        this.personaAng.usuario = this.usuario
      }
    }
  }

  buscarPersona(idPersona: number) {
    this.consultorioService.getBuscarPersonaId(idPersona).subscribe(data => {
      if (data) {
        this.editarPersona(data)
      }
    });
  }

  verificarCedulaExiste(): boolean {
    let cedula = this.txtIdenficacion.val()
    // alert(cedula)
    this.consultorioService.getRecuperarPorCedula(cedula).subscribe(data => {
      this.valido = true
      // alert(JSON.stringify(data))
      if (data) {
        if (data.id != this.idPersonaPar) {
          if (this.idTipoPar = 'pac') {
            if (data.paciente) {
              this.valido = false
              this.myModal.alertMessage({
                title: 'Cédula Incorrecta',
                msg: 'Ya existe una paciente registrada con esa cédula!'
              });
              return this.valido
            } else if (!data.medico) {
              this.valido = true
              // this.limpiarRegistros()
              this.editarPersona(data)
              return this.valido
            } else if (!data.paciente) {
              this.valido = true
              // this.limpiarRegistros()
              this.editarPersona(data)
              return this.valido
            }
          } else {
            if (data.medico) {
              this.valido = false
              this.myModal.alertMessage({
                title: 'Cédula Incorrecta',
                msg: 'Ya existe un medico registrado con esa cédula!'
              });
              return this.valido
            } else if (!data.paciente) {
              this.valido = true
              // this.limpiarRegistros()
              this.editarPersona(data)
              return this.valido
            }
            else if (!data.medico) {
              this.valido = true
              // this.limpiarRegistros()
              this.editarPersona(data)
              return this.valido
            }
          }
        }
      } else {
        this.valido = true
        this.editarPersona(data)
        return this.valido

      }
    })
    // alert(this.valido)
    return this.valido
  }

  verificarCoincideClave(): boolean {
    let clave = this.passwordInput.val()
    let claveConfirmada = this.passwordInputCon.val()
    if (clave != claveConfirmada)
      return false
    else
      return true
  }


  limpiarRegistros() {
    this.txtNombres.val('')
    this.txtApellidos.val('')
    let nacimiento = new Date();
    this.varFechaNacimiento = nacimiento
    this.masketCelular.value('')
    this.txtEmailPersonal.value('')
    this.txtAreaDireccion.val('')
    this.comboGenero.selectIndex(-1)
  }

  valueChangedFechaNacimiento() {
    let fechaNacimiento: Date
    fechaNacimiento = this.dateFechaNace.value()
    this.varFechaNacimiento = fechaNacimiento
    if (this.personaAng) {
      this.personaAng.fechaNace = fechaNacimiento
    }
  }


  sourceGenero = [{ "genero": "Masculino", "codigo": 'M' }, { "genero": "Femenino", "codigo": 'F' }];

  sourceTipoSangre = [{ "tipo": "O+", "codigo": 'OPO' }, { "tipo": "O-", "codigo": 'ONE' },
  { "tipo": "A+", "codigo": 'APO' }, { "tipo": "A-", "codigo": 'ANE' }, { "tipo": "B-", "codigo": 'BNE' },
  { "tipo": "B+", "codigo": 'BPO' }, { "tipo": "AB-", "codigo": 'ABN' }, { "tipo": "AB+", "codigo": 'ABP' }];


  generarHistorialMedico() {
    let numeroRegistro: string
    this.consultorioService.getRecuperarUltimoPaciente().subscribe(data => {
      if (data.length > 0) {

        let numero = data[0].historialMedico
        let numeroNuevo = Number(numero) + 1
        let llenarCero = numero.length - String(numeroNuevo).length
        numeroRegistro = new Array(llenarCero + (/\./.test(String(numeroNuevo)) ? 2 : 1)).join('0') + String(numeroNuevo)
      }
      if (this.idPersonaPar == 0) {
        this.paciente.historialMedico = numeroRegistro
      }
      this.txtHistorialMed.val(numeroRegistro)
    });
  }

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


  listarPerfiles() {
    this.consultorioService.getListarPerfiles().subscribe(data => {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].codigo == 'PAC') {
            if (this.idTipoPar == 'pac') {
              this.usuario.idPerfil = data[i].idPer
            }
          } else if (data[i].codigo == 'MED') {
            if (this.idTipoPar == 'med') {
              this.usuario.idPerfil = data[i].idPer
            }
          }
        }
      }
    })
  }
  //Reglas de validación formulario
  rules =
    [
      { input: '.identificacionInput', message: 'Identificacion requerida!', action: 'keyup, blur', rule: 'required' },
      {
        input: '.identificacionInput', message: 'Identificación incorrecta', action: 'keyup, blur, change',
        rule: (input: any, commit: any): any => {
          return (this.validarCedulaPasaporte(this.txtIdenficacion.val()))
        }
      },
      {
        input: '.identificacionInput', message: 'Identificación repetida no válida', action: 'keyup, change, blur',
        rule: (input: any, commit: any): any => {
          return (this.verificarCedulaExiste())
        }
      },
      { input: '.nombresInput', message: 'Nombres requeridos!', action: 'keyup, blur', rule: 'required' },
      { input: '.nombresInput', message: 'Nombres deben contener solo letras!', action: 'keyup', rule: 'notNumber' },
      { input: '.nombresInput', message: 'Nombres deben tener entre 3 e 30 caracteres!', action: 'keyup', rule: 'length=2,30' },
      { input: '.apellidosInput', message: 'Apellidos requeridos!', action: 'keyup, blur', rule: 'required' },
      { input: '.apellidosInput', message: 'Apellidos deben contener solo letras!', action: 'keyup', rule: 'notNumber' },
      { input: '.apellidosInput', message: 'Apellidos deben tener entre 3 e 30 caracteress!', action: 'keyup', rule: 'length=2,30' },
      {
        input: '.fechaNaceInput', message: 'Solo de 5 a 90 años.', action: 'keyup',
        rule: (input: any, commit: any): any => {
          return (this.validaFechaNacimiento(this.dateFechaNace.value()));
        }
      },
      {
        input: '.generoInput', message: 'Seleccione Género', action: 'change',
        rule: (input: any, commit: any): any => {
          let selectedIndex = this.comboGenero.selectIndex
          if (selectedIndex) { return selectedIndex; };
        }
      },
      { input: '.emailPersonalInput', message: 'E-mail requerido!', action: 'keyup, blur', rule: 'required' },
      { input: '.emailPersonalInput', message: 'E-mail incorrecto!', action: 'keyup', rule: 'email' },
      {
        input: '.celularInput', message: 'Celular incorrecto! Ingrese 10 dígitos', action: 'valuechanged, blur',
        rule: (input: any, commit: any): any => {
          return (this.validadorService.validaCelular(this.masketCelular.val()));
        }
      },
      {
        input: '.direccionInput', message: 'Dirección requerida! Sector, Avenida, Calle, referencia', action: 'keyup, blur',
        rule: (input: any, commit: any): any => {
          return (this.validadorService.validaDireccion(this.txtAreaDireccion.val()));
        }
      },
      { input: '.histMedicoInput', message: 'Historial Médico Requerido!', action: 'keyup, blur', rule: 'required' },
      { input: '.usuarioInput', message: 'Usuario requerido!', action: 'keyup, blur', rule: 'required' },
      { input: '.passwordInput', message: 'Contraseña requerida!', action: 'keyup, blur', rule: 'required' },
      { input: '.passwordInputCon', message: 'Verificación de contraseña requerida!', action: 'keyup, blur', rule: 'required' },
      {
        input: '.passwordInputCon', message: 'Las contraseñas no coinciden', action: 'keyup, change, blur',
        rule: (input: any, commit: any): any => {
          return (this.verificarCoincideClave())
        }
      },
    ];


  validarCedulaPasaporte(cedula: string) {
    var esValido = true;
    var valCed = this.checkBoxValCedula.val();
    if (valCed == false) {
      if (!this.validadorService.validaCedula(cedula)) {
        esValido = false;
        this.myModal.alertMessage({
          title: 'Cédula incorrecta',
          msg: 'Ingrese correctamente la cédula!'
        });
        // this.limpiarRegistros()
      }
    }
    if (valCed == true) {
      if (!this.validadorService.validaPasaporte(cedula)) {
        esValido = false;
        // alert('passinc')
        this.myModal.alertMessage({
          title: 'Pasaporte incorrecto',
          msg: 'Ingrese correctamente el pasaporte!'
        });
      }
    }
    return esValido;
  }

  validaDatos(): boolean {
    let valido = true
    //valida cedula o pasaporte
    if (!this.validarCedulaPasaporte(this.txtIdenficacion.val())) {
      valido = false
      // alert('cedu')
      return valido
    }
    //valida Apellidos
    if (!this.validadorService.validaApellidos(this.txtApellidos.val())) {
      valido = false
      // alert('ape')
      return valido
    }
    //valida fecha de nacimiento
    if (!this.validaFechaNacimiento(this.dateFechaNace.value())) {
      valido = false
      // alert('nace')
      return valido
    }
    //valida mails
    if (!this.validadorService.validaMails(this.txtEmailPersonal.val())) {
      valido = false
      // alert('mai per')
      return valido
    }
    //valida celular
    if (!this.validadorService.validaCelular(this.masketCelular.val())) {
      valido = false
      // alert('cel')
      return valido
    }
    //valida direccion
    if (!this.validadorService.validaDireccion(this.txtAreaDireccion.val())) {
      valido = false
      // alert('dir')
      return valido
    }
    //validar combos
    if (!this.comboGenero.val()) {
      valido = false
      // alert('combos')
      return valido
    }
    if (this.idTipoPar == 'pac') {
      if (!this.comboTipoSangre.val()) {
        valido = false
        // alert('combos')
        return valido
      }
    }
    if (this.idTipoPar == 'med') {
      if (!this.comboEspecialidad.val()) {
        valido = false
        // alert('combos')
        return valido
      }
    }
    return valido
  }

  validaFechaNacimiento(fecha: any) {
    //valida edad entre 16 y 70 años
    let fecha_actual = new Date();
    let yearTo = fecha_actual.getFullYear() - 5;
    let yearFrom = fecha_actual.getFullYear() - 90;
    let date = new Date(fecha)
    let result = date.getFullYear() >= yearFrom && date.getFullYear() <= yearTo;
    return result;
  }
}
