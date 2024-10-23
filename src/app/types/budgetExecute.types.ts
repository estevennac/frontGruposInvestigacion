export interface BudgetExecute {
    IdPresupuesto: number;
    idInformeActividades: number;
    item: string;
    valorAsignado: number;
    valorComprometido: number;
    valorAcumulado: number;
    bienesAdquiridos: string;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
}
