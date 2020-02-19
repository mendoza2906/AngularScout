import { Component,  ViewChild, TemplateRef, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import { BsModalRef, BsModalService,ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.css']
})
export class ModalComponentComponent implements OnInit,OnDestroy{

  //propiedades obsoletas
  @ViewChild('template') private template : ModalDirective;
  @ViewChild('templateNext') private templateNext: ModalDirective;
  @ViewChild('templateQuestion') private templateQuestion : ModalDirective;
  @ViewChild('templateCustomize') private templateCustomize : ModalDirective;
  @Output() protected PassMethods : EventEmitter<any> = new EventEmitter<any>();//variable para escuchar eventos del componente
  
  protected opcion:any={};
  //-------------------------------------------------------------------------------------
  /**Permite controlar que no salga del modal sin presionar algun boton de éste */
  protected config = {backdrop: true,ignoreBackdropClick: true};

  constructor(protected modalService: BsModalService){}

  /**
   * Internal implementation detail, do not use directly.
   */
  private subs: Subscription;

  ngOnInit(){}

  ngOnDestroy(){}

  /**
  *
  * Muestra una alerta en pantalla con una opcion: `Continuar`. 
  *  
  * Al presionar en `Continuar`: se ejecutará una acción deseada.
  * 
  * 
  * ### Ejemplo de uso
  *  
  * ```
  * alertNext({
 *   title: 'Titulo de encabezado',
 *   msg: 'leyenda a mostrar',
 *   result: (x) =>{
 *      if(x){
 *        //bloque de codigo a ejecutar en caso de presionar el botón continuar
 *      }
 *    }
 *  })
  * ```
  */
  alertNext(opt:any):void{
    if(opt.title == undefined || opt.title == ''){
      this.opcion.title = 'Mensaje Usuario'
     }else{
       this.opcion.title = opt.title;//Establece el titulo para el modal
     }
     
     if(opt.msg == undefined || opt.msg == ''){
      this.opcion.msg = 'Alerta formulario'
     }else{
      this.opcion.msg = opt.msg;//Establece el mensaje para el modal
     }
    this.templateNext.show();
    this.templateNext.config = this.config;
    this.subs = this.PassMethods.subscribe((t) =>{
      if(t.val == 'next'){
        opt.result('next')
      }
     });
  }

  /**
   * Evento del botón continuar
   */
  protected next(){
    this.PassMethods.emit({val:'next'});
    this.subs.unsubscribe();
    this.templateNext.hide();
  }

  /**
   * Nos muestra una alerta en pantalla con una única opción
   * de `Aceptar`, que no ejecuta ninguna acción.
   * 
   * ### Ejemplo de uso
   * 
   * ```
   * alert({title: 'Titulo de encabezado',msg: 'mensaje a mostrar'})
   * ```
   */
  alertMessage(opt:any): void
  {
    if(opt.title == undefined || opt.title == ''){
      this.opcion.title = 'Mensaje Usuario'
     }else{
       this.opcion.title = opt.title;//Establece el titulo para el modal
     }
     
     if(opt.msg == undefined || opt.msg == ''){
      this.opcion.msg = 'Alerta formulario'
     }else{
      this.opcion.msg = opt.msg;//Establece el mensaje para el modal
     }
    this.template.show();
    this.template.config = this.config;
  }

  /**
  *
  * Muestra una alerta en pantalla con dos opciones: `Aceptar` y `Cancelar`. 
  * 
  * Al presionar en `Cancelar`: no ejecutará ninguna acción.
  * 
  * Al presionar en `Aceptar`: se ejecutará una acción deseada.
  * 
  * 
  * ### Ejemplo de uso
  *  
  * ```
  * alertQuestion({
 *   title: 'Titulo de encabezado',
 *   msg: 'leyenda a mostrar',
 *   result: (x) =>{
 *      if(x){
 *        //bloque de codigo a ejecutar en caso de presionar el botón aceptar
 *      }
 *    }
 *  })
  * ```
  */
 alertQuestion(opt:any)
 {
   if(opt.title == undefined || opt.title == ''){
    this.opcion.title = 'Mensaje Usuario'
   }else{
     this.opcion.title = opt.title;//Establece el titulo para el modal
   }
   
   if(opt.msg == undefined || opt.msg == ''){
    this.opcion.msg = '¿Está seguro que desea realizar esta acción?'
   }else{
    this.opcion.msg = opt.msg;//Establece el mensaje para el modal
   }
   
   this.templateQuestion.show();//Muesta el modal
   this.templateQuestion.config = this.config;//Establece las configuraciones para el modal
   this.subs = this.PassMethods.subscribe((t) =>{
    if(t.val == 'ok'){
      opt.result('ok')
    }
   });
  } 

