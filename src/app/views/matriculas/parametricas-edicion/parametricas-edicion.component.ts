import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatriculasService } from '../../../services/matriculas/matriculas.service';
import { ModalComponentComponent } from '../../modal-view/modal-component/modal-component.component';
import { jqxValidatorComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxvalidator';
import { jqxNumberInputComponent } from 'jqwidgets-scripts/jqwidgets-ng/jqxnumberinput'
import { jqxDropDownListComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';
import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import { ValidadorService } from '../../../services/validacion/validador.service';

@Component({
  selector: 'app-parametricas-edicion',
  templateUrl: './parametricas-edicion.component.html',
  styleUrls: ['./parametricas-edicion.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ParametricasEdicionComponent implements OnInit {

  @ViewChild(ModalComponentComponent) myModal: ModalComponentComponent;
  @ViewChild('myValidator') myValidator: jqxValidatorComponent;
  @ViewChild('txtCodigo') txtCodigo : jqxInputComponent;
  @ViewChild('txtDescripcion') txtDescripcion: jqxInputComponent;
  @ViewChild('txtDescripcionCorta') txtDescripcionCorta: jqxInputComponent;
  @ViewChild('txtValor') txtValor: jqxNumberInputComponent;
  @ViewChild('comboTipoMovilidad') comboTipoMovilidad: jqxDropDownListComponent;

  constructor(public messagerService: MessagerService,
    private router: Router, private route: ActivatedRoute,
    private matriculasService: MatriculasService,
    private validadorService: ValidadorService,
  ) { }

  sub: Subscription;
  parametricaAng: any = {};
  idParametricaPar: number;
  codigoTablaPar: string;
  labelOpcion: string;
  labelNombreTabla: string;
  ocultarCombo: boolean= true
  ocultarValor: boolean= true
  ocultarDescripcionCorta: boolean= true


  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.idParametricaPar = params['idParametrica'];
      this.codigoTablaPar = params['codigoTabla'];
      this.ocultarJq(this.codigoTablaPar)
      this.listadoTiposMovilidad()
      this.mostrarLabelParametrica()
      if (this.idParametricaPar) {
        if (this.idParametricaPar != 0) {
          this.labelOpcion = 'Edición '
          this.recuperarDatosParametricas(this.idParametricaPar)
        } else {
          this.labelOpcion = 'Registro '
          this.nuevoRegistro()
        }
      }
    });
  }

  data = [
    {
      'id': '1',
      'text': 'Grabar',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },
    {
      'text': 'Cancelar',
      'id': '2',
      'parentid': '-1',
      'subMenuWidth': '250px'
    },

  ];

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

  getAdapter(source1: any): any {
    return new jqx.dataAdapter(this.source1, { autoBind: true });
  };
  menus = this.getAdapter(this.source1).getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);

  gotoList() {
    this.router.navigate(['/matriculas/parametricas-listado']);
  }

  itemclick(event: any): void {
    var opt = event.args.innerText;
    switch (opt) {
      case 'Grabar':
        this.myValidator.validate(document.getElementById('formParametrica'));
        if (this.validaDatos()) {
          this.myValidator.hide();
          this.myModal.alertQuestion({
            title: 'Registro de Paramétricas',
            msg: 'Desea grabar este registro?',
            result: (k) => {
              if (k) {
                this.grabarTablaParametrica(this.parametricaAng)
              }
            }
          })
        } else {
          this.myModal.alertMessage({
            title: 'Registro de Paramétricas',
            msg: 'Verifique que todos los campos esten llenados correctamente, con un mínimo de 3 caractéres!'
          });
        }
        break;
      case 'Cancelar':
        this.myValidator.hide();
        this.gotoList();
        break;
      default:
    }
  };
  ocultarJq(idParametrica: any) {
    if (idParametrica == 'TIPOFE') {
      this.ocultarDescripcionCorta=false;
    }else if (this.codigoTablaPar == 'SUBMOV') {
      this.ocultarCombo=false;
    } else if (this.codigoTablaPar == 'COSASI') {
      this.ocultarValor=false;
    }
  }

  nuevoRegistro() {
    //PARA ARAMAR EL JASON PERSONA 
    this.parametricaAng.id = null
    this.parametricaAng.estado = "A"
    this.parametricaAng.usuarioIngresoId = "1"
    this.parametricaAng.version = 0
    this.parametricaAng.valor = 0
  }

  sourceTablasParametricas = [{ "tabla": "Tipos de Estudiante", "codigo": 'TIPEST' },
  { "tabla": "Tipos de Ingreso Estudiantes", "codigo": 'TIPING' }, { "tabla": "Tipos de Reglamentos", "codigo": 'TIPREG' },
  { "tabla": "Tipos de Oferta", "codigo": 'TIPOFE' }, { "tabla": "Tipos de Matrícula", "codigo": 'TIPMAT' },
  { "tabla": "Tipos de Movilidad", "codigo": 'TIPMOV' }, { "tabla": "Subtipos de Movilidad", "codigo": 'SUBMOV' },
  { "tabla": "Costos de Asignatura", "codigo": 'COSASI' }];

  mostrarLabelParametrica(){
    for (let i = 0; i < this.sourceTablasParametricas.length; i++) {
      if(this.sourceTablasParametricas[i].codigo==this.codigoTablaPar)
        this.labelNombreTabla= this.sourceTablasParametricas[i].tabla
    }
  }

  recuperarDatosParametricas(idParametrica: number) {
    if (this.codigoTablaPar == 'TIPEST') {
      this.buscarTipodeEstudiante(idParametrica)
    } else if (this.codigoTablaPar== 'TIPING') {
      this.buscarTipodeIngresoEstudiante(idParametrica)
    } else if (this.codigoTablaPar == 'TIPREG') {
      this.buscarTipodeReglamento(idParametrica)
    } else if (this.codigoTablaPar == 'TIPOFE') {
      this.buscarTipodeOferta(idParametrica)
    } else if (this.codigoTablaPar == 'TIPMAT') {
      this.buscarTipodeMatricula(idParametrica)
    } else if (this.codigoTablaPar == 'TIPMOV') {
      this.buscarTipodeMovilidad(idParametrica)
    } else if (this.codigoTablaPar == 'SUBMOV') {
      this.buscarSubTipoMovilidad(idParametrica)
    } else if (this.codigoTablaPar == 'COSASI') {
      this.buscarCostosdeAsignatura(idParametrica)
    }
  }

  buscarTipodeMatricula(idParametrica: number) {
    this.matriculasService.getBuscarTipodeMatricula(idParametrica).subscribe(data => {
      if (data)
        this.parametricaAng= data
    })
  }

  buscarTipodeReglamento(idParametrica: number) {
    this.matriculasService.getBuscarTipodeReglamento(idParametrica).subscribe(data => {
      if (data)
      this.parametricaAng= data
    })
  }

  buscarTipodeEstudiante(idParametrica: number) {
    this.matriculasService.getBuscarTipodeEstudiante(idParametrica).subscribe(data => {
      if (data)
      this.parametricaAng= data
    })
  }

  buscarTipodeIngresoEstudiante(idParametrica: number) {
    this.matriculasService.getBuscarTipodeIngresoEstudiante(idParametrica).subscribe(data => {
      if (data)
      this.parametricaAng= data
    })
  }

  buscarTipodeMovilidad(idParametrica: number) {
    this.matriculasService.getBuscarTipodeMovilidad(idParametrica).subscribe(data => {
      if (data)
      this.parametricaAng= data
    })
  }

  buscarSubTipoMovilidad(idParametrica: number) {
    this.matriculasService.getBuscarSubTipoMovilidad(idParametrica).subscribe(data => {
      if (data)
        this.parametricaAng= data
        this.comboTipoMovilidad.val(data.idTipoMovilidad)
    })
  }

  buscarTipodeOferta(idParametrica: number) {
    this.matriculasService.getBuscarTipodeOferta(idParametrica).subscribe(data => {
      if (data)
        this.parametricaAng= data
    })
  }

  buscarCostosdeAsignatura(idParametrica: number) {
    this.matriculasService.getBuscarCostosdeAsignatura(idParametrica).subscribe(data => {
      if (data)
      this.parametricaAng= data
    })
  }

  //FUENTE DE DATOS PARA EL COMBOBOX DE TIPOS DE MOVILIDAD
  sourceTiposMovilidad: any =
  {
    datatype: 'json',
    id: 'id',
    localdata:
      [
        { name: 'id', type: 'string' },
        { name: 'descripcion', type: 'string' }
      ],
  };

  //CARGAR ORIGEN DEL COMBOBOX DE TIPOS DE INGRESO
  dataAdapterTipoMovilidad: any = new jqx.dataAdapter(this.sourceTiposMovilidad);

  listadoTiposMovilidad() {
    this.matriculasService.getListadoTiposMovilidad().subscribe(data => {
      this.sourceTiposMovilidad.localdata = data;
      this.dataAdapterTipoMovilidad.dataBind();
    })
  }

  grabarTablaParametrica(idParametrica: any) {
    if (this.codigoTablaPar == 'TIPEST') {
      this.matriculasService.grabarTipoEstudiante(idParametrica).subscribe(result => {
        this.gotoList();
      }, error => console.error(error));
    } else if (this.codigoTablaPar== 'TIPING') {
      this.matriculasService.grabarTipoIngresoEstudiante(idParametrica).subscribe(result => {
        this.gotoList();
      }, error => console.error(error));
    } else if (this.codigoTablaPar == 'TIPREG') {
      this.matriculasService.grabarTipoReglamento(idParametrica).subscribe(result => {
        this.gotoList();
      }, error => console.error(error));
    } else if (this.codigoTablaPar == 'TIPOFE') {
      this.matriculasService.grabarTipoOferta(idParametrica).subscribe(result => {
        this.gotoList();
      }, error => console.error(error));
    } else if (this.codigoTablaPar == 'TIPMAT') {
      this.matriculasService.grabarTipoMatricula(idParametrica).subscribe(result => {
        this.gotoList();
      }, error => console.error(error));
    } else if (this.codigoTablaPar == 'TIPMOV') {
      this.matriculasService.grabarTipoMovilidad(idParametrica).subscribe(result => {
        this.gotoList();
      }, error => console.error(error));
    } else if (this.codigoTablaPar == 'SUBMOV') {
      this.matriculasService.grabarSubtipoMovilidad(idParametrica).subscribe(result => {
        this.gotoList();
      }, error => console.error(error));
    } else if (this.codigoTablaPar == 'COSASI') {
      this.matriculasService.grabarCostoAsignatura(idParametrica).subscribe(result => {
        this.gotoList();
      }, error => console.error(error));
    }
  }
  
  //Reglas de validación formulario
  rules =
    [
      { input: '.codigoInput', message: 'Código requerido!', action: 'keyup, blur', rule: 'required' },
      { input: '.codigoInput', message: 'Código incorrecto', action: 'keyup', rule: 'length=3' },
      { input: '.descripcionInput', message: 'Descripción requerida!', action: 'keyup, blur', rule: 'required' },
      { input: '.descripcionInput', message: 'Descripción deben contener solo letras!', action: 'keyup', rule: 'notNumber' },
      { input: '.descripcionInput', message: 'Descripción deben tener entre 5 e 60 caracteres!', action: 'keyup', rule: 'length=5,60' },
      { input: '.descripcionCortaInput', message: 'Descripción Corta requerida!', action: 'keyup, blur', rule: 'required' },
      { input: '.descripcionCortaInput', message: 'Descripción debe contener solo letras!', action: 'keyup', rule: 'notNumber' },
      { input: '.descripcionCortaInput', message: 'Descripción debe tener 3 e 30 caracteres!', action: 'keyup', rule: 'length=2,30' },
    ];

    validaDatos(): boolean {
      let valido = true
      //valida Apellidos
      if (!this.txtDescripcion.val()||!this.txtCodigo.val()|| this.txtDescripcion.val().length<3||this.txtCodigo.val().length<3) {
        valido = false
        return valido
      }
      if(this.codigoTablaPar=='TIPOFE'){
        if (!this.txtDescripcionCorta.val() || this.txtDescripcionCorta.val().length<3) {
          valido = false
          return valido
        }
      }
      if(this.codigoTablaPar=='SUBMOV'){
        if (!this.comboTipoMovilidad.val()) {

          valido = false
          return valido
        }
      }
      // if(this.codigoTablaPar=='COSASI'){
      //   if (!this.txtValor.val()) {
      //     valido = false
      //     return valido
      //   }
      // }
      return valido
    }
  
}
 