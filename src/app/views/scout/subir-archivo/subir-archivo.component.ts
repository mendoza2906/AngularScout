import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { Subscription } from 'rxjs';
import { ScoutService } from '../../../services/scout/scout.service';
import { jqxPanelComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxPanel';
import { DomSanitizer } from '@angular/platform-browser';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { jqxCheckBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcheckbox';
import { ResponseContentType } from '@angular/http';
import { Base64Util } from '../../../util/base-64-util';


@Component({
  selector: 'app-subir-archivo',
  templateUrl: './subir-archivo.component.html',
  styleUrls: ['./subir-archivo.component.scss']
})
export class SubirArchivoComponent implements OnInit {
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('txtDescripcion') txtDescripcion: jqxTextAreaComponent;
  @ViewChild('txtObservacion') txtObservacion: jqxTextAreaComponent;
  @ViewChild('txtTitulo') txtTitulo: jqxInputComponent;
  @ViewChild('jqxMenu') jqxMenu: jqxMenuComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;
  @ViewChild('dateFechaClase') dateFechaClase: jqxDateTimeInputComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('myPanel') myPanel: jqxPanelComponent;
  @ViewChild('comboMedico') comboMedico: jqxComboBoxComponent;
  @ViewChild('sanitizer') sanitizer: DomSanitizer;
  @ViewChild('chbAprobado') chbAprobado: jqxCheckBoxComponent;
  img: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private ScoutService: ScoutService,
    public messagerService: MessagerService) { }

  sub: Subscription;
  documentoAng: any = {};
  scoutModulosAng: any = {}
  varFechaClase: any = new Date();
  editrow: number = -1;
  idScoutPar: number
  idScoutLogeado: number
  idModuloUltimo: number;
  labelUltimoModuloHabilitado: string
  labelTitulo:string
  labelDescripcion:string
  codigoPerfil: string
  ocultarAdmin: boolean = false
  ocultarBen: boolean = false
  labelDescripcionModulo: string
  banderaDatosValidos: boolean = false
  banderaSubioArchivo: boolean = false
  imagenDefecto: string = 'assets/file.jpg'
  pdfSrc: string = '';
  pdfSrc64: any;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.idScoutPar = params['idScout'];
      // Evalua si el parametro id se paso.
      this.recuperarIdScout()
      this.idScoutLogeado = this.idScoutPar
      this.recuperarUltimaModuloInsignia(this.idScoutLogeado)
      if (this.codigoPerfil == 'BEN') {
        this.ocultarBen = true
      } else {
        this.ocultarAdmin = true
      }
    });
  }

  recuperarIdScout() {
    if (localStorage.getItem('datosScout')) {
      let datosUsuario = JSON.parse(localStorage.getItem('datosScout'));
      this.idScoutLogeado = datosUsuario[0].idScout
      this.codigoPerfil = datosUsuario[0].codigo
    }
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
    var opt = event.args.innerText;
    switch (opt) {
      case 'Grabar':
        this.generarImagen()
        if (this.documentoAng.rutaArchivo)
         { this.banderaSubioArchivo = true }
        this.scoutModulosAng.aprobado = this.chbAprobado.val()
        this.myValidator.validate(document.getElementById('formArchivos'));
        if (this.validaDatos()) {
          if (this.banderaSubioArchivo == false) {
            this.myModal.alertMessage({
              title: 'Registro de Documentación',
              msg: 'Carque un archivo!'
            })
          } else {
            this.myModal.alertQuestion({
              title: 'Registro de Documentación',
              msg: '¿Desea grabar sus registros?',
              result: (k) => {
                if (k) {
                  this.ScoutService.grabarDocumentoModulos(this.documentoAng).subscribe(result => {
                    if(this.codigoPerfil=='BEN'){
                      this.myModal.alertMessage({
                        title: 'Registro de Documentación',
                        msg: 'Documento Subido Exitosamente!'
                      })
                    }else{
                      this.myModal.alertMessage({
                        title: 'Revisión de Módulo',
                        msg: 'Revisión realizada Exitosamente!'
                      })
                    }
                  }, error => console.error(error));
                }
              }
            })
          }
        } else {
          this.myModal.alertMessage({
            title: 'Registro de Documentación',
            msg: 'Verifique que todos los campos esten llenados correctamente!'
          })
        }
        break;
      case 'Cancelar':
        this.myValidator.hide();
        this.router.navigate(['scout/revisar-progresion', this.idScoutPar]);
        break;
      default:
    }
  };

  ValidationSuccess(event: any): void {
    this.banderaDatosValidos = true
  }

  nuevoDocumento() {
    this.documentoAng.id = null
    this.documentoAng.estado = "A"
    this.documentoAng.version = "0"
    // this.documentoAng.rutaArchivo = 'assets/file.jpg'
    this.documentoAng.scoutModulos = []
    this.scoutModulosAng.id = null
    this.scoutModulosAng.idModulo = this.idModuloUltimo
    this.scoutModulosAng.idScout = this.idScoutLogeado
    // this.scoutModulosAng.idScout = 10
    this.scoutModulosAng.idDocumento = null
    this.scoutModulosAng.aprobado = 0
    this.scoutModulosAng.observacion = null
    // let fechaIngresoE = new Date();
    // var fechaEnMiliseg = Date.now();
    // this.scoutModulosAng.fechaEntrega == fechaEnMiliseg
    this.scoutModulosAng.estado = 'A'
    this.scoutModulosAng.version = 0
    this.documentoAng.scoutModulos.push(this.scoutModulosAng)
  }

  recuperarUltimaModuloInsignia(idScoutLogeado: number) {
    this.ScoutService.getRecuperarUltimaModuloInsignia(idScoutLogeado).subscribe(data => {
      if (data.length > 0) {
        this.idModuloUltimo = data[0].idModulo
        this.labelUltimoModuloHabilitado = data[0].modulo
        this.labelDescripcionModulo = data[0].descripcion
        this.buscarPorScoutModulo(this.idModuloUltimo, idScoutLogeado)
      }
    });
  }

  recuperarDocumentoId(idDocumento: number) {
    this.ScoutService.getRecuperarDocumentoId(idDocumento).subscribe(data => {
      if (data) {
        this.documentoAng = data
        this.scoutModulosAng = data.scoutModulos[0]
        this.chbAprobado.checked(data.scoutModulos[0].aprobado)
        this.imagenDefecto = data.rutaArchivo
        this.labelTitulo=data.titulo
        this.labelDescripcion=data.descripcion
      }
    })
  }

  buscarPorScoutModulo(IdModulo: number, idScout: number) {
    this.ScoutService.getBuscarPorScoutModulo(IdModulo, idScout).subscribe(data => {
      if (data) {
        this.recuperarDocumentoId(data.idDocumento)
      } else {
        this.nuevoDocumento()
      }
    })
  }


  localization: any = {
    browseButton: 'Buscar Archivo',
    uploadButton: 'Subir Todo',
    cancelButton: 'Cancelar Todo',
    uploadFileTooltip: 'Subir Archivo',
    cancelFileTooltip: 'Cancelar'
  }

  generarImagen() {
    let fileInput: any = document.getElementById("img");
    let files = fileInput.files[0];
    // alert(this.documentoAng.rutaArchivo + 'XD' + files)
    // if (this.documentoAng.rutaArchivo && files) {
    if (files) {
      this.banderaSubioArchivo = true
      let arregloDeSubCadenas = files.type.split("/", 2);
      // console.log(files.type + ' XD ' + arregloDeSubCadenas[1]);
      let imgPromise = this.getFileBlob(files);
      imgPromise.then(blob => {

        this.documentoAng.rutaArchivo = blob;
        if (arregloDeSubCadenas[1] == 'pdf') {
          // alert('si es pdf')
          // // this.mostrarPDF(blob)
          // this.pdfSrc64=this.documentoAng.rutaArchivo
        } else {
          this.imagenDefecto = this.documentoAng.rutaArchivo
        }
      }).catch(e => console.log(e));
    }
    // }
  }



  /*
  * Método para convertir una URL de un archivo en un blob
  */

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


  mostrarPDF(blobDocumento: any) {
    // Para navegadores de Microsoft.
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blobDocumento);
    }
    const objectUrl = window.URL.createObjectURL(blobDocumento);
    const enlace = document.createElement('a');
    enlace.href = objectUrl;
    this.pdfSrc = "";
    this.pdfSrc = enlace.href;
  }

  validaDatos(): boolean {
    let valido = true
    if (this.codigoPerfil == 'BEN') {
      if (!this.txtTitulo.val()) {
        valido = false
        return valido
      }
      if (!this.txtDescripcion.val()) {
        valido = false
        return valido
      }
    }
    this.recuperarIdScout()
    if (this.codigoPerfil != 'BEN') {
      if (!this.txtObservacion.val()) {
        valido = false
        return valido
      }
    }
    return valido
  }

  //Reglas de validación formulario
  rules =
    [
      { input: '.tituloInput', message: 'Título requerido!', action: 'keyup, blur', rule: 'required' },
      { input: '.tituloInput', message: 'Título debe tener entre 10 y 50 caracteres!', action: 'keyup', rule: 'length=10,50' },
      { input: '.observacionInput', message: 'Observación requerida!', action: 'keyup, blur', rule: 'required' },
      { input: '.observacionInput', message: 'Observación deben contener solo letras!', action: 'keyup', rule: 'notNumber' },
      { input: '.observacionInput', message: 'Observación deben tener entre 10 y 100 caracteress!', action: 'keyup', rule: 'length=10,100' },
      { input: '.descripcionInput', message: 'Descripción requerida!', action: 'keyup, blur', rule: 'required' },
      { input: '.descripcionInput', message: 'Descripción deben contener solo letras!', action: 'keyup', rule: 'notNumber' },
      { input: '.descripcionInput', message: 'Descripción deben tener entre 10 y 100 caracteress!', action: 'keyup', rule: 'length=10,100' },
    ];
}
