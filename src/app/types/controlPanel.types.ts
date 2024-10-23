export interface ControlPanelForm {
    idPanelControl: number;
    idPlanDesarrollo: number;
    objetivoEspecifico: string;
    responsable: string;
    actividad: string;
    indicador: string;
    meta1: string;
    meta2: string;
    meta3: string;
    meta4: string;
    financiamiento:number;
    observacion: string;
    usuarioCreacionPanelControl: string;
    fechaCreacionPanelControl: Date;
    usuarioModificacionPanelControl: string;
    fechaModificacionPanelControl: Date;
}