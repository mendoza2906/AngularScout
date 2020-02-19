import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class ControlAutenticacion implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Verifica si el usuario esta autenticado.
        if (localStorage.getItem('usuarioActual')) {
            return true;
        }

        // Si no esta autenticado lo redirige al login
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
