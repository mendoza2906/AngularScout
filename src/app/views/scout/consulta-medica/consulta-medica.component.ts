import { Component, ViewChild, ViewEncapsulation, ElementRef, OnDestroy, OnInit, AfterViewInit, ɵConsole } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { jqxDateTimeInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { ScoutService } from '../../../services/scout/scout.service';

@Component({
  selector: 'app-consulta-medica',
  templateUrl: './consulta-medica.component.html',
  styleUrls: ['./consulta-medica.component.css'],
})
export class ConsultaMedicaComponent implements OnInit {

  @ViewChild('dateDesde') dateDesde: jqxDateTimeInputComponent;
  @ViewChild('dateHasta') dateHasta: jqxDateTimeInputComponent;
  @ViewChild('gridListadoCitas') gridListadoCitas: jqxGridComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;

  sub: Subscription;

  pagesize: number = 15;

  pageinformation: any = {
    "page": "0",
    "size": this.pagesize,
    "sortfield": "id",
    "direction": "DESC",
    "filterInformation": []
  };

  fechaDesdeDt: Date;
  fechaHastaDt: Date;
  varFechaDesde: any = new Date();
  varFechaHasta: any = new Date();

  varDesde: string;
  varHasta: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public messagerService: MessagerService,
    private consultorioService: ScoutService,
    private validadorService: ValidadorService, ) { }

  ngOnInit() {


    // this.recuperaDescOferta()


  }
  ngAfterViewInit(): void {

  }


  //datos de jqxMenu
  data = [
    {
      'id': '1',
      'text': 'Nuevo',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'text': 'Editar',
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
    {
      'text': 'Registrar Consulta',
      'id': '4',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'text': 'Editar Consulta',
      'id': '5',
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
    const selectedrowindex = this.gridListadoCitas.getselectedrowindex();
    const idCita = this.gridListadoCitas.getcellvalue(selectedrowindex, 'idCita')
    const idConsulta = this.gridListadoCitas.getcellvalue(selectedrowindex, 'idConsulta')
    var opt = event.args.innerText;
    switch (opt) {
      case 'Nuevo':
        this.router.navigate(['consultorio/agendar-cita']);
        break;
      case 'Editar':
        this.router.navigate(['consultorio/agendar-cita']);
        break;
      case 'Eliminar':
        //  this.gotoList();
        //    this.eliminar();
        break;
      case 'Registrar Consulta':
        if (idCita)
          this.router.navigate(['consultorio/registrar-consulta/', idCita, 0]);
        else
          this.myModal.alertMessage({
            title: 'Administración de Cita',
            msg: 'Debe seleccionar una cita para registrar una consulta!'
          })
        break;
      case 'Editar Consulta':
        if (idCita && idConsulta)
          this.router.navigate(['consultorio/registrar-consulta/', idCita, idConsulta]);
        else if (!idCita)
          this.myModal.alertMessage({
            title: 'Administración de Citas',
            msg: 'Debe seleccionar una cita para registrar una consulta!'
          })
        else if (!idConsulta)
          this.myModal.alertMessage({
            title: 'Administración de Citas',
            msg: 'En esta cita aún no se ha registrado una consulta, registrela!'
          })
        break;
        break;
      default:

    }
  };

  valueChangedFechas() {
    //desde
    let fechaDesde: Date
    fechaDesde = this.dateDesde.value()
    this.varFechaDesde = fechaDesde
    //hasta
    let fechaHasta: Date
    fechaHasta = this.dateHasta.value()
    this.varFechaHasta = fechaHasta
    if (fechaDesde) {


      let dayd = fechaDesde.getDate()
      let monthd = fechaDesde.getMonth() + 1
      let yeard = fechaDesde.getFullYear()

      if (monthd < 10)
        this.varDesde = `${yeard}-0${monthd}-${dayd}`
      else
        this.varDesde = `${yeard}-${monthd}-${dayd}`
    }
    if (fechaHasta) {

      let dayh = fechaHasta.getDate()
      let monthh = fechaHasta.getMonth() + 1
      let yearh = fechaHasta.getFullYear()
      if (monthh < 10)
        this.varHasta = `${yearh}-0${monthh}-${dayh}`
      else
        this.varHasta = `${yearh}-${monthh}-${dayh}`
    }
  }


  imprimirListadoCitas() {
    alert('Vamo imprimiendo!!!!')
  }

  sourceListadoCitas: any =
    {
      datatype: 'array',
      id: 'idCita',
      datafields:
        [
          { name: 'idPersona', type: 'string' },
          { name: 'idCita', type: 'string' },
          { name: 'idPaciente', type: 'string' },
          { name: 'idMedico', type: 'string' },
          { name: 'idHora', type: 'string' },
          { name: 'horaCita', type: 'string' },
          { name: 'nombres', type: 'string' },
          { name: 'nombresMedico', type: 'string' },
          { name: 'historialMedico', type: 'string' },
          { name: 'observacion', type: 'string' },
          { name: 'motivoConsulta', type: 'string' },
          { name: 'fechaCita', type: 'string' },
          { name: 'estadoCita', type: 'string' },
          { name: 'idConsulta', type: 'string' },
          { name: 'diagnostico', type: 'string' },
          { name: 'obsCon', type: 'string' }
        ],
      hierarchy:
      {
        keyDataField: { name: 'idCita' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterListadoCitas: any = new jqx.dataAdapter(this.sourceListadoCitas);

  //Busca todas las oferta_distrbiutivo
  listarCitasXFechas() {
    this.valueChangedFechas()
    this.consultorioService.getListarCitasFechas(this.varDesde, this.varHasta).subscribe(data => {
      this.sourceListadoCitas.localdata = data;
      this.dataAdapterListadoCitas.dataBind();
      this.gridListadoCitas.gotopage(this.pageinformation.page)
    });
  }


  columnsCitas: any[] =
    [
      { text: 'id Cita', datafield: 'idCita', width: '5%' },
      { text: 'id Consulta', datafield: 'idConsulta', width: '5%' },
      { text: 'id Persona', datafield: 'idPersona', width: '5%', hidden: true },
      { text: 'id Paciente', datafield: 'idPaciente', width: '5%', hidden: true },
      { text: 'id Hora', datafield: 'idHora', width: '5%', hidden: false },
      { text: 'Hora', datafield: 'horaCita', width: '10%', hidden: false },
      { text: 'Médico', datafield: 'nombresMedico', width: '15%', hidden: false },
      { text: 'Número de Historia ', datafield: 'historialMedico', width: '10%', cellsalign: 'center', align: 'center' },
      { text: 'Paciente', datafield: 'nombres', width: '15%', cellsalign: 'left', align: 'left' },
      { text: 'Motivo ', datafield: 'motivoConsulta', width: '10%' },
      { text: 'Diagnostico ', datafield: 'diagnostico', width: '10%' },
      { text: 'Observacion', datafield: 'observacion', width: '10%', hidden: true },
      { text: 'Estado', datafield: 'estadoCita', width: '15%' },
    ];
}






