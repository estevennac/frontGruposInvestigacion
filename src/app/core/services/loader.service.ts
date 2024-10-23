import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';//Un tipo de sujeto observable que tiene un valor inicial y emite este valor actualizado a los suscriptores.

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoading$$ = new BehaviorSubject<boolean>(false);//Una instancia de BehaviorSubject que almacena el estado actual del cargador (si está cargando o no). Se inicializa con false.
  isLoading$ = this.isLoading$$.asObservable();
//Un observable que los componentes pueden suscribirse para recibir actualizaciones sobre el estado de carga.
  constructor() {}
//Un método que actualiza el estado de carga llamando al método next del BehaviorSubject. Esto notifica a los suscriptores que ha habido un cambio en el estado de carga.
  setLoading(isLoading: boolean) {
    this.isLoading$$.next(isLoading);
  }
}
/*Este servicio es útil para manejar el estado de carga en una aplicación Angular. Otros componentes pueden suscribirse a isLoading$ para recibir actualizaciones sobre el estado de carga y el método setLoading se utiliza para actualizar y notificar esos cambios. Por ejemplo, puede usarse para mostrar o esconder un indicador de carga en la interfaz de usuario según sea necesario.





*/
