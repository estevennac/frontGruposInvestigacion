export interface ActivityReport {
    idInformeActividades: number;
    antecedentes: string;
    conclusiones: string;
    recomendaciones: string;
    estado: string;
    usuarioCreacionInforme: string;
    fechaCreacionInforme: Date;
    usuarioModificacionInforme: string;
    fechaModificacionInforme: Date;
}
