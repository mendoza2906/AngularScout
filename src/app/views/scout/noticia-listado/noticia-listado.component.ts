import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { getLocalization } from 'jqwidgets-scripts/scripts/localization';
import { ValidadorService } from '../../../services/validacion/validador.service';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import { ScoutService } from '../../../services/scout/scout.service';

@Component({
  selector: 'app-noticia-listado',
  templateUrl: './noticia-listado.component.html',
  styleUrls: ['./noticia-listado.component.scss']
})
export class NoticiaListadoComponent implements OnInit {
  @ViewChild('gridNoticias') gridNoticias: jqxGridComponent;
  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('botonVolver') botonVolver: jqxButtonComponent;
  @ViewChild('myPdfViewer') myPdfViewer: NgxExtendedPdfViewerComponent;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private ScoutService: ScoutService,
    private validadorService: ValidadorService, ) { }


  pageinformation: any = {
    "page": "0",
    // "size":this.pagesize,
    "sortfield": "id",
    "direction": "DESC",
    "filterInformation": []
  };

  //Variable paa cargar datos del objeto 
  rowindex: number = -1;
  banderaDepencia: boolean = false


  ngOnInit() {
    this.listadoNoticias()
  }

  ngAfterViewInit(): void {
    this.getStorageFormularioState();
  }

  //datos de jqxMenu
  dataMenu = [
    {
      'id': '1',
      'text': 'Nuevo',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'id': '2',
      'text': 'Editar',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'id': '3',
      'text': 'Eliminar',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
  ];

  sourceMenu =
    {
      datatype: 'json',
      datafields: [
        { name: 'id' },
        { name: 'parentid' },
        { name: 'text' },
        { name: 'subMenuWidth' }
      ],
      id: 'id',
      localdata: this.dataMenu
    };
  getAdapter(sourceMenu: any): any {
    return new jqx.dataAdapter(this.sourceMenu, { autoBind: true });
  };
  menuMatricula = this.getAdapter(this.sourceMenu).getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);

  itemclick(event: any): void {
    // captura el id seleccionado
    const selectedrowindex = this.gridNoticias.getselectedrowindex();
    const idNoticiaSel = this.gridNoticias.getcellvalue(selectedrowindex, 'idNoticia');
    var opt = event.args.innerText;

    switch (opt) {
      case 'Nuevo':
        this.router.navigate(['scout/noticia-edicion', 0]);
        break;
      case 'Editar':
        if (idNoticiaSel) {
          this.setFormularioState();
          this.router.navigate(['scout/noticia-edicion', idNoticiaSel]);
        } else {
          this.myModal.alertMessage({ title: 'Listado de Noticias', msg: 'Seleccione una Noticia!' });
        }
        break;
      case 'Eliminar':
        if (idNoticiaSel) {

          this.myModal.alertQuestion({
            title: 'Listado de Noticias',
            msg: '¿Desea eliminar este registro?',
            result: (k) => {
              if (k) {
                // this.eliminarPaciente(idPersonaSel)
                this.myModal.alertMessage({ title: 'Listado de Noticias', msg: 'Noticia eliminado Correctamente!' });
                this.gridNoticias.clear()
                this.gridNoticias.clearselection()
                this.listadoNoticias()
                this.gridNoticias.refreshdata()
              }
            }
          })

        } else {
          this.myModal.alertMessage({ title: 'Listado de Noticias', msg: 'Seleccione un Paciente!' });
        }
        break;
      default:
    }
  };


  // eliminarPaciente(idPersona: number) {
  //   this.MatriculasService.borrarPaciente(idPersona).subscribe(result => {
  //   }, error => console.error(error));
  // }

  sourceNoticias: any =
    {
      datatype: 'array',
      id: 'idNoticia',
      datafields:
        [
          { name: 'idNoticia', type: 'int' },
          { name: 'titulo', type: 'string' },
          { name: 'contenido', type: 'string' },
          { name: 'urlImg', type: 'string' },
          { name: 'fechaPublic', type: 'date' },
          { name: 'fuente', type: 'string' },
        ],
      hierarchy:
      {
        keyDataField: { name: 'idNoticia' },
        parentDataField: { name: 'padre_id' }
      }
    };
  dataAdapterNoticias: any = new jqx.dataAdapter(this.sourceNoticias);

  //metodo de reinderizado de filas del grid
  rendergridrows = (params: any): any[] => {
    return params.data;
  }

  listadoNoticias() {
    this.ScoutService.getListadoNoticias().subscribe(data => {
      this.sourceNoticias.localdata = data;
      this.dataAdapterNoticias.dataBind();
      this.gridNoticias.gotopage(this.pageinformation.page)
    });
  }

  columnsNoticias: any[] =
    [
      { text: 'Id Noticia', datafield: 'idNoticia', width: '5%', filtertype: 'none', hidden: true },
      { text: 'Fecha Publicación', datafield: 'fechaPublic', width: '20%', hidden: false, columntype: 'datetimeinput', cellsformat: 'd' },
      { text: 'Titulo', datafield: 'titulo', width: '30%', hidden: false },
      { text: 'Contenido', datafield: 'contenido', width: '25%', hidden: false },
      // { text: 'Identificacion', datafield: 'identificacion', width: '15%', cellsalign: 'center', center: 'center' },
      { text: 'Fuente', datafield: 'fuente', width: '25%' },
    ];

  localization: any = getLocalization('es');

  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }
    return 850;
  }

  getEvents(event): void {
    if (event.val == "ok") {
      //this.save(this.distributivoDocente); 
    }
  }

  //graba el estado del grid y combox
  setFormularioState() {
    //Prepara estado de grabado del grid
    let gridState = JSON.stringify(this.gridNoticias.savestate())
    this.pageinformation.page = JSON.parse(gridState).pagenum;
    localStorage.setItem('pageinformation', JSON.stringify(this.pageinformation));
    localStorage.setItem('gridScoutState', gridState);
  }

  getStorageFormularioState() {
    if (localStorage.getItem('gridScoutState')) {
      let gridState = JSON.parse(localStorage.getItem('gridScoutState'));
      this.gridNoticias.loadstate(gridState);
      this.pageinformation.page = JSON.stringify(gridState.pagenum)
      //recupera y asigana puntero fila del grid seleccionad
      this.gridNoticias.gotopage(this.pageinformation.page)
      //borra la variable temporal de control de estados del grid
      localStorage.removeItem('gridScoutState');
    }
  }

}
