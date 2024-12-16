import { Line } from "./line.types";
export interface Area{
    idArea?:number;
    nombreArea?:string;
    estado?:boolean;
    usuarioCreacionArea?:string;
    fechaCreacionArea?:Date;
    usuarioModificacionArea?:string;
    fechaModificacionArea?:Date;
    lineas?: Line[];
}
