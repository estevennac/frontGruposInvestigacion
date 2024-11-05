import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'; // Importar BreakpointObserver

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjets.component.html',
  styleUrls: ['../../styles/generalStyles.scss','./tarjets.component.scss']
})

export class TarjetasComponent implements OnInit {
  constructor(private router: Router,
    private breakpointObserver: BreakpointObserver
  ){ console.log(this.tarjetas);}
  
  ngOnInit(): void {
    this.adjustGridColumns();

  }
  tarjetas = [
    { titulo: 'Dominios Académicos', imagen: '../../../../assets/img/icons/logos/educacion.png', ruta: 'main/acadDom' },
    { titulo: '      Líneas', imagen: '../../../../assets/img/icons/logos/carrera-profesional.png', ruta: 'main/line' },
    { titulo: '      Área', imagen: '../../../../assets/img/icons/logos/investigacion.png', ruta: 'main/area' },
    { titulo: 'Plan de Nivel Superior', imagen: '../../../../assets/img/icons/logos/plan-de-negocios.png', ruta: 'main/upper-plan' },
    { titulo: '   Plan Nacional', imagen: '../../../../assets/img/icons/logos/plan-estrategico.png', ruta: 'main/national-plan' },
    { titulo: '   Marco Legal', imagen: '../../../../assets/img/icons/logos/documento-legal.png', ruta: 'main/legal' },
    { titulo: 'Objetivos Insitucionales', imagen: '../../../../assets/img/icons/logos/objetivos.png', ruta: 'main/obj_institucionales' },
    { titulo: 'Estrategias Insitucionales', imagen: '../../../../assets/img/icons/logos/estrategias.png', ruta: 'main/strategiesInst' },
    { titulo: 'ODS', imagen: '../../../../assets/img/icons/logos/ods.png', ruta: 'main/ods' },

  ];
  cols: number;

  adjustGridColumns() {
    this.breakpointObserver.observe([
      Breakpoints.Handset, // Pantallas pequeñas (celulares)
      Breakpoints.Tablet,  // Pantallas medianas (tabletas)
      Breakpoints.Web      // Pantallas grandes (escritorios)
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.Handset]) {
        this.cols = 1; // 1 columna en pantallas pequeñas
      } else if (result.breakpoints[Breakpoints.Tablet]) {
        this.cols = 2; // 2 columnas en pantallas medianas
      } else {
        this.cols = 5; // 5 columnas en pantallas grandes
      }
    });
  }
  seleccionarTarjeta(ruta: string) {
    this.router.navigateByUrl(ruta);
  }
}
