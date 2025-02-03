import { ControlPanelComplete } from "./controlPanel.types";
import { InstStrategicObj } from "./InstStrategicObj.types";
import { LegalFramework } from "./legalFramework.types";
import { NationalPlan } from "./nationalPlan.types";
import { ObjectiveCompleteOds } from "./obj_strategies_ods.types";
import { UpperLevelPlan } from "./upperLevelPlan.types";

export interface DevelopmentPlanForms {
    idPlanDesarrollo: number;
    idGrupoInv: number;
    idObjetivoInst:number;
    tipo: string;
    estado: string;
    alcance:string;
    contexto:string;
    objGeneral:string;
    //objEstrategico:string;
    usuarioCreacionUsuario: string;
    fechaCreacionUsuario: Date;
    usuarioModificacionUsuario: string;
    fechaModificacionUsuario: Date;
}


export interface DevelopmentPlanComplete{
    planDesarrollo:DevelopmentPlanForms;
    panelControl:ControlPanelComplete[];
    marcoLegal:LegalFramework[];
    planSuperior:UpperLevelPlan[];
    planNacional:NationalPlan[];
    objEstrategiasOds:ObjectiveCompleteOds[];
    objEstrategicoInst:InstStrategicObj
}
 
  