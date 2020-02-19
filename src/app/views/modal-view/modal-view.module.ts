import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WidgetsModuleModule } from '../widgets-module.module'
//import { DistributivosService } from '../../services/distributivos/distributivos.service';
//import { jqxMenuModule } from 'jqwidgets-scripts/jqwidgets-ng/jqxmenu';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    WidgetsModuleModule,

  ],
  exports:[],
  
})
export class ModalViewModule { }
