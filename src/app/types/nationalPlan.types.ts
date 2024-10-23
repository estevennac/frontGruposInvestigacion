export interface NationalPlan{
    idPlanNacional?:number;
    nombre?:string;
    numeroPolitica?:string;
    descripcion?:string;
    estado?:boolean;
    usuarioCreacion?:string;
    fechaCreacion?:Date;
    usuarioModificacion?:string;
    fechaModificacion?:Date;
} 
export interface NationalPlanFilter{
   planNacional:{ idPlanNacional?:number;
    nombre?:string;
    numeroPolitica?:string;
    descripcion?:string;
    estado?:boolean;
    usuarioCreacion?:string;
    fechaCreacion?:Date;
    usuarioModificacion?:string;
    fechaModificacion?:Date;}[];
} 
