export interface InvGroup_line {
    idGrupo: number;
    idLinea: number;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
}

export interface LineCreaCompleto {
    creacion: {
      idPeticionCreacion: number;
      idGrupoInv: number;
      estado: string;
      usuarioCreacionPeticion: string;
      fechaCreacionPeticion: string;
      usuarioModificacionPeticion: string;
      fechaModificacionPeticion: string;
    };
    linea: {
      idLinea: number;
      nombreLinea: string;
      estado: boolean;
      usuarioCreacionLinea: string;
      fechaCreacionLinea: string;
      usuarioModificacionLinea: string ;
      fechaModificacionLinea: string ;
    }[];
  }
  