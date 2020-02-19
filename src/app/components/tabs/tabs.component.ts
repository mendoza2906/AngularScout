import { Component, OnInit } from '@angular/core';
import { InicioComponent } from '../inicio/inicio.component'
import { PlantillaComponent } from '../plantilla/plantilla.component'

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  //tabs
  selectedIndex = 0;
  tabs = [];
  home=[
      {title:'Inicio',component:InicioComponent}
  ];
  
 
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
 
  addDataGrid(tt) {
    let tab = {title:'DataGrid',component:PlantillaComponent};
    this.addTab(tab);
  }

  
 
  addNewTab() {
    let tab = {title:'NewTab',component:InicioComponent};
    this.addTab(tab);
  }

  

  constructor() { }

  ngOnInit() {
   
  }

}
