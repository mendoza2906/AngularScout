import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ScoutService } from '../../services/scout/scout.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {

  constructor(private scoutService: ScoutService,
    @Inject(DOCUMENT) _document?: any) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  public navItems;
  // public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  ////////////
  public messagerService: MessagerService;
  private router: Router;
  private route: ActivatedRoute;
  idScoutLogeado:number
  ocultarElementos:boolean=false

  ngOnInit(): void {
    this.listarPerfiles()
    // this.navItems = this.itemsPac
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  listarPerfiles() {
    this.scoutService.getListarPerfiles().subscribe(data => {
      let idPerfilLogeado: any
      if (localStorage.getItem('datosUsuario')) {
        let datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'));
        alert(JSON.stringify(data))
        idPerfilLogeado = datosUsuario.idPerfil
        this.idScoutLogeado=datosUsuario.idScout
        // alert(this.idScoutLogeado)
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].idPer == idPerfilLogeado) {
              if (data[i].codigo == 'COM' || data[i].codigo == 'CMU'|| data[i].codigo == 'DRG')
                this.navItems = this.itemsAdmin
              else if (data[i].codigo == 'BEN'){
                this.navItems = this.itemsBeneficiario
                this.itemsBeneficiario[2].children[0].url= '/scout/revisar-progresion/'+this.idScoutLogeado
              }else if (data[i].codigo == 'EXT'){
                this.ocultarElementos=true}
            }
          }
        }
      }
    })
  }

  itemsAdmin = [
    {
      name: 'Distrito Santa Elena',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'Menú'
      }
    },
    {
      title: true,
      name: 'Seguridad'
    },
    {
      name: 'Seguridad',
      url: '/seguridad/usuarios/',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Comisionados',
          url: '/scout/comisionado-listado/',
          icon: 'icon-grid'
        },
        {
          name: 'Scouts',
          url: '/scout/scout-listado/',
          icon: 'icon-grid'
        }
      ]
    },
    {
      title: true,
      name: 'Revisión de Avance de Insignias'
    },
    {
      name: 'Progresión',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Módulos Habilitados',
          url: '/scout/subir-archivo/',
          icon: 'icon-grid'
        },
        {
          name: 'Listado de Progresión Scout',
          url: '/scout/progresion-listado/',
          icon: 'icon-grid'
        },
      ]
    },
    {
      title: true,
      name: 'Control de Asistencia'
    },
    {
      name: 'Control de Asistencia',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Listado de Actividades',
          url: '/scout/asistencia-listado/',
          icon: 'icon-grid'
        },
      ]
    },
    {
      name: 'Reportes',
      url: '/reportes/distributivo/',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Distributivo',
          url: '/reportes/distributivo/',
          icon: 'icon-grid'
        },
      ]
    },
    {
      name: 'Scouts Distrito Santa Elena',
      url: 'https://www.scoutsecuador.org/site/grupos-scouts',
      icon: 'icon-layers',
      class: 'mt-auto',
      variant: 'success',
      attributes: { target: '_blank', rel: 'noopener' }
    }
  ];
  

  itemsBeneficiario = [
    {
      name: 'Distrito Santa Elena',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'Menú'
      }
    },
    {
      title: true,
      name: 'Revisión de Avance de Insignias'
    },
    {
      name: 'Progresión',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Revisar mi progresión',
          url: '/scout/revisar-progresion/'+this.idScoutLogeado,
          icon: 'icon-grid'
        },
      ]
    },
    {
      name: 'Scouts Distrito Santa Elena',
      url: 'https://www.scoutsecuador.org/site/grupos-scouts',
      icon: 'icon-layers',
      class: 'mt-auto',
      variant: 'success',
      attributes: { target: '_blank', rel: 'noopener' }
    }
  ];
}
