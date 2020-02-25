import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { Usuario } from 'src/app/model/usuario';
import { Usuario } from '../../model/usuario'
import { MessagerService } from 'ng-easyui/components/messager/messager.service';
import { template } from '@angular/core/src/render3';
import { AuthService } from '../../services/auth/auth.service';
import { ScoutService } from '../../services/scout/scout.service';

//import { jqxNotificationComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxnotification';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
})
export class LoginComponent implements OnInit {
  @Input() title = 'Distrito Scout Santa Elena';
  usuario: Usuario = new Usuario();
  @Input() mensajeNotificacion = 'Credenciales incorrectas!';
  // @ViewChild('msgNotification') msgNotification: jqxNotificationComponent;

  constructor(//public messagerService: MessagerService,
    private router: Router,
    private autenticacionService: AuthService,
    private ScoutService: ScoutService) { }


  ngOnInit() {
    this.autenticacionService.logout();
  }

  gotoHome() {
    //this.router.navigate(['/control']);
    this.router.navigate(['/dashboard']);
  }


  procesarEvento(event: any) {
    this.ScoutService.getBuscarUsuario(this.usuario.usuario).subscribe(data => {
      localStorage.setItem('datosUsuario', JSON.stringify(data));
    });
    this.autenticacionService.login('cmendoza', 'scout')
      .subscribe(data => {
        this.router.navigate(['/scout/persona-edicion', 0, 'sco']);
      }, error => {
        alert('Credenciales no válidas   Soy un botón sexy');
        console.log(error);
      });
  }

  login() {
    this.autenticacionService.login(this.usuario.usuario, this.usuario.claveAuxiliar)
      .subscribe(data => {
        // Si se obtuvo el token lo almacena en memoria en notación JSON.
        this.recuperarUsuario()
        this.recuperarDatosScout()
        localStorage.setItem('usuarioActual', JSON.stringify(data));
        //localStorage.getItem('usuarioActual');
        this.gotoHome();
      }, error => {
        alert('Credenciales no válidas');
        console.log(error);
      });
  }

  recuperarUsuario() {
    this.ScoutService.getBuscarUsuario(this.usuario.usuario).subscribe(data => {
      localStorage.setItem('datosUsuario', JSON.stringify(data));
    });
  }


  recuperarDatosScout() {
    this.ScoutService.getRecuperarDatosScout(this.usuario.usuario).subscribe(data => {
      localStorage.setItem('datosScout', JSON.stringify(data));
    });
  }

}
