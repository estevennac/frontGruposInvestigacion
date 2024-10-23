//importaciones para hacer pruebas unitarias
//Importa las clases e interfaces necesarias desde Angular para crear un servicio de guardia de navegación.

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    
    if (this.authService.isLoggedIn()) {
     
      return true;
    } else {
      
      return this.router.createUrlTree(['/login']);
    }
  }
}








