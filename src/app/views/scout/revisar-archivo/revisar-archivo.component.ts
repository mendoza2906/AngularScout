import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxListBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxwindow';
import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { jqxNumberInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxnumberinput';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxCheckBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcheckbox';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';
import { Subscription } from 'rxjs';
import { ScoutService } from '../../../services/scout/scout.service';


@Component({
  selector: 'app-revisar-archivo',
  templateUrl: './revisar-archivo.component.html',
  styleUrls: ['./revisar-archivo.component.scss']
})
export class RevisarArchivoComponent implements OnInit {
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('listBoxMetodologias') listBoxMetodologias: jqxListBoxComponent;
  @ViewChild('listBoxEvaluaciones') listBoxEvaluaciones: jqxListBoxComponent;
  @ViewChild('txtAreaContenido') txtAreaContenido: jqxTextAreaComponent;
  @ViewChild('txtAreaRecursosDid') txtAreaRecursosDid: jqxTextAreaComponent;
  @ViewChild('txtAreaResultadoApren') txtAreaResultadoApren: jqxTextAreaComponent;
  @ViewChild('txtTemaContenido') txtTemaContenido: jqxInputComponent;
  @ViewChild('txtDocencia') txtDocencia: jqxNumberInputComponent;
  @ViewChild('txtPractica') txtPractica: jqxNumberInputComponent;
  @ViewChild('txtTrabajo') txtTrabajo: jqxNumberInputComponent;
  @ViewChild('myWindow') myWindow: jqxWindowComponent;
  @ViewChild('gridBibliografia', { read: false }) gridBibliografia: jqxGridComponent;
  @ViewChild('jqxMenu') jqxMenu: jqxMenuComponent;
  @ViewChild('menuAgregar') menuAgregar: jqxMenuComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;
  @ViewChild('dateFechaClase') dateFechaClase: jqxDateTimeInputComponent;
  @ViewChild('chbAutoeva') chbAutoeva: jqxCheckBoxComponent;
  @ViewChild('chbCoeva') chbCoeva: jqxCheckBoxComponent;
  @ViewChild('chbHeteroeva') chbHeteroeva: jqxCheckBoxComponent;
  @ViewChild('comboRecursoBiblio') comboRecursoBiblio: jqxComboBoxComponent;
  @ViewChild('txtPagDesde') txtPagDesde: jqxNumberInputComponent;
  @ViewChild('txtPagHasta') txtPagHasta: jqxNumberInputComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private opcionesAsignaturaService: ScoutService,
    public messagerService: MessagerService) { }

  sub: Subscription;
  planClaseAng: any = {};
  planBibliografias: any = {};
  planEstrategias: any = {};
  planMetodologias: any = {};
  varFechaClase: any = new Date();
  editrow: number = -1;
  idContenidoPar: number
  idPlanClasePar: number
  labelRecursoBiblio: string
  recursosBibliograficosTemp = new Array();
  banderaDatosValidos: boolean = false
  varHorasDoc: number;
  varhorasAEA: number;
  varHorasTA: number;
  mensajeDOc: string = '';
  mensajePrac: string = '';
  mensajeTra: string = '';

  idOfertaPar: number
  idPeriodoPar: number
  idMallaAsignaturaPar: number
  idDocentePar: number
  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.idContenidoPar = params['idContenido'];
      this.idPlanClasePar = params['idPlanClase'];

      this.idOfertaPar = params['idOferta'];
      this.idPeriodoPar = params['idPeriodo'];
      this.idMallaAsignaturaPar = params['idMallaAsignatura'];
      this.idDocentePar = params['idDocente'];
      // Evalua si el parametro id se paso.
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
                // this.opcionesAsignaturaService.grabarPlanClase(this.planClaseAng).subscribe(result => {
                //   this.gotoList();
                // }, error => console.error(error));
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
    if (this.planClaseAng) {
      this.planClaseAng.fechaClase = fechaClase
    }
  }


}
