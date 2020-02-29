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

@Component({
  selector: 'app-noticia-edicion',
  templateUrl: './noticia-edicion.component.html',
  styleUrls: ['./noticia-edicion.component.scss']
})
export class NoticiaEdicionComponent implements OnInit {
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('txtContenido') txtContenido: jqxTextAreaComponent;
  @ViewChild('txtTitulo') txtTitulo: jqxInputComponent;
  @ViewChild('txtFuente') txtFuente: jqxInputComponent;
  @ViewChild('jqxMenu') jqxMenu: jqxMenuComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;
  @ViewChild('dateFechaClase') dateFechaClase: jqxDateTimeInputComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('myPanel') myPanel: jqxPanelComponent;

  img: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private ScoutService: ScoutService,
    public messagerService: MessagerService) { }

  sub: Subscription;
  noticiaAng: any = {};
  varFechaClase: any = new Date();
  editrow: number = -1;
  idNoticiaPar: number

  banderaDatosValidos: boolean = false
  banderaSubioArchivo: boolean = false
  imagenDefecto: string = 'assets/file.jpg'
  pdfSrc: string = '';
  pdfSrc64: any;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.idNoticiaPar = params['idNoticia'];
      // Evalua si el parametro id se paso.
      if (this.idNoticiaPar == 0) {
        this.nuevoDocumento()
      }else{
        this.recuperarDocumentoId(this.idNoticiaPar)
      }

    });
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
        if (this.noticiaAng.urlImg) { this.banderaSubioArchivo = true }
        this.myValidator.validate(document.getElementById('formNoticias'));
        if (this.banderaDatosValidos) {
          if (this.banderaSubioArchivo == false) {
            this.myModal.alertMessage({
              title: 'Registro de Noticias',
              msg: 'Carque un archivo!'
            })
          } else {
            this.myModal.alertQuestion({
              title: 'Registro de Noticias',
              msg: '¿Desea grabar sus registros?',
              result: (k) => {
                if (k) {
                  this.ScoutService.grabarNoticia(this.noticiaAng).subscribe(result => {
                    // this.myModal.alertMessage({
                    //   title: 'Registro de Noticias',
                    //   msg: 'Documento Subido Exitosamente!'
                    // })
                    this.gotoList()
                  }, error => console.error(error));
                }
              }
            })
          }
        } else {
          this.myModal.alertMessage({
            title: 'Registro de Noticias',
            msg: 'Verifique que todos los campos esten llenados correctamente!'
          })
        }
        break;
      case 'Cancelar':
        this.myValidator.hide();
        this.router.navigate(['scout/noticia-listado']);
        break;
      default:
    }
  };

  gotoList(){
    this.router.navigate(['scout/noticia-listado']);
  }

  ValidationSuccess(event: any): void {
    this.banderaDatosValidos = true
  }

  nuevoDocumento() {
    this.noticiaAng.id = null
    this.noticiaAng.estado = "A"
    this.noticiaAng.version = "0"
    this.noticiaAng.fechaPublic = new Date()
    this.noticiaAng.urlImg = this.imagenDefecto
    // this.noticiaAng.scoutModulos = []
  }



  recuperarDocumentoId(idNoticia: number) {
    this.ScoutService.getRecuperarNoticiaId(idNoticia).subscribe(data => {
      if (data) {
        this.noticiaAng = data
        this.imagenDefecto = data.urlImg
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
      console.log(files.type + ' XD ' + arregloDeSubCadenas[1]);
      let imgPromise = this.getFileBlob(files);
      imgPromise.then(blob => {

        this.noticiaAng.rutaArchivo = blob;
        if (arregloDeSubCadenas[1] == 'pdf') {
          // alert('si es pdf')
          // // this.mostrarPDF(blob)
          // this.pdfSrc64=this.documentoAng.rutaArchivo
        } else {
          this.imagenDefecto = this.noticiaAng.rutaArchivo
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
    if (!this.txtTitulo.val()) {
      valido = false
      return valido
    }
    if (!this.txtFuente.val()) {
      valido = false
      return valido
    }
    if (!this.txtContenido.val()) {
      valido = false
      return valido
    }
    return valido
  }

  //Reglas de validación formulario
  rules =
    [
      { input: '.tituloInput', message: 'Título requerido!', action: 'keyup, blur', rule: 'required' },
      { input: '.tituloInput', message: 'Título debe tener entre 10 y 50 caracteres!', action: 'keyup', rule: 'length=10,50' },
      { input: '.contenidoInput', message: 'Contenido requerido!', action: 'keyup, blur', rule: 'required' },
      { input: '.contenidoInput', message: 'Contenido debe contener solo letras!', action: 'keyup', rule: 'notNumber' },
      { input: '.contenidoInput', message: 'Contenido debe tener entre 10 y 100 caracteress!', action: 'keyup', rule: 'length=10,100' },
      { input: '.fuenteInput', message: 'Fuente requerida!', action: 'keyup, blur', rule: 'required' },
      { input: '.fuenteInput', message: 'Fuente debe contener solo letras!', action: 'keyup', rule: 'notNumber' },
      { input: '.fuenteInput', message: 'Fuente debe tener entre 10 y 100 caracteress!', action: 'keyup', rule: 'length=10,100' },
    ];
}
