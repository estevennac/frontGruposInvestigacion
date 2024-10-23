import {
  HttpEvent,// Clases relacionadas con las solicitudes y respuestas HTTP.
  HttpHandler,
  HttpInterceptor,//Interfaz de Angular para interceptar las solicitudes HTTP.
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OAuthService } from "angular-oauth2-oidc";

@Injectable({
  providedIn: "root",
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private authService: OAuthService) {}// Constructor que recibe una instancia de OAuthService a través de la inyección de dependencias.
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {//Método requerido por la interfaz HttpInterceptor que se ejecuta cada vez que se realiza una solicitud HTTP.
    let token = this.authService.getAccessToken();//Obtiene el token de acceso del servicio de autenticación OAuth.
    if (req.headers.get("skip")) return next.handle(req);// Verifica si la solicitud tiene un encabezado "skip". Si es así, la solicitud se maneja sin modificarla.
    if (token != "") {//Verifica si hay un token de acceso disponible.
      const authReq = req.clone({//Clona la solicitud original y agrega el token de acceso al encabezado de autorización.
        headers: req.headers.set("Authorization", "Bearer " + token),
      });
      return next.handle(authReq);// Continúa con la solicitud modificada.
    }
    return next.handle(req);//Si no hay token de acceso, continúa con la solicitud original.
  }
}
/*Este interceptor se utiliza para agregar el token de acceso a las solicitudes HTTP salientes, lo que es común en escenarios de autenticación OAuth. La verificación del encabezado "skip" permite excluir ciertas solicitudes de este procesamiento.*/