import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { jqxDropDownListComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxdatetimeinput';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { jqxScrollViewComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxscrollview';
import { jqxMaskedInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxmaskedinput';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import { jqxCheckBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcheckbox';
import { Alert } from 'selenium-webdriver';


@Component({
  selector: 'app-estudiante-edicion',
  templateUrl: './estudiante-edicion.component.html',
  styleUrls: ['./estudiante-edicion.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EstudianteEdicionComponent implements OnInit, AfterContentInit {

  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('txtIdenficacion') txtIdenficacion: jqxInputComponent;
  @ViewChild('scrollViewFoto', { read: false }) scrollViewFoto: jqxScrollViewComponent;
  @ViewChild('txtApellidos') txtApellidos: jqxInputComponent;
  @ViewChild('txtNombres') txtNombres: jqxInputComponent;
  @ViewChild('dateFechaNace') dateFechaNace: jqxDateTimeInputComponent;
  @ViewChild('comboGenero') comboGenero: jqxDropDownListComponent;
  @ViewChild('masketTelefono') masketTelefono: jqxMaskedInputComponent;
  @ViewChild('masketCelular') masketCelular: jqxMaskedInputComponent;
  @ViewChild('txtEmailPersonal') txtEmailPersonal: jqxInputComponent;
  @ViewChild('txtEmailInstitucional') txtEmailInstitucional: jqxInputComponent;
  @ViewChild('txtAreaDireccion') txtAreaDireccion: jqxTextAreaComponent;
  @ViewChild('txtNumMatricula') txtNumMatricula: jqxInputComponent;
  @ViewChild('comboTiposEstudiante') comboTiposEstudiante: jqxDropDownListComponent;
  @ViewChild('comboTiposIngreso') comboTiposIngreso: jqxDropDownListComponent;
  @ViewChild('comboEstadoEstudiante') comboEstadoEstudiante: jqxDropDownListComponent;
  @ViewChild('dateDesde') dateDesde: jqxDateTimeInputComponent;
  @ViewChild('dateHasta') dateHasta: jqxDateTimeInputComponent;
  @ViewChild('checkBoxValCedula') checkBoxValCedula: jqxCheckBoxComponent;
  facultad: any;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private matriculasService: MatriculasService,
    private validadorService: ValidadorService,
  ) { }

  sub: Subscription;
  personaAng: any = {};
  estudiante: any = {};
  estudianteOfertas: any = {};
  idPersonaPar: number;
  idDepartamentoOfertaPar: number;
  idUltimaMalla: number;
  labelOpcion: string;
  labelCarrera: string
  labelFacultad: string
  valido: boolean
  //variables usadas para recuperar los datos en la edición
  varFechaNacimiento: any = new Date();
  varDesde: any = new Date();
  varHasta: any = new Date();

  ngOnInit() {
    this.ListarTiposEstudiantes()
    this.listarTipoIngresoEstudiante()
  }

  ngAfterContentInit() {
    this.sub = this.route.params.subscribe(params => {
      this.idPersonaPar = params['idPersona'];
      this.idDepartamentoOfertaPar = params['idDepartamentoOferta'];
      // Evalua si el parametro id se paso.
      // this.dateHasta.disabled(true)
      if (this.idPersonaPar) {


        if (this.idPersonaPar != 0) {
          this.labelOpcion = 'Edición '
          this.buscarEstudiante(this.idPersonaPar)
          // this.comboEstadoEstudiante.disabled(false)
        } else {
          this.labelOpcion = 'Registro '
          this.nuevoEstudiante()
          this.recuperarMallaCarreraFacultad(this.idDepartamentoOfertaPar, 0)
          // this.generarNumeroMatricula()
          this.comboEstadoEstudiante.disabled(true)
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
    this.router.navigate(['/matriculas/estudiante-listado']);
  }

  itemclick(event: any): void {
    var opt = event.args.innerText;
    switch (opt) {
      case 'Grabar':

        this.myValidator.validate(document.getElementById('formEstudiante'));
        if (this.validaDatos()) {
          this.myValidator.hide();
          this.myModal.alertQuestion({
            title: 'Registro de Estudiantes',
            msg: 'Desea grabar este registro?',
            result: (k) => {
              if (k) {
                this.matriculasService.grabarEstudiante(this.personaAng).subscribe(result => {
                  this.gotoList();
                }, error => console.error(error));
              }
            }
          })
        } else {
          this.myModal.alertMessage({
            title: 'Registro de Estudiantes',
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

  nuevoEstudiante() {
    //PARA ARAMAR EL JASON PERSONA 
    this.personaAng.id = null
    this.personaAng.estado = "AC"
    this.personaAng.version = "0"
    //PARA ARAMAR EL JASON ESTUDIANTE 
    this.estudiante.id = null
    this.estudiante.idPersona = null
    this.estudiante.estado = "A"
    this.estudiante.usuarioIngresoId = "1"
    this.estudiante.version = "0"
    this.personaAng.estudiante = this.estudiante;
    //PARA ARAMAR EL JASON ESTUDIANTE OFERTA
    this.estudianteOfertas.id = null
    this.estudianteOfertas.idEstudiante = null
    this.estudianteOfertas.idMalla = this.idUltimaMalla
    this.estudianteOfertas.estado = "A"
    this.estudianteOfertas.usuarioIngresoId = "1"
    this.estudianteOfertas.version = "0"
    this.varHasta = null
    this.personaAng.estudiante.estudianteOfertas = []
    this.personaAng.estudiante.estudianteOfertas.push(this.estudianteOfertas)
  }

  editarEstudiante(persona: any, opcion: number) {
    this.personaAng = persona;
    this.varFechaNacimiento = new Date(this.personaAng.fecha_nace);
    this.comboGenero.val(this.personaAng.genero);
    let contadorRet: number = 0
    let contadorAct: number = 0
    if (persona.estudiante) {
      this.estudiante = persona.estudiante;
      this.comboTiposEstudiante.val(this.estudiante.idTipoEstudiante)
      if (persona.estudiante.estudianteOfertas) {
        this.recuperarMallaCarreraFacultad(this.idDepartamentoOfertaPar, 1)
        for (let i = 0; i < persona.estudiante.estudianteOfertas.length; i++) {
          let idDepartamentoOferta = persona.estudiante.estudianteOfertas[i].idDepartamentoOferta
          let estadoEstudianteOferta = persona.estudiante.estudianteOfertas[i].estadoEstudianteOferta
          if (idDepartamentoOferta == this.idDepartamentoOfertaPar && (opcion == 0 || opcion == 1)) {
            this.estudianteOfertas = persona.estudiante.estudianteOfertas[i];
            this.comboTiposIngreso.val(this.estudianteOfertas.idTipoIngresoEstudiante)
            this.varDesde = new Date(this.estudianteOfertas.fechaDesde)
            this.varHasta = new Date(this.estudianteOfertas.fechaHasta)
            this.comboEstadoEstudiante.val(this.estudianteOfertas.estadoEstudianteOferta)
            this.txtNumMatricula.val(this.estudianteOfertas.numeroMatricula)
          }
          if (estadoEstudianteOferta == "RET  ") {
            contadorRet++
          } else if (estadoEstudianteOferta == "ACT  ") {
            contadorAct++
            this.comboEstadoEstudiante.disabled(true)
            this.dateHasta.disabled(true)
          }
        }
        if (contadorRet > 0 && contadorAct == 0 && persona.id != this.idPersonaPar) {
          this.estudianteOfertas.idEstudiante = persona.estudiante.id
          this.personaAng.estudiante.estudianteOfertas.push(this.estudianteOfertas)
        }
      }
    } else {
      this.personaAng.estudiante = this.estudiante;
      if (this.personaAng.id)
        this.personaAng.estudiante.idPersona = this.personaAng.id
    }
  }

  buscarEstudiante(idPersona: number) {
    this.matriculasService.getBuscarEstudiante(idPersona).subscribe(data => {
      if (data) {
        this.editarEstudiante(data, 0)
      }
    });
  }

  verificarCedulaExiste(): boolean {
    let cedula = this.txtIdenficacion.val()
    let contadorRet, contadorAct: number = 0
    let idCarreraA: number
    let idCarreraR: number
    let tieneRegistro: boolean = false
    this.matriculasService.getBuscarEstudiantePorCedula(cedula).subscribe(data => {
      this.valido = true
      if (data) {
        if (data.estudiante) {
          for (let i = 0; i < data.estudiante.estudianteOfertas.length; i++) {
            let idDepartamentoOferta = data.estudiante.estudianteOfertas[i].idDepartamentoOferta
            if (idDepartamentoOferta == this.idDepartamentoOfertaPar && this.idPersonaPar == data.id)
              tieneRegistro = true
          }
          if (tieneRegistro) {
            return this.valido
          }
          else {
            for (let i = 0; i < data.estudiante.estudianteOfertas.length; i++) {
              let estadoEstudianteOferta = data.estudiante.estudianteOfertas[i].estadoEstudianteOferta
              let idDepartamentoOferta = data.estudiante.estudianteOfertas[i].idDepartamentoOferta
              if (estadoEstudianteOferta == "ACT  " || estadoEstudianteOferta == "EGR  " || estadoEstudianteOferta == "EXP  "
                || estadoEstudianteOferta == "GRA  ") {
                idCarreraA = idDepartamentoOferta
                contadorAct++
              }
            }
            if (contadorAct == 1) {
              if (idCarreraA == this.idDepartamentoOfertaPar) {
                if (data.id != this.idPersonaPar) {
                  this.valido = false
                  this.myModal.alertMessage({ title: 'Registro de Estudiantes', msg: 'El Estudiante está  registrado  esta carrera !' });
                } else {
                  // this.editarEstudiante(data, 1)
                  this.valido = true
                }
              } else {
                this.valido = false
                this.matriculasService.getRecuperarMallaCarreraFacultad(idCarreraA).subscribe(data => {
                  if (data.length > 0) {
                    this.myModal.alertMessage({
                      title: 'Registro de Estudiantes',
                      msg: 'El Estudiante está  registrado en ' + data[0].carrera + ' debe ser dado de baja para registrarse en esta carrera !'
                    });
                  }
                })
                return this.valido
              }
            } else {
              for (let i = 0; i < data.estudiante.estudianteOfertas.length; i++) {
                let estadoEstudianteOferta = data.estudiante.estudianteOfertas[i].estadoEstudianteOferta
                let idDepartamentoOferta = data.estudiante.estudianteOfertas[i].idDepartamentoOferta
                if (estadoEstudianteOferta == "RET  ") {
                  // idCarreraR = idDepartamentoOferta
                  if (idDepartamentoOferta != this.idDepartamentoOfertaPar) {
                    this.editarEstudiante(data, 1)
                    return this.valido
                  } else {
                    if (data.id == this.idPersonaPar || this.idPersonaPar == 0) {
                      this.valido = false
                      this.myModal.alertMessage({ title: 'Registro de Estudiantes', msg: 'El Estudiante está  registrado  esta carrera !' });
                    } else {
                      this.editarEstudiante(data, 1)
                      this.valido = true
                    }
                    return this.valido
                  }
                }
              }
            }
          }
        } else {
          this.valido = true
          this.editarEstudiante(data, 1)
          return this.valido
        }
      }
    })
    // alert(this.valido)
    return this.valido
  }

  verificarCedulaExiste2(event: any): boolean {
    let cedula = this.txtIdenficacion.val()
    let contadorAct: number = 0
    this.matriculasService.getBuscarEstudiantePorCedula(cedula).subscribe(data => {
      this.valido = true
      if (data) {
        if (data.estudiante) {
          for (let i = 0; i < data.estudiante.estudianteOfertas.length; i++) {
            let estadoEstudianteOferta = data.estudiante.estudianteOfertas[i].estadoEstudianteOferta
            let idDepartamentoOferta = data.estudiante.estudianteOfertas[i].idDepartamentoOferta
            if (estadoEstudianteOferta == "ACT  " || estadoEstudianteOferta == "EGR  " || estadoEstudianteOferta == "EXP  "
              || estadoEstudianteOferta == "GRA  " && i < data.estudiante.estudianteOfertas.length) {
              if (idDepartamentoOferta != this.idDepartamentoOfertaPar) {
                this.valido = false
                contadorAct++
                this.matriculasService.getRecuperarMallaCarreraFacultad(idDepartamentoOferta).subscribe(data => {
                  if (data.length > 0) {
                    this.myModal.alertMessage({
                      title: 'Registro de Estudiantes',
                      msg: 'El Estudiante está  registrado en ' + data[0].carrera +
                        ' debe ser dado de baja para registrarse en esta carrera !'
                    });
                  }
                })
              }
              // alert(contadorAct)
            } else if (estadoEstudianteOferta == "RET  " && i < data.estudiante.estudianteOfertas.length && contadorAct == 0) {
              // alert(contadorAct)
              if (idDepartamentoOferta != this.idDepartamentoOfertaPar) {
                this.editarEstudiante(data, 1)

              } else {
                if (data.id != this.idPersonaPar) {
                  this.valido = false
                  this.myModal.alertMessage({ title: 'Registro de Estudiantes', msg: 'El Estudiante está  registrado  esta carrera !' });
                } else {
                  this.valido = true
                }
              }
            }
          }
        }
        // else {
        //   this.valido = true
        //   this.editarEstudiante(data, 1)
        // }
      }
    })
    // alert(this.valido)
    return this.valido
  }

  limpiarRegistros() {
    // this.txtIdenficacion.val('')
    this.txtNombres.val('')
    this.txtApellidos.val('')
    let desde = new Date();
    this.varDesde = desde
    // let hasta = new Date();
    // this.varHasta= hasta
    let nacimiento = new Date();
    this.varFechaNacimiento = nacimiento
    this.masketCelular.value('')
    this.masketTelefono.value('')
    this.txtEmailInstitucional.value('')
    this.txtEmailPersonal.value('')
    this.txtAreaDireccion.val('')
    this.comboGenero.selectIndex(-1)
    this.comboTiposEstudiante.selectIndex(-1)
    // this.comboTiposIngreso.selectIndex(-1)
  }

  valueChangedFechaNacimiento() {
    let fechaNacimiento: Date
    fechaNacimiento = this.dateFechaNace.value()
    this.varFechaNacimiento = fechaNacimiento
    if (this.personaAng) {
      this.personaAng.fecha_nace = fechaNacimiento
    }
  }

  valueChangedFechaDesde() {
    let fechaDesde: Date
    fechaDesde = this.dateDesde.value()
    this.varDesde = fechaDesde
    if (this.estudianteOfertas) {
      this.estudianteOfertas.fechaDesde = fechaDesde
    }
  }
  valueChangedHasta() {
    let hasta: Date
    hasta = this.dateHasta.value()
    this.varHasta = hasta
    if (this.estudianteOfertas) {
      this.estudianteOfertas.fechaHasta = hasta
    }
  }

  sourceGenero = [{ "genero": "Masculino", "codigo": 'M' }, { "genero": "Femenino", "codigo": 'F' }];

  sourceEstadoEstudiante = [{ "estado": "Activo", "codigo": 'ACT' }, { "estado": "Egresado", "codigo": 'EGR' },
  { "estado": "Graduado", "codigo": 'GRA' }, { "estado": "Retirado", "codigo": 'RET' }, { "estado": "Expulsado", "codigo": 'EXP' }];


  //FUENTE DE DATOS PARA EL COMBOBOX DE TIPOS DE INGRESO
  sourceTiposEstudiante: any =
    [{
      datatype: 'json',
      id: 'idTipoEstudiante',
      localdata:
        [
          { name: 'idTipoEstudiante', type: 'int' },
          { name: 'tipoEstudiante', type: 'string' },
        ],
    }]
  //CARGAR ORIGEN DEL COMBOBOX DE TIPOS DE INGRESO
  dataAdapterTiposEstudiante: any = new jqx.dataAdapter(this.sourceTiposEstudiante);

  ListarTiposEstudiantes() {
    this.matriculasService.getListarTiposEstudiantes().subscribe(data => {
      this.sourceTiposEstudiante.localdata = data;
      this.dataAdapterTiposEstudiante.dataBind();
    })
  }
  //FUENTE DE DATOS PARA EL COMBOBOX DE TIPOS DE INGRESO
  sourceTiposIngresoEstudiante: any =
    [{
      datatype: 'json',
      id: 'idTipoIngresoEstudiante',
      localdata:
        [
          { name: 'idTipoIngresoEstudiante', type: 'int' },
          { name: 'tipoIngreso', type: 'string' },
          { name: 'codigoTipoIngreso', type: 'string' }
        ],
    }];
  //CARGAR ORIGEN DEL COMBOBOX DE TIPOS DE INGRESO
  dataAdapterTiposIngresoEstudiante: any = new jqx.dataAdapter(this.sourceTiposIngresoEstudiante);

  listarTipoIngresoEstudiante() {
    this.matriculasService.getListarTipoIngresoEstudiante().subscribe(data => {
      this.sourceTiposIngresoEstudiante.localdata = data;
      this.dataAdapterTiposIngresoEstudiante.dataBind();
    })
  }

  recuperarMallaCarreraFacultad(idDepartamentoOferta: number, opcion: number) {
    this.matriculasService.getRecuperarMallaCarreraFacultad(idDepartamentoOferta).subscribe(data => {
      if (data.length > 0) {
        if (opcion == 0) {
          this.estudianteOfertas.idMalla = data[0].idMalla
          this.estudianteOfertas.idDepartamentoOferta = data[0].idDepartamentoOferta
        }
        this.labelCarrera = data[0].carrera
        this.labelFacultad = data[0].facultad
        if (!this.estudianteOfertas.numeroMatricula) {
          this.generarNumeroMatricula()
        }
      }
    })
  }

  habilitarFechas() {
    if (this.comboEstadoEstudiante.val() != 'ACT') {
      this.dateHasta.disabled(false)
      let fecha_actual = new Date();
      this.varHasta = fecha_actual
    } else {
      this.dateHasta.disabled(true)
      this.varHasta = null
    }
  }

  generarNumeroMatricula() {
    this.matriculasService.getRecuperarLabelPeriodoMatricula().subscribe(data => {
      if (data.length > 0) {
        let anio = data[0].codigo
        let periodo = anio.substring(0, 4);
        let periodo2 = anio.substring(5)
        let carrera = this.labelCarrera.substring(0, 3);
        let numeroRegistro: string
        this.matriculasService.getRecuperarUltimoMatriculado().subscribe(data => {
          if (data.length > 0) {
            let numero = data[0].numeroMatricula.substring(9)
            let numeroNuevo = Number(numero) + 1
            let llenarCero = numero.length - String(numeroNuevo).length
            numeroRegistro = new Array(llenarCero + (/\./.test(String(numeroNuevo)) ? 2 : 1)).join('0') + String(numeroNuevo)
          }
          let numeroMatricula: string = periodo + periodo2 + 'N' + carrera + numeroRegistro
          if (this.idPersonaPar == 0) {
            this.estudianteOfertas.numeroMatricula = numeroMatricula
          }
          this.txtNumMatricula.val(numeroMatricula)
        });
      }
    });
  }
  changeNumeroMatricula(event: any) {
    let numMat1 = this.txtNumMatricula.val().substring(0, 5);
    let numMat2 = this.txtNumMatricula.val().substring(6)
    let tipo = event.args.item.label.substring(0, 1);
    let numeroMatricula: string = numMat1 + tipo + numMat2
    if (this.idPersonaPar == 0) {
      this.estudianteOfertas.numeroMatricula = numeroMatricula
    }
    this.txtNumMatricula.val(numeroMatricula)
  }

  //Reglas de validación formulario
  rules =
    [
      { input: '.identificacionInput', message: 'Identificacion requerida!', action: 'keyup, blur', rule: 'required' },
      {
        input: '.identificacionInput', message: 'Identificación incorrecta', action: 'keyup, blur, change',
        rule: (input: any, commit: any): any => {
          return (this.validarCedulaPasaporte(this.txtIdenficacion.val()))
          // return (this.valido)
        }
      },
      {
        input: '.identificacionInput', message: 'Identificación repetida no válida', action: 'keyup, change, blur',
        rule: (input: any, commit: any): any => {
          alert(input)
          return (this.valido)
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
        input: '.fecha_naceInput', message: 'La edad debe ser entre 16 y 70 años.', action: 'keyup',
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
      { input: '.email_personalInput', message: 'E-mail requerido!', action: 'keyup, blur', rule: 'required' },
      { input: '.email_personalInput', message: 'E-mail incorrecto!', action: 'keyup', rule: 'email' },
      { input: '.email_institucionalInput', message: 'E-mail institucional requerido!', action: 'keyup, blur', rule: 'required' },
      { input: '.email_institucionalInput', message: 'E-mail institucional incorrecto!', action: 'keyup', rule: 'email' },
      {
        input: '.telefonoInput', message: 'Teléfono incorrecto! Ingrese 9 dígitos, utilice código de area ejemplo 042787123!', action: 'valuechanged, blur',
        rule: (input: any, commit: any): any => {
          return (this.validadorService.validaTelefono(this.masketTelefono.val()));
        }
      },
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
      { input: '.numMatriculaInput', message: 'Número de Matrícula Requerido!', action: 'keyup, blur', rule: 'required' },
    ];


  // validarCedulaExistentes(cedula: string) {
  //   var esValido = true;
  //   var valCed = this.checkBoxValCedula.val();
  //   if (valCed == false) {
  //     if(cedula){
  //       if (this.valido==false) {
  //         // alert('existe')
  //         esValido = this.valido;
  //       }
  //       // if (!this.verificarCedulaExiste(cedula)) {
  //       //   // alert('existe')
  //       //   esValido = this.valido;
  //       // }
  //     }
  //   }
  //   return esValido;
  // }

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
        this.limpiarRegistros()
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
    //valida mails
    if (!this.validadorService.validaMails(this.txtEmailInstitucional.val())) {
      valido = false
      // alert('mai insitu')
      return valido
    }
    //valida telefono
    if (!this.validadorService.validaTelefono(this.masketTelefono.val())) {
      valido = false
      // alert('tele')
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
    if (!this.comboEstadoEstudiante.val() || !this.comboTiposIngreso.val() || !this.comboTiposEstudiante.val() || !this.comboGenero.val()) {
      valido = false
      // alert('combos')
      return valido
    }
    return valido
  }

  validaFechaNacimiento(fecha: any) {
    //valida edad entre 16 y 70 años
    let fecha_actual = new Date();
    let yearTo = fecha_actual.getFullYear() - 16;
    let yearFrom = fecha_actual.getFullYear() - 70;
    let date = new Date(fecha)
    let result = date.getFullYear() >= yearFrom && date.getFullYear() <= yearTo;
    return result;
  }
}
