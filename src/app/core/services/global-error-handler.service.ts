import { ErrorHandler,//Interfaz de Angular para manejar errores en la aplicación.
   Injectable,
    Injector, //Servicio Angular que proporciona acceso a los servicios inyectados.
    NgZone } from '@angular/core';//Servicio Angular que proporciona una zona de cambio, que se utiliza aquí para ejecutar código en la zona correcta (fuera o dentro de Angular) dependiendo de las necesidades.
import { HotToastService } from '@ngneat/hot-toast';//Servicio proporcionado por la biblioteca @ngneat/hot-toast para mostrar notificaciones tostadas en la interfaz de usuario.
import { HttpErrorResponse } from '@angular/common/http';//Clase que representa un error de respuesta HTTP.

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  private toast: HotToastService;
  constructor(private injector: Injector, private zone: NgZone) {}

  handleError(error: any) {// Método requerido por la interfaz ErrorHandler que se ejecuta cada vez que se produce un error en la aplicación.
    this.toast = this.injector.get(HotToastService);//Obtiene una instancia del servicio HotToastService a través del Injector.
    console.error('Error from global error handler', error);//Imprime el error en la consola para propósitos de registro.
    // Check if it's an error from an HTTP response
    if (!(error instanceof HttpErrorResponse)) {
      error = error.rejection; // get the error object
    }
//Verifica si el error es una instancia de HttpErrorResponse o si es una promesa rechazada. En el segundo caso, obtiene el objeto de error de la promesa.
    if (error) {
      let errorMessage = error.message;

      if (error?.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor';
      } else {
        errorMessage = error.error ? error.error.message : error.message;
      }

      if (
        error.error &&
        error.error.invalidParameters !== undefined &&
        error.error.invalidParameters !== null &&
        error.error.invalidParameters.length > 0
      ) {
        errorMessage += '\n';

        errorMessage += JSON.stringify(error.error.invalidParameters, null, 2);
      }
//para ejecutar el código de notificación de tostadas dentro de la zona Angular, asegurando así que las actualizaciones de la interfaz de usuario se realicen correctamente.
      this.zone.run(() => this.toast.error(errorMessage));
    }
  }
}
