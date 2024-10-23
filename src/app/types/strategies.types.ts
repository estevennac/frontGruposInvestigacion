import { ObjectivesService } from "../core/http/objectives/objectives.service";
import { Objectives } from "./objectives.types";
export interface Strategies {
    idEstrategia: number;
    idObjetivo: number;
    estrategia: string;
    ods:string;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
}

export interface ObjStrategiesComplete {
    obj: Objectives;
    str: Strategies[];
  }
  