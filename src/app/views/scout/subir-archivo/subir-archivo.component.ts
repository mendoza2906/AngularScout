import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { jqxNumberInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxnumberinput';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { Subscription } from 'rxjs';
import { ScoutService } from '../../../services/scout/scout.service';
import { jqxPanelComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxPanel';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-subir-archivo',
  templateUrl: './subir-archivo.component.html',
  styleUrls: ['./subir-archivo.component.scss']
})
export class SubirArchivoComponent implements OnInit {
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('txtDescripcion') txtDescripcion: jqxTextAreaComponent;
  @ViewChild('txtTitulo') txtTitulo: jqxInputComponent;
  @ViewChild('txtDocencia') txtDocencia: jqxNumberInputComponent;
  @ViewChild('jqxMenu') jqxMenu: jqxMenuComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;
  @ViewChild('dateFechaClase') dateFechaClase: jqxDateTimeInputComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('myPanel') myPanel: jqxPanelComponent;
  @ViewChild('sanitizer') sanitizer: DomSanitizer;
  img: any;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private ScoutService: ScoutService,
    public messagerService: MessagerService) { }

  sub: Subscription;
  documentoAng: any = {};
  varFechaClase: any = new Date();
  editrow: number = -1;
  idContenidoPar: number
  idPlanClasePar: number
  labelRecursoBiblio: string
  recursosBibliograficosTemp = new Array();
  banderaDatosValidos: boolean = false
  varHorasDoc: number;

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.idContenidoPar = params['idContenido'];
      this.idPlanClasePar = params['idPlanClase'];
      // Evalua si el parametro id se paso.
      // this.recuperarDocumentoId(1)
      if (this.idContenidoPar) {
        // this.recuperarContenidoId(this.idContenidoPar)
      }
      if (this.idPlanClasePar == 0) {
        // this.nuevoPlanClase()
      } else {
        // this.editarPlanClase(this.idPlanClasePar)
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

    {
      'text': 'Eliminar',
      'id': '3',
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
        this.myValidator.validate(document.getElementById('formPlanClase'));
        if (this.banderaDatosValidos == true) {

          this.myModal.alertQuestion({
            title: 'Registro de Clases',
            msg: '¿Desea grabar sus registros?',
            result: (k) => {
              if (k) {
                this.addActivity()
              }
            }
          })
        } else {
          this.myModal.alertMessage({
            title: 'Registro de Clases',
            msg: 'Verifique que todos los campos esten llenados correctamente!'
          })
        }
        break;
      case 'Cancelar':
        // this.gotoList();
        this.myValidator.hide();
        break;
      case 'Eliminar':
        //  this.gotoList();
        //    this.eliminar();
        break;
      default:
    }
  };

  ValidationSuccess(event: any): void {
    this.banderaDatosValidos = true
  }




  valueChangedFechaClase() {
    let fechaClase: Date
    fechaClase = this.dateFechaClase.value()
    this.varFechaClase = fechaClase
    // if (this.planClaseAng) {
    //   this.planClaseAng.fechaClase = fechaClase
    // }
  }


  nuevoDocumento() {
    //PARA ARAMAR EL JASON PERSONA 
    this.documentoAng.id = null
    this.documentoAng.estado = "A"
    this.documentoAng.version = "0"
  }

  // b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  //   const byteCharacters = atob(b64Data);
  //   const byteArrays = [];

  //   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
  //     const slice = byteCharacters.slice(offset, offset + sliceSize);

  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }

  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }

  //   const blob = new Blob(byteArrays, { type: contentType });
  //   return blob;
  // }

  recuperarDocumentoId(idDocumento: number) {
    this.ScoutService.getRecuperarDocumentoId(idDocumento).subscribe(data => {
      if (data) {
        this.documentoAng = data
        alert(data.rutaArchivo)
        const img = this.sanitizer.bypassSecurityTrustUrl((data.rutaArchivo));
        this.img = img;
      }

    }, response => {
      console.log("POST - getThumbnail - in error", response);
    },
      () => {
        console.log("POST - getThumbnail - observable is now completed.");
      });

  }

  addActivity() {

    let fileInput: any = document.getElementById("img");
    let files = fileInput.files[0];

    let imgPromise = this.getFileBlob(files);

    imgPromise.then(blob => {
      this.nuevoDocumento()
      this.documentoAng.rutaArchivo = blob;
      this.ScoutService.post(this.documentoAng)
        .subscribe(
          data => { let response = data.json(); if (!response.error) { alert("Actividad Creada!"); } else { alert(response.msg) } },
          err => console.log(err),
          () => console.log("Post Request Lista!")
        );

    }).catch(e => console.log(e));
  }


  /*
  *
  * Método para convertir una URL de un archivo en un
  * blob
  * @author: pabhoz
  *
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

  // dataURItoBlob(dataURI) {
  //   // convert base64/URLEncoded data component to raw binary data held in a string
  //   var byteString;
  //   if (dataURI.split(',')[0].indexOf('base64') >= 0)
  //     byteString = atob(dataURI.split(',')[1]);
  //   else
  //     byteString = unescape(dataURI.split(',')[1]);

  //   // separate out the mime component
  //   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  //   // write the bytes of the string to a typed array
  //   var ia = new Uint8Array(byteString.length);
  //   for (var i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }

  //   return new Blob([ia], { type: mimeString });
  // }

  onSelect(event: any): void {
    let args = event.args;
    let fileName = args.file;
    let fileSize = args.size;
    this.myPanel.append('<strong>' + event.type + ':</strong> ' +
      fileName + ';<br />' + 'size: ' + fileSize + '<br />');
  };

  onRemove(event: any): void {
    let fileName = event.args.file;
    this.myPanel.append('<strong>' + event.type + ':</strong> ' + fileName + '<br />');
  };

  onUploadStart(event: any): void {
    let fileName = event.args.file;
    this.myPanel.append('<strong>' + event.type + ':</strong> ' + fileName + '<br />');
  };

  onUploadEnd(event: any): void {
    let args = event.args;
    let fileName = args.file;
    let serverResponce = args.response;
    this.myPanel.append('<strong>' + event.type + ':</strong> ' +
      fileName + ';<br />' + 'server response: ' + serverResponce + '<br />');
  };

}
