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
  @Input() title = 'Consultorio Odontológico La Libertad';
  usuario: Usuario = new Usuario();
  @Input() mensajeNotificacion = 'Credenciales incorrectas!';
  // @ViewChild('msgNotification') msgNotification: jqxNotificationComponent;

  constructor(//public messagerService: MessagerService,
    private router: Router,
    private autenticacionService: AuthService,
    private consultorioService: ScoutService) { }


  ngOnInit() {
    this.autenticacionService.logout();
  }

  gotoHome() {
    //this.router.navigate(['/control']);
    this.router.navigate(['/dashboard']);
  }


  procesarEvento(event: any) {
    this.autenticacionService.login('rcatuto', 'consultorio')
      .subscribe(data => {
        this.router.navigate(['/consultorio/persona-edicion', 0, 'pac']);
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
        localStorage.setItem('usuarioActual', JSON.stringify(data));
        //localStorage.getItem('usuarioActual');
        this.gotoHome();
      }, error => {
        alert('Credenciales no válidas');
        /*  this.messagerService.alert({
          title: 'Credenciales no válidas',
          msg: 'Ingrese correctamente sus credenciales de acceso!'
         }); */
        console.log(error);
      });
  }

  recuperarUsuario() {
    // alert(this.usuario.usuario)
    this.consultorioService.getBuscarUsuario(this.usuario.usuario).subscribe(data => {
      // alert(JSON.stringify(data))
      localStorage.setItem('datosUsuario', JSON.stringify(data));
    });
  }

}
