export interface RelevanceReport {
    idInformePertinencia: number;
    idGrupo: number;
    numeroMemo: String;
    formularioCreacion: Boolean;
    planDesarrollo: Boolean;
    documentosAdicionales: Boolean;
    objetivos: String;
    planEstrategico: Boolean;
    pertinenciaAcademicaAporte: Boolean;
    coordinador: Boolean;
    miembros: Boolean;
    objetivosPlanDesarrollo: Boolean;
    conclusiones: String;
    recomendaciones: String;
    usuarioCreacion: String;
    fechaCreacion: Date;
    usuarioModificacion: String;
    fechaModificacion: Date;
}