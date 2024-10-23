import { Area } from "./area.types";
export interface Line{
    idLinea?: number;
    idArea?: number;
    nombreLinea?: string;
    estado?:boolean;
    usuarioCreacionLinea?: string;
    fechaCreacionLinea?: Date;
    usuarioModificacionLinea?: string;
    fechaModificacionLinea?: Date;
    nombreArea?: string;
}

export interface LineArea{
    line:Line;
    area:Area;

}
