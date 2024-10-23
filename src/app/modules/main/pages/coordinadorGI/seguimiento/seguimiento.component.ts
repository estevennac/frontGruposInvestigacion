import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.scss']
})

export class TarjetSeguimientoComponent {
  constructor(private router: Router){}
  
  tarjetas = [
    { titulo: 'Baremo de Seguimiento', imagen: '../../../../assets/img/icons/logos/educacion.png', ruta: 'main/baremo' },
    { titulo: 'Informe de Actividades', imagen: '../../../../assets/img/icons/logos/carrera-profesional.png', ruta: 'main/reporte-actividades' },

  ];

  seleccionarTarjeta(ruta: string) {
    this.router.navigateByUrl(ruta);
  }
}
