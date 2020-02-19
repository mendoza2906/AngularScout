import { Component, Input, ViewChild, ElementRef, ViewEncapsulation, Output, EventEmitter } from "@angular/core";
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { AutenticacionService } from '../../services/autenticacion/autenticacion.service';
import { InicioComponent } from '../inicio/inicio.component'
import { PlantillaComponent } from '../plantilla/plantilla.component'

import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu'
import { TabsComponent } from '../tabs/tabs.component'
import { Router } from '@angular/router';
@Component({
    selector: 'app-layout',
    templateUrl: './app-layout.component.html',
    styleUrls: ['./app-layout.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppLayoutComponent{
    @Input() menus;
    @Input() title = null;
    @Output() itemClick = new EventEmitter();
    @ViewChild('jqxMenu') myMenu: jqxMenuComponent;
    @ViewChild('tabsComponent') tabsComponent:TabsComponent;
    usuarioActual:any=JSON.parse(localStorage.getItem('usuarioActual'));
 
    width = 200;
    collapsed = false;

    constructor(public messagerService: MessagerService,
      private autenticationService: AutenticacionService,
      private router: Router) { }

    ngAfterViewInit(): void {
        //alinea menu del perfil del usuario a la derecha 
        this.myMenu.setItemOpenDirection(1, 'left', 'down');
    }  
    
    
    toggle(){
        this.collapsed = !this.collapsed;
        this.width = this.collapsed ? 50 : 200;
    }
 
    onItemClick(item){
        this.itemClick.emit(item);
        //this.addDataGrid(item.text);
        
       
    }
    
 /*
 //Tabs
    home=[
      {title:'Inicio',component:InicioComponent}
    ];

  selectedIndex = 0;
  tabs = [];
    
 
  onTabClose(panel){
    this.tabs = this.tabs.filter(p => p.title != panel.title);
  }
 
  getTabIndex(title){
    for(let i=0; i<this.tabs.length; i++){
      if (this.tabs[i].title == title){
          return i;
      }
    }
    return -1;
  }
 
  addTab(tab){
    let index = this.getTabIndex(tab.title);
    if (index == -1){
      this.tabs.push(tab);
      setTimeout(() => this.selectedIndex = this.tabs.length);
    } else {
      this.selectedIndex = index+1;
    }
  }
 
  addDataGrid(title) {
    let tab = {title:title,component:PersonasComponent};
    this.addTab(tab);
  }
  
 
  addNewTab() {
    let tab = {title:'NewTab',component:InicioComponent};
    this.addTab(tab);
  }
*/
 

 
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