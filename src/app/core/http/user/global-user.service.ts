import { Injectable } from '@angular/core';//Indica que la clase es un servicio que puede ser inyectado en otros componentes o servicios.
import { HttpClient } from '@angular/common/http';//Se utiliza para realizar solicitudes HTTP.
import { Observable } from 'rxjs';//Se utiliza para trabajar con flujos de datos asincrónicos.
import { GlobalUser } from 'src/app/types/user.types';//Importa el tipo de datos GlobalUser definido en la aplicación.
import { environment } from 'src/environments/environment';// Importa el objeto de configuración de entorno que contiene la URL base para la API.

import { map } from 'rxjs/operators';//Operador de RxJS que se utiliza para transformar los elementos emitidos por un observable.
import { Usuario } from 'src/app/types/usuario.types';

@Injectable({
  providedIn: 'root'
  //Indica que este servicio se proporcionará en el nivel raíz, lo que significa que estará disponible para toda la aplicación.
})
export class GlobalUserService {
  private readonly URL = environment.espematicoApiUrl;// Propiedad que almacena la URL base para la API. Esta URL se obtiene del objeto de configuración de entorno (environment).
  private readonly URL1 = environment.appApiUrl + '/user';
  constructor(private http: HttpClient) {}//Constructor que recibe una instancia de HttpClient a través de la inyección de dependencias.

  getUserByUsername(username: string): Observable<GlobalUser> {//: Método que realiza una solicitud GET a la API para obtener un usuario por nombre de usuario. Retorna un Observable que emite un objeto GlobalUser.
    return this.http.get<GlobalUser[]>(this.URL + '/username/' + username).pipe(//Se utiliza para encadenar operadores en el flujo de datos del observable.
      map((users: GlobalUser[]) => {// Transforma la respuesta de la API (un arreglo de usuarios) en un solo usuario o null si no hay usuarios encontrados.
        if (users.length > 0) {
          return users[0];
        }
        return null;
      })
    );
  }
  getUserByUserName(username: string):Observable<Usuario> {
    return this.http.get<Usuario>(`${this.URL1}/userName/${username}`);
  }
}
/*Este servicio proporciona métodos para realizar solicitudes HTTP relacionadas con la obtención de usuarios globales en la aplicación, especialmente buscando usuarios por nombre de usuario. La respuesta se transforma para devolver un solo usuario o null según la lógica implementada en la función map.*/