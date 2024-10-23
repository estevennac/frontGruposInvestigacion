export interface ChecklistForm {
    idChecklist: number;
    idGrupoInv:number;
    fechaChecklist: Date;
    peticionMemorando: boolean;
    formularioGrInv: boolean;
    planDevGr: boolean;
    planEconomico: boolean;
    hojaVida: boolean;
    certificado: boolean;
    recibidoPor: string;
    enviadoPor: string;
    usuarioCreacionChecklist: string;
    fechaCreacionChecklist: Date;
    usuarioModificacionChecklist: string;
    fechaModificacionChecklist: Date;
  }
  