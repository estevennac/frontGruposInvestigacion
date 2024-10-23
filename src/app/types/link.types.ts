export interface Link {
    idVinculacion: number;
    idGrupoInv: number;
    idUser: number;
    justificacion: string;
    estado: string;
    tipo:string;
    observaciones: string;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
}
