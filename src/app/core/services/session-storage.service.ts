import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor() {}
//Un método que almacena un par clave-valor en el almacenamiento de sesión. Convierte el valor a una cadena JSON antes de almacenarlo.
  setItem(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
//Un método que obtiene el valor asociado con la clave proporcionada desde el almacenamiento de sesión y lo convierte de nuevo a su representación original.
  getItem(key: string) {
    return JSON.parse(sessionStorage.getItem(key));
  }
}
/*Este servicio proporciona una interfaz simple para interactuar con el almacenamiento de sesión del navegador. Puedes utilizar este servicio para almacenar y recuperar datos de manera persistente durante la sesión del usuario en la aplicación.*/