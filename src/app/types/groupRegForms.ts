export interface GroupRegForm {
    idFormularioRegistroGrupo?: number;
    resolucion?: number;
    creacionFormCheck?: boolean;
    planDesarrolloCheck?: boolean;
    sumarioCheck?: boolean;
    certificadoCategoriaCheck?: boolean;
    curriculum?: boolean;
    minimoProfesoresCheck?: boolean;
    meritosCientificosCheck?: boolean;
    usuarioCreacionFormReg?: string;
    fechaCreacionFormReg?: Date;
    usuarioModificacionFormReg?: string;
    fechaModificacionFormReg?: Date;
  }