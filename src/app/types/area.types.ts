import { Line } from "./line.types";
export interface Area{
    idArea?:number;
    idDominio?:number;
    nombreArea?:string;
    estado?:boolean;
    usuarioCreacionArea?:string;
    fechaCreacionArea?:Date;
    usuarioModificacionArea?:string;
    fechaModificacionArea?:Date;
    nombreDominio?:string;
    lineas?: Line[];
}
