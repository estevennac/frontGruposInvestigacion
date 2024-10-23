export interface AcadCrea {
    idPeticionCreacion: number;
    idDomAcad: number;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
}








export interface AcadCreaCompleto {
    creacion: {
      idPeticionCreacion: number;
      idGrupoInv: number;
      estado: string;
      usuarioCreacionPeticion: string;
      fechaCreacionPeticion: string;
      usuarioModificacionPeticion: string;
      fechaModificacionPeticion: string;
    };
    dominio: {
        idDomimioAcademico: number;
        nombreDominioAcademico: string;
      estado: boolean;
      usuarioCreacionDominio: string;
      fechaCreacionDominio: string;
      usuarioModificacionDominio: string ;
      fechaModificacionDominio: string ;
    }[];
  }
 