import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, } from '@angular/core';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { Button } from 'selenium-webdriver';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';


@Component({
  selector: 'app-matricula-detalle',
  templateUrl: './matricula-detalle.component.html',
  styleUrls: ['./matricula-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MatriculaDetalleComponent implements OnInit {
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('Events') Events: ElementRef;
  @ViewChild('myGridHistorialMatricula') myGridHistorialMatricula: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('myButtonVolver') myButtonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;
  sub: Subscription;
  distributivoOferta: any = [];

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private matriculasService: MatriculasService
  ) { }

  //arreglo de los distributivosDocentes y DocenteDedicacion
  estudianteMatriculado: any = [];


  // json para eliminar distributivosDocentes y DocenteDedicacion
  listaDocentesJson: any = [];

  //Variables 
  idEstudianteOfertapar: string;
  nombres: string;
  numeroMatricula: string;
  editrow: number = -1;
  pdfSrc: string = '';
  isCollapsed: boolean = false;
  isCollapsedPdf: boolean = true;
  labelNombres: string;
  labelNumeroMatricula: string;

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      // Recupera el valor del parametro pasado en la ruta.
      this.idEstudianteOfertapar = params['idEstudianteOferta'];

      // Evalua si el parametro id se paso.
      if (this.idEstudianteOfertapar) {
        this.listarEstudiante(this.idEstudianteOfertapar);
        this.detalleMatricula(this.idEstudianteOfertapar);
      }
    });

  }

  ngOnDestroy(): void {
    //this.sub.unsubscribe();
  }

  gotoList() {
    this.router.navigate(['/matriculas']);
  }


  data1 = [
    {
      'id': '1',
      'text': 'Volver',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
  ];

  source2 =
    {
      datatype: 'json',
      datafields: [
        { name: 'id' },
        { name: 'parentid' },
        { name: 'text' },
        { name: 'subMenuWidth' }
      ],
      id: 'id',
      localdata: this.data1
    };
  getAdapter(source1: any): any {
    // create data adapter and perform data
    return new jqx.dataAdapter(this.source2, { autoBind: true });
  };
  menus = this.getAdapter(this.source2).getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);


  itemclick(event: any): void {

    var opt = event.args.innerText;
    switch (opt) {

      case 'Volver':
        this.router.navigate(['matriculas/matricula-lista-estudiante']);
        break;
      default:
      //default code block
    }
  };


  listarEstudiante(idEstudianteOferta: string) {
    this.matriculasService.getListarMatriculasEstudiante(idEstudianteOferta).subscribe(data => {
      this.sourceRecuperaEstudianteMatriculados.localdata = data;
      this.estudianteMatriculado = data;
      this.labelNombres = this.estudianteMatriculado[0].nombres
      this.labelNumeroMatricula = this.estudianteMatriculado[0].numeroMatricula
      this.dataAdapterListaEstudiantes.dataBind();
    });
  }

  camposRecuperaEstudianteMatriculados: any[] =
    [
      { name: 'id', map: 'idEstudianteMatricula', type: 'string' },
      { name: 'nombres', map: 'nombres', type: 'string' },
      { name: 'numeroMatricula', map: 'numeroMatricula', type: 'string' },
      { name: 'codigoPeriodoAcademico', map: 'codigoPeriodoAcademico', type: 'string' },
      { name: 'periodoAcademico', map: 'periodoAcademico', type: 'string' }
    ];

  sourceRecuperaEstudianteMatriculados: any =
    {
      localData:
        [],
      id: 'id',
      dataType: 'array',
      dataFields: this.camposRecuperaEstudianteMatriculados
    };
  dataAdapterListaEstudiantes: any = new jqx.dataAdapter(this.sourceRecuperaEstudianteMatriculados);


  getWidth(): any {
    if (document.body.offsetWidth < 1800) {
      return '90%';
    }
    return 850;
  }


  detalleMatricula(idEstudianteOferta: string) {
    this.matriculasService.getListaAsignaturasMatriculadasPeriodo(idEstudianteOferta).subscribe(data => {
      this.sourceRecuperarDetalleMatricula.localdata = data;
      this.dataAdapterRecuperaDetalleMatricula.dataBind();
    });
  }

  camposDetalleMatricula: any[] =
    [
      { name: 'id', map: 'idEstudianteMatricula', type: 'string' },
      { name: 'codigoJ', map: 'codigoAsignatura', type: 'string' },
      { name: 'ordenJ', map: 'orden', type: 'string' },
      { name: 'nombreAsignaturaJ', map: 'nombreAsignatura', type: 'string' },
      { name: 'paraleloJ', map: 'paralelo', type: 'string' }
    ];

  sourceRecuperarDetalleMatricula: any =
    {
      localData:
        [],
      id: 'id',
      dataType: 'array',
      dataFields: this.camposDetalleMatricula
    };
  dataAdapterRecuperaDetalleMatricula: any = new jqx.dataAdapter(this.sourceRecuperarDetalleMatricula, { autoBind: true });

  nestedGrids: any[] = new Array();


  // create nested grid.
  initRowDetails = (index: number, parentElement: any, gridElement: any, record: any): void => {
    let id = record.uid.toString();
    let nestedGridContainer = parentElement.children[0];
    this.nestedGrids[index] = nestedGridContainer;
    let filtergroup = new jqx.filter();
    let filter_or_operator = 1;
    let filtervalue = id;
    let filtercondition = 'equal';
    let filter = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);
    // fill the orders depending on the id.
    let orders = this.dataAdapterRecuperaDetalleMatricula.records;
    let ordersbyid = [];

    for (let i = 0; i < orders.length; i++) {
      let result = filter.evaluate(orders[i]['id']);
      if (result)
        ordersbyid.push(orders[i]);
    }

    let sourceRecuperarDetalleMatricula = {
      datafields: [
        { name: 'codigoJ', type: 'string' },
        { name: 'ordenJ', type: 'string' },
        { name: 'nombreAsignaturaJ', type: 'string' },
        { name: 'paraleloJ', type: 'string' }
      ],
      id: 'id',
      localdata: ordersbyid
    }
    let nestedGridAdapter = new jqx.dataAdapter(sourceRecuperarDetalleMatricula);

    if (nestedGridContainer != null) {
      let settings = {
        theme: 'darkblue',
        width: '85%',
        height: '90%',
        source: nestedGridAdapter,
        columns: [
          { text: 'Codigo', datafield: 'codigoJ', width: '20%' },
          { text: 'Asignatura', datafield: 'nombreAsignaturaJ', width: '30%' },
          { text: 'Paralelo', datafield: 'paraleloJ', width: '10%' },
        ]
      };
      jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
    }
  }

  renderer = (row: number, column: any, value: string): string => {
    return '<span style="margin-left: 4px; margin-top: 9px; float: left;">' + value + '</span>';
  }
  rowdetailstemplate: any = {
    rowdetails: '<div id="nestedGrid" style="margin: 10px;"></div>', rowdetailsheight: 250, rowdetailshidden: true
  };
  ready = (): void => {
    this.myGridHistorialMatricula.showrowdetails(1);
  };


  columns: any[] =
    [
      { text: 'Id Estudiante Matricula', datafield: 'id', width: '6%', cellsrenderer: this.renderer },
      { text: 'Abreviatura', datafield: 'codigoPeriodoAcademico', filtertype: 'input', width: '20%', cellsrenderer: this.renderer },
      { text: 'Periodo Academico', datafield: 'periodoAcademico', filtertype: 'input', width: '40%', cellsrenderer: this.renderer },
      {
        text: 'Csomprobante', datafield: '', columnType: 'button', width: '30%',cellsrenderer: (): String => {
          return 'Visualizar';
        },
        buttonclick: (row: number): void => {
          //get the data and append in to the inputs
          this.editrow = row;
          let dataRecord = this.myGridHistorialMatricula.getrowdata(this.editrow);
          this.verComprobanteMatricula(dataRecord.id,0);
        }

      },


    ];

  verComprobanteMatricula(idEstudianteMatricula: number,idEstudianteOferta: number) {
    this.myGridHistorialMatricula.selectionmode.length;
    this.ocultarReporte();

    this.matriculasService.getComprobanteMatriculaAnteriores(idEstudianteMatricula,idEstudianteOferta
    ).subscribe((blob: Blob) => {
        // Para navegadores de Microsoft.
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
        }
        let filename = "";
        filename = this.nombreArchivo();
        const objectUrl = window.URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = objectUrl;
        this.pdfSrc = "";
        this.pdfSrc = enlace.href;
      });
  }

  nombreArchivo ():string{
    let filename="";
    var fecha = new Date();
    filename=fecha.getHours()+"_"+fecha.getMinutes()+"_"+fecha.getDate()+"_"
                  +fecha.getMonth()+"_"
                  +fecha.getFullYear()
    return filename;
  }

  controlIsCollapsed(){
    this.mostrarReporte();
    this.isCollapsed = !this.isCollapsed;
    this.pdfSrc="";
    this.isCollapsedPdf=!this.isCollapsedPdf
  }

  mostrarReporte(){
    
    this.myButtonVolver.disabled(true);
    this.myPdfViewer.showPrintButton=true;
  }
  ocultarReporte(){
    this.isCollapsed = !this.isCollapsed;
    this.isCollapsedPdf=!this.isCollapsedPdf
    this.myButtonVolver.disabled(false);
    //this.myPdfViewer.showPrintButton=true;
  }


}