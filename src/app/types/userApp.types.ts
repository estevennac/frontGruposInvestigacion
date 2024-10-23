

export interface UserApp {
  id: string;
  cedula: string;
  nombres: string;
  correoInstitucional: string;
  correoPersonal: string;
  urlFoto: string;
  tipo: string;
  ubicacion: string;
  roles: UserRole[]; 
}
export interface UserRole {
  idRol: number;
  nombreRol: string;
  fechaCreacionRol: string | null;
  usuarioCreacionRol: string | null;
  fechaModificacionRol: string | null;
  usuarioModificacionRol: string | null;
}