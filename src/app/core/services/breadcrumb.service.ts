import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';// Un tipo de sujeto observable que tiene un valor inicial y emite este valor actualizado a los suscriptores.
import { Breadcrumb } from 'src/@vex/interfaces/breadcrumb.interface';//Tipo de datos definido para representar un elemento de breadcrumb.

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  //Una instancia de BehaviorSubject que almacena la lista de elementos de breadcrumb. Inicializada con un array vacío.
  private itemsSource: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<
    Breadcrumb[]
  >([]);
//Una observable que los componentes pueden suscribirse para recibir actualizaciones cuando cambian los elementos de breadcrumb.
  itemsHandler = this.itemsSource.asObservable();
// Un método que actualiza la lista de elementos de breadcrumb llamando al método next del BehaviorSubject. Esto notifica a los suscriptores que ha habido un cambio en los datos.
  setItems(items: Breadcrumb[]) {
    this.itemsSource.next(items);
  }
}
//Este servicio es un componente central para gestionar el estado de los elementos de breadcrumb en la aplicación. Otros componentes pueden suscribirse a itemsHandler para recibir actualizaciones sobre los elementos de breadcrumb y el método setItems se utiliza para actualizar y notificar esos cambios. Es especialmente útil en aplicaciones que requieren una navegación con breadcrumb.
