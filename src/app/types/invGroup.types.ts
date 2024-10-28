export interface InvGroupForm {
    idGrupoInv: number;
    idUser: number;
    nombreGrupoInv: string;
    estadoGrupoInv: string;
    acronimoGrupoinv: string;
    mision?:string;
    vision?:string;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
}
