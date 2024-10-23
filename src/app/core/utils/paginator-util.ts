import { MatPaginatorIntl } from '@angular/material/paginator';//Es una clase de Angular Material que proporciona la interfaz para la internacionalización del paginador.

const spanishRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) {
    return `0 de ${length}`;
  }//Es una función que devuelve la etiqueta que describe el rango actual de elementos visualizados en el paginador. Se utiliza en la propiedad getRangeLabel del paginador.

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

export function getSpanishPaginatorIntl() {//Es una función que crea una instancia de MatPaginatorIntl y establece las etiquetas para el paginador en español utilizando las propiedades proporcionadas.
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Registros por página:';
  paginatorIntl.nextPageLabel = 'Página siguiente';
  paginatorIntl.previousPageLabel = 'Página anterior';
  paginatorIntl.getRangeLabel = spanishRangeLabel;//Se asigna con la función spanishRangeLabel que definiste anteriormente.

  return paginatorIntl;
}
/*En resumen, este código personaliza las etiquetas del paginador de Angular Material para que estén en español. Puedes utilizar la función getSpanishPaginatorIntl para obtener una instancia del paginador con las etiquetas configuradas en español.*/