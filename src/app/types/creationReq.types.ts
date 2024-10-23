export interface CreationReqForm {
    idPeticionCreacion: number;
    idGrupoInv: number;
    alineacionEstrategica:string;
    estado:string;
    usuarioCreacionPeticion: string;
    fechaCreacionPeticion: Date;
    usuarioModificacionPeticion: string;
    fechaModificacionPeticion: Date;
}
