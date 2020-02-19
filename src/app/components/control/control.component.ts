import { Component,ViewChild,Input,ElementRef,ViewEncapsulation,OnInit } from '@angular/core';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { AutenticacionService } from '../../services/autenticacion/autenticacion.service';
import { ModulosService } from '../../services/aplicaciones/modulos.service';
import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu'
import { Router } from '@angular/router';


@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ControlComponent implements OnInit {
   //datos del eventlog
  @ViewChild('content') content: ElementRef;
  @ViewChild('jqxMenu') myMenu: jqxMenuComponent;

 
  loadedCharacter: {};
  //variables de entrada
  @Input() title = 'SIIA:Aplicaciones';
  @Input() description='Bienvenido al panel de control de Aplicaciones UPSE.';
  usuarioActual:any=JSON.parse(localStorage.getItem('usuarioActual'));
  apps: Array<any>;

  constructor(public messagerService: MessagerService,
    private autenticationService: AutenticacionService,
    private modulosService:ModulosService,
    private router: Router) { }
  
  ngAfterViewInit(): void {
      
      //alinea menu del perfil del usuario a la derecha 
       this.myMenu.setItemOpenDirection(1, 'left', 'down');
  }

  ngOnInit() {
    this.setModulos();

  }
  onClicked() {
   alert('s');
  }

  setModulos(){
    //this.usuario=JSON.parse(localStorage.getItem('usuarioActual'));
    this.modulosService.getModulesByUser(this.usuarioActual.usuario).subscribe(result => {
        //recupera datos del servicio y arma el panel de opciones
        this.apps = result;
        let containerApps: string ='';
        for (let i = 0; i < this.apps.length; i++) {
               let record = this.apps[i];

                              var container = '<div class="button" style="margin: 1px; position: relative; float:left>';
                              var item = '<div style="float: left; width: 0px; overflow: hidden; white-space: nowrap; height: 0px;">';
                              var image = '<div class="containerimg" style="margin: 0px; margin-bottom: 0px;">';
                              var imgo='assets/img/'+record.img_out;
                              var imgi='assets/img/'+record.img_in;
                              var img = '<img class="image" src="' + imgo + '"/>';
                              image += img;
                              image += '</div>';
                              var info = '<div style="margin: 0px; margin-left: 0px; margin-bottom: 0px;">';
                              //info += "<div class='mdescripcion'>" + record.descripcion + "</div>";
                              info += '<div class="mid" hidden="true">' + record.id + '</div>';
                              info += '</div>';
                              item += image;
                              item += info;
                              item += '</div>';
                              container += item;
                              container += '</div>';
                              containerApps +=container;
        }
        this.content.nativeElement.innerHTML = containerApps;
        let buttons = document.getElementsByClassName('button');
        let modulos=document.getElementsByClassName('mid');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', () => {
               alert(modulos[i].textContent);
            });
        }
        //habilita salida json de depuracion     
        this.loadedCharacter = result;
        


     }, error => console.error(error));
  }

  itemsInApp: number = 0;
 
   
  
  
  sourceApp: any =
  {
      datatype: 'json',
      id: 'id',
      datafields:
      [  
          { name: 'id',  type: 'string' },
          { name: 'nombre', type: 'string' },
          { name: 'descripcion', type: 'string' },
          { name: 'img_out', type: 'string' },
          { name: 'img_in', type: 'string' }
      ],
  };
  dataAdapterApp: any = new jqx.dataAdapter(this.sourceApp);
  
getWidth() : any {
  if (document.body.offsetWidth < 850) {
    return '100%';
  }
  
  return 850;
}
  
  //datos de jqxMenu
  dataOpcionesPerfil = [
    {
        'id': '1',
        'text': this.usuarioActual.usuario,
        'parentid': '-1',
        'subMenuWidth': '250px'
    },
    {
        'text': 'Mi perfil',
        'id': '2',
        'parentid': '1',
        'subMenuWidth': '250px'
    }, 
    {
        'text': 'Mi cuenta',
        'id': '3',
        'parentid': '1',
        'subMenuWidth': '250px'
    }, 

    {
      'text': 'Cerrar sesión',
      'id': '4',
      'parentid': '1',
      'subMenuWidth': '250px'
    },
   
  ];
// prepare the data
sourcePerfil =
{
    datatype: 'json',
    datafields: [
        { name: 'id' },
        { name: 'parentid' },
        { name: 'text' },
        { name: 'subMenuWidth' }
    ],
    id: 'id',
    localdata: this.dataOpcionesPerfil
};
getAdapter(source: any): any {
    // create data adapter and perform data
    return new jqx.dataAdapter(this.sourcePerfil, { autoBind: true });
};
records = this.getAdapter(this.sourcePerfil).getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);
itemclick(event: any): void {
    //this.eventLog.nativeElement.innerHTML = 'Id: ' + event.args.id + ', Text: ' + event.args.innerText;
    var opt=event.args.innerText;
    switch (opt) {
          
        case 'Cerrar sesión':
           this.logout();
           break;
        default:
            //default code block
    } 
};

logout() {
    this.autenticationService.logout();
    this.router.navigate(['/login']);
}

 

}
