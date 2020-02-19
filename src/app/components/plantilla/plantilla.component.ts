import { Component,ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { PersonasComponent } from './components/personas/personas.component';
@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.css']
})
export class PlantillaComponent implements OnInit {
   //datos del eventlog
   @ViewChild('eventLog') eventLog: ElementRef;


  //datos jqxgrid
  source: any =
    {
      datatype: 'xml',
      datafields: [
        { name: 'ProductName', type: 'string' },
        { name: 'QuantityPerUnit', type: 'int' },
        { name: 'UnitPrice', type: 'float' },
        { name: 'UnitsInStock', type: 'float' },
        { name: 'Discontinued', type: 'bool' }
      ],
      root: 'Products',
      record: 'Product',
      id: 'ProductID',
      url: '../assets/products.xml'
    };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  cellsrenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
    if (value < 20) {
      return `<span style='margin: 4px; float:${columnproperties.cellsalign}; color: #ff0000;'>${value}</span>`;
    }
    else {
      return `<span style='margin: 4px; float:${columnproperties.cellsalign}; color: #008000;'>${value}</span>`;
    }
  };

  columns: any[] =
    [
      { text: 'Product Name', columngroup: 'ProductDetails', datafield: 'ProductName', width: 250 },
      { text: 'Quantity per Unit', columngroup: 'ProductDetails', datafield: 'QuantityPerUnit', cellsalign: 'right', align: 'right' },
      { text: 'Unit Price', columngroup: 'ProductDetails', datafield: 'UnitPrice', align: 'right', cellsalign: 'right', cellsformat: 'c2' },
      { text: 'Units In Stock', datafield: 'UnitsInStock', cellsalign: 'right', cellsrenderer: this.cellsrenderer, width: 100 },
      { text: 'Discontinued', columntype: 'checkbox', datafield: 'Discontinued', align: 'center' }
    ];

  columngroups: any[] =
    [
      { text: 'Product Details', align: 'center', name: 'ProductDetails' }
    ];

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
        'text': 'Borrar',
        'id': '3',
        'parentid': '-1',
        'subMenuWidth': '250px'
      },

      {
        'text': 'Reconsultar',
        'id': '4',
        'parentid': '-1',
        'subMenuWidth': '250px'
      }  
    ];
  // prepare the data
  source1 =
  {
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
  getAdapter(source: any): any {
      // create data adapter and perform data
      return new jqx.dataAdapter(this.source1, { autoBind: true });
  };
  records = this.getAdapter(this.source1).getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);
  itemclick(event: any): void {
      this.eventLog.nativeElement.innerHTML = 'Id: ' + event.args.id + ', Text: ' + event.args.innerText;
  };


  constructor(private router: Router) { }

  ngOnInit() {
  }

}
