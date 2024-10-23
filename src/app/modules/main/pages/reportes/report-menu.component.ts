import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './report-menu.component.html',
  styleUrls: ['./report-menu.component.scss']
})

export class ReportMenuComponent {
  constructor(private router: Router){}
  
  tarjetas = [
    { titulo: 'Todos los Grupos de Investigación', imagen: '../../../../assets/img/icons/logos/report1.png', ruta: 'main/allGroups' },
    { titulo: 'Grupos con mayor producción Científica', imagen: '../../../../assets/img/icons/logos/report2.png', ruta: 'main/cientificProduction' },
    { titulo: 'Investigador más destacado', imagen: '../../../../assets/img/icons/logos/report3.png', ruta: 'main/salientResearcher' },
    { titulo: 'Producción de Artículos Científicos', imagen: '../../../../assets/img/icons/logos/report4.png', ruta: 'main/cientificArticles' },
  ];

  seleccionarTarjeta(ruta: string) {
    this.router.navigateByUrl(ruta);
  }
}
