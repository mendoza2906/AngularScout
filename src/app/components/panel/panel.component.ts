import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
  
})
export class PanelComponent implements OnInit {
  menus = [{
    text: 'Forms',
    iconCls: 'fa fa-wpforms',
    state: 'open',
    children: [{
        text: 'Form Element',
        url: '/personas',
    },{
        text: 'Wizard'
    },{
        text: 'File Upload'
    }]
},{
    text: 'Mail',
    iconCls: 'fa fa-at',
    selected: true,
    children: [{
        text: 'Inbox'
    },{
        text: 'Sent'
    },{
        text: 'Trash',
        children: [{
            text: 'Item1'
        },{
            text: 'Item2'
        }]
    }]
},{
    text: 'Layout',
    iconCls: 'fa fa-table',
    children: [{
        text: 'Panel'
    },{
        text: 'Accordion'
    },{
        text: 'Tabs'
    }]
}];

selectedMenu = null;

onItemClick(item){
    this.selectedMenu = item;
    // this.addNewTab();
}
  constructor() { }

  ngOnInit() {
    
  }

}
