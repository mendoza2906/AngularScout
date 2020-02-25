import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxdatetimeinput';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { jqxMaskedInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxmaskedinput';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import { jqxCheckBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcheckbox';
import { jqxPasswordInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpasswordinput';
import { jqxNumberInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxnumberinput';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu';
import { ScoutService } from '../../../services/scout/scout.service';
import * as CryptoJS from 'crypto-js';
// var CryptoJS = require("crypto-js");
// var ReverseMd5 = require("reverse-md5")
// var rev = ReverseMd5({
// 	lettersUpper: false,
// 	lettersLower: true,
// 	numbers: true,
// 	special: false,
// 	whitespace: true,
// 	maxLen: 12
// })

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
  @ViewChild('comboGenero') comboGenero: jqxComboBoxComponent;
  @ViewChild('comboGrupo') comboGrupo: jqxComboBoxComponent;
  @ViewChild('comboRama') comboRama: jqxComboBoxComponent;
  @ViewChild('comboTipoScout') comboTipoScout: jqxComboBoxComponent;
  @ViewChild('masketCelular') masketCelular: jqxMaskedInputComponent;
  @ViewChild('txtEmailPersonal') txtEmailPersonal: jqxInputComponent;
  @ViewChild('txtAreaDireccion') txtAreaDireccion: jqxTextAreaComponent
  @ViewChild('txtUsuario') txtUsuario: jqxInputComponent;
  @ViewChild('passwordInput') passwordInput: jqxPasswordInputComponent;
  @ViewChild('passwordInputCon') passwordInputCon: jqxPasswordInputComponent;
  @ViewChild('checkBoxValCedula') checkBoxValCedula: jqxCheckBoxComponent;
  @ViewChild('jqxMenu') jqxMenu: jqxMenuComponent;
  @ViewChild('txtAnioDesde') txtAnioDesde: jqxNumberInputComponent;
  @ViewChild('txtAnioHasta') txtAnioHasta: jqxNumberInputComponent;
  banderaSubioArchivo: boolean;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private ScoutService: ScoutService,
    private validadorService: ValidadorService,
  ) { }

  sub: Subscription;
  ScoutAng: any = {};
  comisionado: any = {};
  usuario: any = {};
  idScoutPar: number;
  idTipoPar: string;
  idUltimaMalla: number;
  labelOpcion: string;
  labelPersona: string;
  valido: boolean
  ocultarComisionado: boolean
  banderaDatosValidos: boolean = false
  varFechaNacimiento: any = new Date();

  ngOnInit() {
    this.listarRamas()
    this.listarTiposScouts()
  }

  ngAfterContentInit() {
    this.sub = this.route.params.subscribe(params => {
      this.idScoutPar = params['idScout'];
      this.idTipoPar = params['tipo'];
      // Evalua si el parametro id se paso.
      if (this.idScoutPar) {
        if (this.idTipoPar == 'sco') {
          this.labelPersona = 'Scout'
          this.ocultarComisionado = true
        } else {
          this.labelPersona = 'Comisionado'
          this.ocultarComisionado = false
        }
        if (this.idScoutPar != 0) {
          this.labelOpcion = 'Edición '
          this.buscarScout(this.idScoutPar)
        } else {
          this.labelOpcion = 'Registro'
          this.listarPerfiles()
          this.nuevoPersona()
          // if (this.idTipoPar == 'sco')
          //   this.generarHistorialMedico()
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
    if (this.idTipoPar == 'sco')
      this.router.navigate(['/scout/scout-listado']);
    else
      this.router.navigate(['/scout/comisionado-listado']);
  }

  itemclick(event: any): void {
    var opt = event.args.innerText;
    switch (opt) {
      case 'Grabar':
        this.myValidator.validate(document.getElementById('formPersona'));
        if (this.validaDatos()) {
          let constrasenaCifrada = '{MD5}' + CryptoJS.MD5(this.usuario.clave);
          this.usuario.clave = constrasenaCifrada
          // ReverseMd5(constrasenaCifrada) //returns 'hi'
          // this.usuario.claveDescifrada=rev(constrasenaCifrada)
          this.generarImagen()
          this.myValidator.hide();
          this.myModal.alertQuestion({
            title: 'Registro de ' + this.labelPersona,
            msg: '¿Desea grabar este registro?',
            result: (k) => {
              if (k) {
                this.ScoutService.grabarScout(this.ScoutAng).subscribe(result => {
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

  ValidationSuccess(event: any): void {
    this.banderaDatosValidos = true
  }

  nuevoPersona() {
    //PARA ARAMAR EL JASON PERSONA 
    this.ScoutAng.id = null
    this.ScoutAng.estado = "A"
    this.ScoutAng.version = "0"
    this.ScoutAng.usuarioIngresoId = "1"
    //PARA ARAMAR EL JASON Scout 
    this.comisionado.id = null
    this.comisionado.idScout = null
    this.comisionado.imagen = 'assets/defecto.jpg'
    this.comisionado.estado = "A"
    this.comisionado.usuarioIngresoId = "1"
    this.comisionado.version = "0"
    //PARA ARAMAR EL JASON USUARI
    this.usuario.id = null
    this.usuario.idScout = null
    this.usuario.estado = "A"
    this.usuario.usuarioIngresoId = "1"
    this.usuario.version = "0"
    this.ScoutAng.usuario = this.usuario;
    if (this.idTipoPar == 'com')
      this.ScoutAng.comisionado = this.comisionado;
  }

  recuperarCombosAnidados(idGrupoRama: number) {
    this.ScoutService.getRecuperarCombosGrupoRama(idGrupoRama).subscribe(data => {
      if (data.length > 0) {
        if (data[0].idGrupoRama == idGrupoRama) {
          this.comboRama.val(data[0].idRama)
          this.ScoutService.getListarGrupos(data[0].idRama).subscribe(data => {
            this.sourceGrupos.localdata = data;
            this.dataAdapterGrupos.dataBind();
            let dataAdapter = this.sourceGrupos.localdata;
            for (let i = 0; i < dataAdapter.length; i++) {
              let record = dataAdapter[i];
              if (record.idGrupoRama == data[0].idGrupoRama) {
                this.comboGrupo.selectIndex(i+1)
              }
            }
          })
        }
      }
    });
  }

  editarPersona(scout: any) {
    if (scout) {
      this.ScoutAng = scout;
      this.varFechaNacimiento = new Date(scout.fechaNace);
      this.comboGenero.val(scout.genero);
      this.comboTipoScout.val(scout.idTipoScout)
      this.recuperarCombosAnidados(scout.idGrupoRama)
      // this.comboGrupo.val(scout.idGrupoRama)
      if (this.idTipoPar == 'com') {
        if (scout.comisionado) {
          this.comisionado = scout.comisionado;
        } else {
          this.ScoutAng.comisionado = this.comisionado;
        }
      }
      if (scout.usuario) {
        this.usuario = scout.usuario
      } else {
        this.listarPerfiles()
        this.usuario.id = null
        this.usuario.idPersona = scout.id
        this.usuario.estado = "A"
        this.usuario.usuarioIngresoId = "1"
        this.usuario.version = "0"
        this.ScoutAng.usuario = this.usuario
      }
    }
  }

  buscarScout(idPersona: number) {
    this.ScoutService.getRecuperarScoutId(idPersona).subscribe(data => {
      if (data) {
        this.editarPersona(data)
      }
    });
  }
  generarImagen() {
    let fileInput: any = document.getElementById("img");
    let files = fileInput.files[0];
    if (!this.comisionado.imagen || (this.comisionado.imagen && files)) {
      if (files) {
        this.banderaSubioArchivo = true
        let arregloDeSubCadenas = files.type.split("/", 2);
        console.log(files.type + ' XD ' + arregloDeSubCadenas[1]);
        let imgPromise = this.getFileBlob(files);
        imgPromise.then(blob => {
          if (arregloDeSubCadenas[1] == 'jpg' || arregloDeSubCadenas[1] == 'png' || arregloDeSubCadenas[1] == 'jpeg')
            this.comisionado.imagen = blob;
          else
            this.myModal.alertMessage({
              title: 'Registro de Scout', msg: 'Solo puede subir archivos tipo Imagen!'
            })
          return
        }).catch(e => console.log(e));
      } else {
        this.myModal.alertMessage({
          title: 'Registro de Scout',
          msg: 'Carque un foto!'
        })
        return
      }
    }
  }

  getFileBlob(file) {
    var reader = new FileReader();
    return new Promise(function (resolve, reject) {
      reader.onload = (function (theFile) {
        return function (e) {
          resolve(e.target.result);
        };
      })(file);
      reader.readAsDataURL(file);
    });
  }


  verificarCedulaExiste(): boolean {
    let cedula = this.txtIdenficacion.val()
    this.ScoutService.getRecuperarPorCedula(cedula).subscribe(data => {
      this.valido = true
      if (data) {
        if (data.id != this.idScoutPar) {
          this.valido = false
          this.myModal.alertMessage({
            title: 'Cédula Incorrecta',
            msg: 'Ya existe un Scout registrado con esa cédula!'
          });
          return this.valido
        }
      } else {
        this.valido = true
        this.editarPersona(data)
        return this.valido
      }
    })
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
    // this.txtUsuario.val('')
    // this.passwordInput.val('')
    // this.passwordInputCon.val('')
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
    if (this.ScoutAng) {
      this.ScoutAng.fechaNace = fechaNacimiento
    }
  }


  sourceGenero = [{ "genero": "Masculino", "codigo": 'M' }, { "genero": "Femenino", "codigo": 'F' }];

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
          { name: 'idRama', type: 'string' },
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


  //FUENTE DE DATOS PARA EL COMBOBOX DE TIPO SCOUTS
  sourceTipoScout: any =
    {
      datatype: 'json',
      id: 'idTipoScout',
      localdata:
        [
          { name: 'idTipoScout', type: 'string' },
          { name: 'codigo', type: 'string' },
          { name: 'tipoScout', type: 'string' },
          { name: 'descripcion', type: 'string' },
        ],
    };
  //CARGAR ORIGEN DEL COMBOBOX DE ESPECIALIDAD
  dataAdapterTipoScout: any = new jqx.dataAdapter(this.sourceTipoScout);

  listarTiposScouts() {
    this.ScoutService.getListarTiposScouts().subscribe(data => {
      this.sourceTipoScout.localdata = data;
      this.dataAdapterTipoScout.dataBind();
    })
  }

  listarPerfiles() {
    this.ScoutService.getListarPerfiles().subscribe(data => {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].codigo == 'BEN') {
            if (this.idTipoPar == 'sco') {
              this.usuario.idPerfil = data[i].idPer
            }
          } else if (data[i].codigo == 'COM') {
            if (this.idTipoPar == 'com') {
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
          if (this.txtIdenficacion.val())
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
        input: '.fechaNaceInput', message: 'Solo de 5 a 60 años.', action: 'keyup',
        rule: (input: any, commit: any): any => {
          return (this.validaFechaNacimiento(this.dateFechaNace.value()));
        }
      },
      {
        input: '.generoInput', message: 'Seleccione Género', action: 'change',
        rule: (input: any, commit: any): any => {
          let selectedIndex = this.comboGenero.getSelectedIndex()
          if (selectedIndex) { return false; };
        }
      },
      {
        input: '.ramaInput', message: 'Seleccione una Rama', action: 'change',
        rule: (input: any, commit: any): any => {
          let selectedIndex = this.comboRama.getSelectedIndex()
          if (selectedIndex) { return false; };
        }
      },
      {
        input: '.grupoInput', message: 'Seleccione Grupo', action: 'change',
        rule: (input: any, commit: any): any => {
          let selectedIndex = this.comboGrupo.getSelectedIndex()
          if (selectedIndex) { return false; };
        }
      },
      {
        input: '.tipoScoutsInput', message: 'Seleccione un Tipo de Scout', action: 'change',
        rule: (input: any, commit: any): any => {
          let selectedIndex = this.comboTipoScout.getSelectedIndex()
          if (selectedIndex) { return false; };
        }
      },
      { input: '.correoInput', message: 'E-mail requerido!', action: 'keyup, blur', rule: 'required' },
      { input: '.correoInput', message: 'E-mail incorrecto!', action: 'keyup', rule: 'email' },
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
      { input: '.usuarioInput', message: 'Usuario requerido!', action: 'keyup, blur', rule: 'required' },
      { input: '.passwordInput', message: 'Contraseña requerida!', action: 'keyup, blur', rule: 'required' },
      { input: '.passwordInputCon', message: 'Verificación de contraseña requerida!', action: 'keyup, blur', rule: 'required' },
      {
        input: '.passwordInputCon', message: 'Las contraseñas no coinciden', action: 'keyup, change, blur',
        rule: (input: any, commit: any): any => {
          return (this.verificarCoincideClave())
        }
      },
      {
        input: '.anioDesdeInput', message: 'Año de edición requerido!', action: 'keyup, blur',
        rule: (input: any, commit: any): any => {
          if (!this.txtAnioDesde.val() || this.txtAnioDesde.val() == 0) { return false; };
        }
      },
      {
        input: '.anioDesdeInput', message: 'Año de edición  debe tener 4 caracteres!', action: 'keyup', rule: (input: any, commit: any): any => {
          if (this.txtAnioDesde.val())
            if (Number(this.txtAnioDesde.val()) < 1000) { return false; };
        }
      },
      {
        input: '.anioHastaInput', message: 'Año de edición requerido!', action: 'keyup, blur',
        rule: (input: any, commit: any): any => {
          if (!this.txtAnioHasta.val() || this.txtAnioHasta .val() == 0) { return false; };
        }
      },
      {
        input: '.anioHastaInput', message: 'Año de edición  debe tener 4 caracteres!', action: 'keyup', rule: (input: any, commit: any): any => {
          if (this.txtAnioHasta.val())
            if (Number(this.txtAnioHasta.val()) < 1000) { return false; };
        }
      },
      {
        input: '.anioHastaInput', message: 'Año de hasta  debe ser mayor o igual al año desde!', action: 'keyup', rule: (input: any, commit: any): any => {
          if (this.txtAnioHasta.val())
            if (Number(this.txtAnioHasta.val()) > 2020) { return false; };
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
    if (!this.validarCedulaPasaporte(this.txtIdenficacion.val())) {
      valido = false
      return valido
    }
    if (!this.validadorService.validaApellidos(this.txtApellidos.val())) {
      valido = false
      return valido
    }
    if (!this.validaFechaNacimiento(this.dateFechaNace.value())) {
      valido = false
      return valido
    }
    if (!this.validadorService.validaMails(this.txtEmailPersonal.val())) {
      valido = false
      return valido
    }
    if (!this.validadorService.validaCelular(this.masketCelular.val())) {
      valido = false
      return valido
    }
    if (!this.validadorService.validaDireccion(this.txtAreaDireccion.val())) {
      valido = false
      return valido
    }
    if (!this.comboGenero.val()) {
      valido = false
      return valido
    }
    if (!this.comboTipoScout.val() || !this.comboGrupo.val() || !this.comboRama.val()) {
      valido = false
      return valido
    }
    if (this.idTipoPar == 'com') {
      if (!this.txtAnioDesde.val() || !this.txtAnioHasta.val()) {
        valido = false
        return valido
      }
    }
    return valido
  }

  validaFechaNacimiento(fecha: any) {
    //valida edad entre 16 y 70 años
    let fecha_actual = new Date();
    let yearTo = fecha_actual.getFullYear() - 5;
    let yearFrom = fecha_actual.getFullYear() - 60;
    let date = new Date(fecha)
    let result = date.getFullYear() >= yearFrom && date.getFullYear() <= yearTo;
    return result;
  }
}
