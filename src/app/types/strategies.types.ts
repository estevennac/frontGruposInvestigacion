import { ObjectivesService } from "../core/http/objectives/objectives.service";
import { Objectives } from "./specificobjectives.types";
export interface Strategies {
    idEstrategia?: number;
    idObjetivo?: number;
    estrategia?: string;
    estado?: boolean;
    usuarioCreacion?: string;
    fechaCreacion?: Date;
    usuarioModificacion?: string;
    fechaModificacion?: Date;
    objetivo?:string;
}

export interface ObjStrategiesComplete {
    obj: Objectives;
    str: Strategies[];
}
  