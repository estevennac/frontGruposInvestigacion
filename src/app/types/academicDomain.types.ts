import { Area } from "./area.types";

export interface AcademicDomain{
    idDomimioAcademico?:number;
    nombreDominioAcademico?:string;
    estado?:boolean;
    usuarioCreacionDominio?:string;
    fechaCreacionDominio?:Date;
    usuarioModificacionDominio?:string;
    fechaModificacionDominio?:Date;
    areas?:Area[];
}
