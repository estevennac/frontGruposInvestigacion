import { Injectable } from '@angular/core'; //Indica que la clase es un servicio que puede ser inyectado en otros componentes o servicios.
import { environment } from 'src/environments/environment'; //Importa el objeto de configuración de entorno que contiene la URL base para las imágenes.

@Injectable({//Decorador que permite la inyección de dependencias en esta clase.
  providedIn: 'root'//Indica que este servicio se proporcionará en el nivel raíz, lo que significa que estará disponible para toda la aplicación.
})
export class ImageService {
  private readonly URL = environment.imageApiUrl;//Propiedad que almacena la URL base para las imágenes. Esta URL se obtiene del objeto de configuración de entorno (environment).

  getUserImagePath(idBanner: string): string {//Método que toma un idBanner (probablemente un identificador único de imagen) y concatena este identificador con la URL base de las imágenes. Retorna la URL completa para la imagen del usuario.
    return this.URL + idBanner;
  }
}
/*Este servicio proporciona una manera centralizada de construir rutas de imágenes basadas en la URL base para las imágenes definida en el entorno. La función getUserImagePath toma un identificador específico y devuelve la URL completa para la imagen asociada a ese identificador. Al inyectar este servicio en otros componentes o servicios, puedes reutilizar fácilmente la lógica de construcción de rutas de imágenes en diferentes partes de tu aplicación.*/