  /**
   * evento del botón aceptar del modal templateQuestion
   */
  protected Submit(){
    this.PassMethods.emit({val:'ok'});
    this.subs.unsubscribe();
    this.templateQuestion.hide();
  } 

  /**
   * evento del botón cancelar del modal templateQuestion
   */
  protected CancelQ(){
    this.subs.unsubscribe();
    this.templateQuestion.hide();
  }

  /**
  *
  * Muestra una alerta en pantalla con tres opciones: `Nueva Versión "Algo"`, `Nueva "Algo"` y `Cancelar`. 
  * 
  * Al presionar en `Cancelar`: no ejecutará ninguna acción.
  * 
  * Al presionar en `Nueva "Algo"`: se ejecutara una acción deseada.
  * 
  * Al presionar en `Nueva Versión "Algo"`: se ejecutara una acción deseada. 
  * ### Ejemplo de uso
  *  
  * ```
  * alertVersion({
 *   title: 'Titulo de encabezado',
 *   msg: 'leyenda a mostrar',
 *   textNuevo: 'nombre del boton nuevo', //Ejemplo: `Nueva Malla`
 *   textNuevaVersion: 'nombre del boton nueva version', //Ejemplo: `Nueva Versión de Malla`
 *    result:(a,b) =>{
 *    if (a && !b){
 *      //Establezca bloque de código a ejecutar en caso de presionar el botón 'Nueva'
 *    }else if(a && b){
 *      //Establezca bloque de código a ejecutar en caso de presionar el botón 'Nueva Versión'
 *    }
 *   }
 *  });
 *
  * ```
  * 
  * @description Alerta usable solo para crear nuevas y nuevas versiones de algo.
  */
 alertVersion(opt:any){
  if(opt.title == undefined || opt.title == ''){
    this.opcion.title = 'Mensaje Usuario'
   }else{
     this.opcion.title = opt.title;//Establece el titulo para el modal
   }
   
   if(opt.msg == undefined || opt.msg == ''){
    this.opcion.msg = '¿Está seguro que desea realizar esta acción?'
   }else{
    this.opcion.msg = opt.msg;//Establece el mensaje para el modal
   }

   if(opt.textNuevaVersion == undefined || opt.textNuevaVersion == ''){
    this.opcion.textNuevaVersion = 'Nueva Versión';
   }else{
    this.opcion.textNuevaVersion = opt.textNuevaVersion;
   }
   
   if(opt.textNuevo == undefined || opt.textNuevo == ''){
    this.opcion.textNuevo = 'Nueva';
   }else{
    this.opcion.textNuevo = opt.textNuevo;
   }

   this.templateCustomize.show();//Muesta el modal
   this.templateCustomize.config = this.config;//Establece las configuraciones para el modal
   this.subs = this.PassMethods.subscribe((h) =>{
    if(h.val == 'nueva'){
      opt.result('n');
    }else if(h.val == 'nVersion'){
      opt.result('n','v');
    }
   });   
 }

 /**
  * Evento del botón nueva versión del modal templateCustomize
  */
 protected nuevaVersion(){
  this.PassMethods.emit({val:'nVersion'});
  this.subs.unsubscribe();
  this.templateCustomize.hide();
 }

 /**
  * Evento del botón nuevo del modal templateCustomize
  */
 protected nueva(){
  this.PassMethods.emit({val:'nueva'});
  this.subs.unsubscribe();
  this.templateCustomize.hide();
 }

 /**
  * Evento del botón cancelar del modal templateCustomize
  */
 protected cancelVersion(){
  this.subs.unsubscribe();
  this.templateCustomize.hide();
 } 
}