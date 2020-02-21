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

  // public navItems;
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  ////////////
  public messagerService: MessagerService;
  private router: Router;
  private route: ActivatedRoute;


  ///////


  ngOnInit(): void {
    this.listarPerfiles()
    // this.navItems = this.itemsPac
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  // getStorageFormularioState() {
  //   if (localStorage.getItem('datosUsuario')) {
  //     let datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'));
  //     this.gridMedicos.loadstate(gridState);
  //     this.pageinformation.page = JSON.stringify(gridState.pagenum)
  //   }
  // }

  listarPerfiles() {
    this.scoutService.getListarPerfiles().subscribe(data => {
      let idPerfilLogeado: any
      if (localStorage.getItem('datosUsuario')) {
        let datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'));
        idPerfilLogeado = datosUsuario.idPerfil
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].idPer == idPerfilLogeado) {
              if (data[i].codigo == 'ADM' || data[i].codigo == 'MED')
                this.navItems = this.itemsAdmin
              else if (data[i].codigo == 'PAC')
                this.navItems = this.itemsPac
              else if (data[i].codigo == 'ASI')
                this.navItems = this.itemsAsi
            }
          }
        }
      }
    })
  }

  itemsAdmin = [
    {
      name: 'Consultorio',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'Menú'
      }
    },
    // Modulo de mantenimiento
    {
      title: true,
      name: 'Seguridad'
    },
    // Menu Seguridad
    {
      name: 'Seguridad',
      url: '/seguridad/usuarios/',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Médicos',
          url: '/consultorio/medico-listado/',
          icon: 'icon-grid'
        },
        {
          name: 'Pacientes',
          url: '/consultorio/paciente-listado/',
          icon: 'icon-grid'
        }
      ]
    },
    // modulo adacemico
    {
      title: true,
      name: 'Actividades'
    },
    // Menu Consultorio
    {
      name: 'Administración',
      url: '/consultorio/agendar-cita',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Citas y Consultas',
          url: '/consultorio/consulta-medica/',
          icon: 'icon-grid'
        },
      ]
    },
    {
      name: 'Upse Online',
      url: 'https://upse.edu.ec',
      icon: 'icon-layers',
      class: 'mt-auto',
      variant: 'success',
      attributes: { target: '_blank', rel: 'noopener' }
    }
  ];

  itemsPac = [
    {
      name: 'Consultorio',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'Menú'
      }
    },
    // Modulo de mantenimiento
    {
      title: true,
      name: 'Seguridad'
    },
    // modulo adacemico
    {
      title: true,
      name: 'Actividades'
    },
    // Menu Consultorio
    {
      name: 'Citas',
      url: '/consultorio/agendar-cita',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Registrar Cita',
          url: '/consultorio/agendar-cita/',
          icon: 'icon-grid'
        },
      ]
    },
    {
      name: 'Upse Online',
      url: 'https://upse.edu.ec',
      icon: 'icon-layers',
      class: 'mt-auto',
      variant: 'success',
      attributes: { target: '_blank', rel: 'noopener' }
    }
  ];

  itemsAsi = [
    {
      name: 'Consultorio',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'Menú'
      }
    },
    // Modulo de mantenimiento
    {
      title: true,
      name: 'Seguridad'
    },
    // Menu Seguridad
    {
      name: 'Seguridad',
      url: '/seguridad/usuarios/',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Médicos',
          url: '/consultorio/medico-listado/',
          icon: 'icon-grid'
        },
        {
          name: 'Pacientes',
          url: '/consultorio/paciente-listado/',
          icon: 'icon-grid'
        }
      ]
    },
    // modulo adacemico
    {
      title: true,
      name: 'Actividades'
    },
    // Menu Consultorio
    {
      name: 'Citas',
      url: '/consultorio/agendar-cita',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Registrar Cita',
          url: '/consultorio/agendar-cita/',
          icon: 'icon-grid'
        },
      ]
    },
    {
      name: 'Upse Online',
      url: 'https://upse.edu.ec',
      icon: 'icon-layers',
      class: 'mt-auto',
      variant: 'success',
      attributes: { target: '_blank', rel: 'noopener' }
    }
  ];
}
