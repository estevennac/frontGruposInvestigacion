export interface InvGroup_area {
    idArea: number;
    idGrupo: number;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
}
export interface CreaAreaCompleto {
    creacion: {
      idPeticionCreacion: number;
      idGrupoInv: number;
      estado: string;
      usuarioCreacionPeticion: string;
      fechaCreacionPeticion: string;
      usuarioModificacionPeticion: string;
      fechaModificacionPeticion: string;
    };
    area: {
        idArea: number;
        nombreArea: string;
      estado: boolean;
      usuarioCreacionArea: string;
      fechaCreacionArea: string;
      usuarioModificacionArea: string ;
      fechaModificacionArea: string ;
    }[];
  }