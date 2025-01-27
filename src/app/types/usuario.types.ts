export interface Usuario{
    id:number;
    usuario?:string;
    nombre:string;
    idInstitucional?:string;
    correo:string;
    departamento?:string;
    cedula:string;
    institucion:string;
    cargo?:string;
    nacionalidad?:string;
    foto?:string;
    genero?:string;
    fechaCreacion:Date;
    fechaModificacion:Date;
    usuarioCreacion:string;
    usuarioModificacion:string;
}