import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
//Función utilizada como función de seguimiento para la directiva ngFor en Angular. Devuelve la propiedad de la columna como un identificador único para el seguimiento.

export function trackByTableColumnProperty<T>(
  index: number,
  column: TableColumn<T>
): any {
  return column.property;
}
//Función que toma un array de columnas (TableColumn<T>[]) y devuelve un array de strings que contiene las propiedades de las columnas marcadas como visibles.
export function getVisibleColumns<T>(columns: TableColumn<T>[]): string[] {
  return columns
    .filter(column => column.visible)
    .map(column => column.property);
}
//Función similar a la anterior, pero devuelve las columnas por su definición de columna (columnDef).
export function getVisibleColumnsByColumnDef<T>(
  columns: TableColumn<T>[]
): string[] {
  return columns
    .filter(column => column.visible)
    .map(column => column.columnDef);
}
//Clase que representa un objeto de grupo en una tabla.
export class GroupTable {
  level: number = 0;//Nivel de profundidad del grupo.
  parent: GroupTable;//Referencia al grupo padre.
  expanded: boolean = true;// Indica si el grupo está expandido o no.

  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }//es un getter que devuelve true si el grupo es visible. Un grupo es visible si no tiene un grupo padre o si su grupo padre es visible y expandido.
}
/*En conjunto, estas funciones y la clase proporcionan utilidades útiles para trabajar con tablas, especialmente cuando se trata de manipular y visualizar columnas, así como de gestionar grupos en la tabla. Estos métodos y la clase se pueden utilizar en la lógica relacionada con la interfaz de usuario que implica tablas en una aplicación Angular.*/
