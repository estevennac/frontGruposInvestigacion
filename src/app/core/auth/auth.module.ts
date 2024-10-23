//importaciones
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthModule } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';
// Indica que esta clase es un módulo Angular.
@NgModule({
  declarations: [],// Un arreglo de componentes, directivas y pipes que pertenecen a este módulo. En este caso, no hay ninguno especificado.
  imports: [//Un arreglo de otros módulos cuyas clases exportadas son necesarias para las plantillas de componentes declarados en este módulo.
    CommonModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.appApiUrl],//Define las URLs permitidas para la autenticación del servidor de recursos. En este caso, se utiliza la URL definida en el archivo de entorno (environment.appApiUrl).
        sendAccessToken: false//Configura el módulo para que no envíe automáticamente el token de acceso en las solicitudes HTTP. Es posible que esto se haga manualmente en tu aplicación según las necesidades específicas.
      }
    })
  ]
})
export class AuthModule {}
