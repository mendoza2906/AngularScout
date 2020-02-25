import { OnInit, AfterViewInit, ElementRef, ViewChild, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { jqxTextAreaComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtextarea';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxdatetimeinput';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { ScoutService } from '../../../services/scout/scout.service';
import { Subscription } from 'rxjs';
import { RoundProgressComponent, RoundProgressModule, RoundProgressService } from 'angular-svg-round-progressbar';

@Component({
  selector: 'app-revisar-progresion',
  templateUrl: './revisar-progresion.component.html',
  styleUrls: ['./revisar-progresion.component.scss']
})
export class RevisarProgresionComponent implements OnInit, AfterViewInit {
  @ViewChild('eventLog') eventLog: ElementRef;
  @ViewChild('gridListaCitas') gridListaCitas: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('botonRegresar') botonRegresar: jqxButtonComponent;
  @ViewChild('botonRevisar') botonRevisar: jqxButtonComponent;
  @ViewChild('txtObservacion') txtObservacion: jqxTextAreaComponent;
  @ViewChild('dateFechaCita') dateFechaCita: jqxDateTimeInputComponent;
  @ViewChild('txtMotivoConsulta') txtMotivoConsulta: jqxInputComponent;
  @ViewChild('progresInsignia') progresInsignia: RoundProgressComponent;


  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private ScoutService: ScoutService,
    private validadorService: ValidadorService,
    private prosService: RoundProgressService
  ) { }

  //Variable paa cargar datos del objeto 
  sub: Subscription;
  //declaraciones para ordenamiento
  sortinformation: any
  editrow: number = -1;
  rowindex: number = -1;
  idScoutPar: number;
  labelNombres: string;
  labelTipoScout: string;
  labelRama: string;
  labelGrupo: string;
  labelEstado: string;
  labelInsignia: string;
  labelImagen: string;
  current: number;
  codigoPerfil:string
  ocultarAdmin:boolean=false
  ocultarBen:boolean=false
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.idScoutPar = params['idScout'];
      // Evalua si el parametro id se paso.
      if (this.idScoutPar) {
        this.recuperarUltimaInsigniaScout()
        this.recuperarDetalleInsignias()
        this.listarInsignias()
        this.recuperarIdScout()
      }
      if(this.codigoPerfil=='BEN'){
        this.ocultarBen=true
      }else{
        this.ocultarAdmin=true
      }
    });

  }

  ngAfterViewInit(): void {
    // this.getStorageFormularioState();
  }

  doSomethingWithCurrentValue() {
    // alert('estoy pendejo')

  }
  recuperarIdScout() {
    if (localStorage.getItem('datosScout')) {
      let datosUsuario = JSON.parse(localStorage.getItem('datosScout'));
      this.codigoPerfil= datosUsuario[0].codigo
    }
  }

  gotoList() {
    this.router.navigate(['scout/progresion-listado']);
  }

  revisarModulo(){
    this.router.navigate(['scout/subir-archivo', this.idScoutPar]);
  }

  subirModulo(){
    this.router.navigate(['scout/subir-archivo', this.idScoutPar]);
  }

  recuperarUltimaInsigniaScout() {
    this.ScoutService.getRecuperarUltimaInsigniaScout(this.idScoutPar).subscribe(data => {
      if (data.length > 0) {
        this.labelNombres = data[0].nombres
        this.labelGrupo = data[0].grupo
        this.labelInsignia = data[0].insignia
        this.labelRama = data[0].rama
        this.labelImagen = data[0].imagen
        this.labelTipoScout = data[0].tipoScout
        this.current = Math.round((data[0].contCumplidos * 100) / data[0].contTotales)
      }
    })
  }

  sourceInsignias: any =
    {
      datatype: 'array',
      id: 'idInsignia',
      datafields:
        [
          { name: 'idScout', type: 'string' },
          { name: 'idInsignia', type: 'string' },
          { name: 'insignia', type: 'string' },
          { name: 'descripcion', type: 'string' },
          { name: 'imagen', type: 'string' },
          { name: 'contCumplidos', type: 'string' },
          { name: 'contTotales', type: 'string' },
        ],
      hierarchy:
      {
        keyDataField: { name: 'idInsignia ' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterInsignias: any = new jqx.dataAdapter(this.sourceInsignias);


  listarInsignias() {
    this.ScoutService.getRecuperarInsigniasObtenidas(this.idScoutPar).subscribe(data => {
      this.sourceInsignias.localdata = data;
      let registrosProc = new Array();
      let dataAdapter = this.sourceInsignias.localdata;
      for (let i = 0; i < dataAdapter.length; i++) {
        let record = dataAdapter[i];
        if (record.contTotales ==  record.contCumplidos ) {
          registrosProc[registrosProc.length] = record;
        }
      }
      this.sourceInsignias.localdata=registrosProc
      this.dataAdapterInsignias.dataBind();
    });
  }

  //metodo de reinderizado de filas del grid
  rendergridrows = (params: any): any[] => {
    return params.data;
  }

  imagerenderer = (row: number, datafield: string, value: string): string => {
    return '<div align="center"><img class="img-thumbnail img-responsive center-block" height="70" width="70" src="'
      + value + '"/></div>';
  }

  columnsInsignias: any[] =
    [
      { text: 'id Scout', datafield: 'idScout', width: '5%', hidden: false },
      { text: 'id Insignias', datafield: 'idInsignia', width: '5%' },
      { text: 'Insignia', datafield: 'insignia', width: '25%', hidden: false },
      { text: 'Descripción', datafield: 'descripcion', width: '50%', hidden: false },
      {
        text: 'Imagen', datafield: 'imagen', width: '15%',
        cellsrenderer: this.imagerenderer, cellsalign: 'center', align: 'center',
      },
      { text: 'actAprobadas', datafield: 'actAprobadas', width: '5%', hidden: true },
    ];

  localization: any = getLocalization('es');
  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }
    return 850;
  }

  nestedGrids: any[] = new Array();


  //FUENTE DE DATOS PARA DETALLE DE INSIGNIAS
  sourceDetalleInsignias: any =
    {
      localData:
        [],
      id: 'idInsignia',
      dataType: 'array',
      dataFields:
        [
          { name: 'idScout', type: 'string' },
          { name: 'idInsignia', type: 'string' },
          { name: 'idModulo', type: 'string' },
          { name: 'idScoutModulos', type: 'string' },
          { name: 'modulo', type: 'string' },
          { name: 'descripcion', type: 'string' },
          { name: 'observacion', type: 'string' },

        ]
    };
  //CARGAR ORIGEN DEL COMBOBOX DE TIPO DE MATRICULA
  dataAdapterDetalleInsignias: any = new jqx.dataAdapter(this.sourceDetalleInsignias);

  recuperarDetalleInsignias() {
    this.ScoutService.getRecuperarDetalleInsignias(this.idScoutPar).subscribe(data => {
      this.sourceDetalleInsignias.localdata = data;
      this.dataAdapterDetalleInsignias.dataBind();
    })
  }


  rowdetailstemplate: any = {
    rowdetails: '<div  id="nestedGrid" style="margin: 10px;"></div>', rowdetailshidden: true, autorowheight: true, filterable: true
  };
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
    let orders = this.dataAdapterDetalleInsignias.records;
    //console.log(orders)
    let ordersbyid = [];

    for (let i = 0; i < orders.length; i++) {
      let result = filter.evaluate(orders[i]['idInsignia']);
      if (result) {
        ordersbyid.push(orders[i]);
      }
    }

    let sourceCarrera = {
      datafields: [
        { name: 'idScout', type: 'string' },
        { name: 'idInsignia', type: 'string' },
        { name: 'idModulo', type: 'string' },
        { name: 'idScoutModulos', type: 'string' },
        { name: 'modulo', type: 'string' },
        { name: 'descripcion', type: 'string' },
        { name: 'observacion', type: 'string' },
      ],
      id: 'idScoutModulos',
      localdata: ordersbyid
    }
    let nestedGridAdapter = new jqx.dataAdapter(sourceCarrera);
    if (nestedGridContainer != null) {
      let settings = {
        width: '100%',
        // height: "130",
        theme: "material",
        autoheight: true,
        source: nestedGridAdapter,
        columns: [
          { text: 'id Scout', datafield: 'idScout', width: '20%', hidden: true },
          { text: 'idInsignia', datafield: 'idInsignia', width: '10%', hidden: false },
          { text: 'id Modulo', datafield: 'idModulo', width: '20%', hidden: true },
          { text: 'idScoutModulos', datafield: 'idScoutModulos', width: '30%', hidden: true },
          { text: 'modulo', datafield: 'modulo', width: '35%' },
          { text: 'descripcion', datafield: 'descripcion', width: '25%', hidden: false },
          { text: 'observacion', datafield: 'observacion', width: '30%', hidden: false },

        ]
      };
      jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
      this.ready();
    }
  }
  ready = (): void => {
  };


}
