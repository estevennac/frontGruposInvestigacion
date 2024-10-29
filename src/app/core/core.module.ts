import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({//es un decorador Angular que se utiliza para declarar un módulo.
  //En este caso, el módulo no tiene ninguna declaració
  declarations: [
  ],
  imports: [CommonModule]//Se importa el módulo CommonModule desde @angular/common. Este módulo proporciona directivas y tuberías comunes, como NgIf y NgFor, que son utilizadas en muchos lugares de las aplicaciones Angular.
})
export class CoreModule {}

//El propósito de este módulo puede ser proporcionar funcionalidades compartidas y servicios que serán utilizados por otros módulos de la aplicación. Puede incluir servicios, directivas, tuberías o cualquier otro recurso compartido.
//En resumen, el CoreModule parece ser un módulo de Angular destinado a proporcionar funcionalidades comunes y compartidas en toda la aplicación. Este enfoque ayuda a modularizar y organizar la aplicación de manera más eficiente.