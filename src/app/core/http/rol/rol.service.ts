import { Injectable } from '@angular/core';//Indica que la clase es un servicio que puede ser inyectado en otros componentes o servicios.
import { environment } from 'src/environments/environment';//Importa el objeto de configuración de entorno que contiene la URL de la API.
import { HttpClient } from '@angular/common/http';//Se utiliza para realizar solicitudes HTTP.
import { Observable } from 'rxjs';//Se utiliza para trabajar con flujos de datos asincrónicos.
import { Roles } from 'src/app/types/rol.types';//Importa el tipo de datos Example definido en la aplicación.

//Decorador que permite la inyección de dependencias en esta clase.
@Injectable({
  providedIn: 'root'//Indica que este servicio se proporcionará en el nivel raíz, lo que significa que estará disponible para toda la aplicación.
})
export class RolService {
//Propiedad que almacena la URL de la API para el recurso 'example'.
  private readonly URL = environment.appApiUrl + '/rol';
//Constructor que recibe una instancia de HttpClient a través de la inyección de dependencias.
  constructor(private http: HttpClient) {}
//Método que realiza una solicitud GET a la API para obtener todos los elementos del recurso 'example'. Retorna un Observable que emitirá un arreglo de objetos de tipo Example.
  getAllRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(`${this.URL + "/"}`);
  }

  // Obtener un elemento por ID
  getRolById(id: number): Observable<Roles> {
    return this.http.get<Roles>(`${this.URL}/${id}`);
  }

}

