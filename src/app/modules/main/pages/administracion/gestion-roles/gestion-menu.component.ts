import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './gestion-menu.component.html',
  styleUrls: ['./gestion-menu.component.scss']
})

export class GestionMenuComponent {
  constructor(private router: Router){}
  
  tarjetas = [
    { titulo: 'Crear Usuario', imagen: '../../../../assets/img/icons/logos/gestion2.png', ruta: 'main/rol-gestion' },
    { titulo: 'Gestionar Roles', imagen: '../../../../assets/img/icons/logos/gestion1.png', ruta: 'main/rol-principal' },

  ];

  seleccionarTarjeta(ruta: string) {
    this.router.navigateByUrl(ruta);
  }
}
