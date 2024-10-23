import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';
//Definición de la Configuración de Autenticación (authConfig):
export const authConfig: AuthConfig = {

  issuer: environment.sso.serverUrl.concat(environment.sso.issuer),//La URL del servidor de autorización (ISS) concatenada con el emisor (issuer) desde el entorno.
  redirectUri: environment.sso.redirectUri,// La URI a la que se redirige después de una autenticación exitosa.
  clientId: environment.sso.clientId,//Identificador único de la aplicación cliente registrado en el servidor de autorización.
  scope: environment.sso.scope, //Alcance de la autorización solicitado durante la autenticación.
  tokenEndpoint: environment.sso.serverUrl.concat(// La URL del punto final para obtener tokens de acceso desde el servidor de autorización.
    environment.sso.tokenEndpoint
  ),
  userinfoEndpoint: environment.sso.serverUrl.concat(
    environment.sso.userinfoEndpoint
  ),//La URL del punto final para obtener información del usuario desde el servidor de autorización.
  showDebugInformation: environment.sso.showDebugInformation,//Booleano que indica si mostrar información de depuración relacionada con la autenticación.
  loginUrl: environment.sso.serverUrl.concat(
    environment.sso.authorizationEndpoint
  ),// La URL del servidor de autorización para la página de inicio de sesión
  logoutUrl: environment.sso.serverUrl.concat(environment.sso.logout),// La URL del servidor de autorización para la página de cierre de sesión.
  requireHttps: environment.sso.requireHttps,//Booleano que indica si se requiere HTTPS para las solicitudes
  disableAtHashCheck: true,// Desactiva la verificación del hash 'at_hash' en el token de acceso.
  timeoutFactor: 0.95,//Factor de tiempo de espera para el inicio de sesión automático
  responseType: environment.sso.responseType//Tipo de respuesta utilizado en las solicitudes de autorización.
};
