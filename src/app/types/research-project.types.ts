export interface ResearchProject {
    idProyecto: number;
    idInformeActividades: number;
    titulo: string;
    entidadFinanciera: string;
    institucionColaboradora: string;
    horas: number;
    minutos: number;
    presupuesto: number;
    responsable: string;
    participantes: string;
    tipo: string;
    estado: string;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
}
