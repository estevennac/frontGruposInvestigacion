//Importa los módulos y servicios necesarios para implementar la lógica de autenticación, como OAuthService para OAuth 2.0 y otros servicios relacionados con la autenticación de usuarios.
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from 'src/app/core/auth/oauth.config';
import { TokenClaim } from 'src/app/types/token-claim.types';
import { GlobalUserService } from 'src/app/core/http/user/global-user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalUser } from 'src/app/types/user.types';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/types/usuario.types';
import { environment } from 'src/environments/environment';

//Indica que la clase AuthService es un servicio inyectable en la aplicación Angular y se puede proporcionar a través del sistema de inyección de dependencias.
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly URL = environment.appApiUrl + '/user';

  //globalUserSubject: Un sujeto de RxJS (BehaviorSubject) que emite eventos cuando cambia el usuario global. Se utiliza para mantener un seguimiento del estado del usuario actual.
  private globalUserSubject: BehaviorSubject<GlobalUser> =
    new BehaviorSubject<GlobalUser>(null);
  //globalUser$: Un observable que emite eventos cuando cambia el usuario global. Permite a otros componentes o servicios suscribirse a cambios en el usuario.
  globalUser$: Observable<GlobalUser> = this.globalUserSubject.asObservable();

  constructor(
    private oAuthService: OAuthService,
    private globalUserService: GlobalUserService,
    private http: HttpClient
  ) {
    //configureOauthService(): Configura el servicio OAuth (OAuthService) utilizando la configuración definida en authConfig. Intenta iniciar sesión automáticamente si ya hay un token válido.
    this.configureOauthService();
  }

  get tokenClaims(): TokenClaim {
    return {
      familyName: this.oAuthService.getIdentityClaims()['family_name'],
      email: this.oAuthService.getIdentityClaims()['email'],
      givenName: this.oAuthService.getIdentityClaims()['given_name'],
      name: this.oAuthService.getIdentityClaims()['name'],
      username: this.oAuthService.getIdentityClaims()['sub'],
      preferredUsername:
        this.oAuthService.getIdentityClaims()['preferred_username']
    };
  }

  get username(): string {
    return this.oAuthService.getIdentityClaims()['sub'];
  }

  getByUserName(userName: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.URL}/userName/${userName}`);
  }
  //Inicia el flujo de inicio de sesión implícito si no hay un token de acceso válido. Si ya hay un token válido, obtiene la información del usuario global.
  login() {
    if (!this.oAuthService.hasValidAccessToken()) {
      this.oAuthService.initImplicitFlow();
      return;
    }
    //
    if (this.oAuthService.getIdentityClaims()) {
      this.getGlobalUser();
    }
  }
  //Cierra la sesión del usuario mediante el servicio OAuth.
  logout() {
    this.oAuthService.logOut();
  }
  //Configura el servicio OAuth (OAuthService) utilizando la configuración definida en authConfig. Intenta iniciar sesión automáticamente si ya hay un token válido.
  private configureOauthService() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.tryLogin({
      onTokenReceived: () => {
        this.getGlobalUser();
      }
    });
  }
  //getGlobalUser(): Obtiene la información del usuario global haciendo una llamada al servicio GlobalUserService utilizando el nombre de usuario extraído del token.
  private getGlobalUser() {
    this.globalUserService
      .getUserByUsername(this.tokenClaims.username)
      .subscribe(user => {
        this.setGlobalUser(user);
      });
  }
  //setGlobalUser(user: GlobalUser): Establece el usuario global utilizando el sujeto globalUserSubject. En este caso, parece haber un ajuste temporal (TODO) que agrega un pidm al usuario global.
  private setGlobalUser(user: GlobalUser) {
    // TODO: Remove this when the backend is fixed
    // user.pidm = 289444; //director
    //    user.pidm = 8014; //coordinador
    this.globalUserSubject.next(user);
  } // Inicia un flujo de inicio de sesión implícito con una redirección específica.
  public capture(redirectable: string): void {
    this.oAuthService.initImplicitFlow(redirectable);
  }
  //Redirige después de un intento de inicio de sesión, aprovechando la información del estado.
  public redirection(): void {
    this.oAuthService.tryLogin({
      onTokenReceived: info => {
        window.location.href = info.state;
      }
    });
  }
  //Inicia el flujo de obtención de token de acceso implícito.
  public obtainAccessToken() {
    this.oAuthService.initImplicitFlow();
  }

  public refreshToken(): void {
    this.oAuthService.refreshToken();
  }

  //Verifica si el usuario está autenticado comprobando la existencia del token de acceso.
  public isLoggedIn(): boolean {
    if (this.oAuthService.getAccessToken() === null) {
      return false;
    }
    return true;
  }
  //Obtiene el nombre de usuario del token de identificación.
  public getUserName(): string {
    const claims = this.getUserClaims();
    this.getUserInfo();
    if (claims === null) {
      // return ''
      // window.location.reload()
    } else {
      return claims['sub'].split('@')[0];
    }
  }
  //Obtiene las reclamaciones del usuario del token de identidad.
  public getUserClaims(): object {
    return this.oAuthService.getIdentityClaims();
  }
  // Obtiene información del usuario del token de identificación.
  public getUserInfo(): string {
    const idToken = this.oAuthService.getIdToken();
    if (idToken === null) {
      // window.location.reload();
    } else {
      return typeof idToken['sub'] !== 'undefined'
        ? idToken['sub'].toString()
        : '';
    }
  }
}
