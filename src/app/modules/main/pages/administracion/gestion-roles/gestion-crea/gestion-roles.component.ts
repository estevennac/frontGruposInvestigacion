import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { UserApp } from 'src/app/types/userApp.types';
import { Usuario } from 'src/app/types/usuario.types';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector:'app-gestion-roles',
  templateUrl:'./gestion-roles.component.html',
  styleUrls:['./gestion-roles.component.scss']
})

export class GestionRolesComponent implements OnInit {
  user: UserApp;
  usuarios: any[];
  userId: number;
  imageUrl: string;
  miembro: FormGroup;
  usuarioAgregado: boolean = false;


  constructor(
    private fb: FormBuilder,
    private userService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.miembro = this.fb.group({
      usuario: ['', Validators.required]
    });
  }

  buscarMiembro(): void {
    const user = this.miembro.get('usuario').value;
    if (!user) {
      this.user = null; 
      return; 
    }
    const token = sessionStorage.getItem('access_token');
    this.userService.getUserApp(user, token).subscribe((data) => {
      this.user = data;
      this.userService.getByUserName(user).subscribe((userData) => {
        this.userId = userData.id;
        if (userData) {
          console.log("idUser", this.userId);
          console.log("user", userData);
        } else {
          console.log("user", userData);
        }
      });
    });
  }
  
  

  separarNombreCompleto(nombreCompleto: string): { nombre: string, apellido: string } {
    const [apellido, nombre] = nombreCompleto.split(", ");
    return { nombre, apellido };
  }
  limpiarUsuario() {
    // Restablecer el objeto de usuario a null
    this.miembro.reset(); // Reiniciar el formulario del miembro
    this.userId = 0;
  }

  crearUsuario(user): void {
    const currentUser = this.authService.getUserName();
    const currentDate = new Date();
    const token = sessionStorage.getItem('access_token');
    const userName = this.miembro.get('usuario').value;
  
    this.userService.getUserApp(userName, token).subscribe((data) => {
      this.userService.getByUserName(userName).subscribe((userData) => {
        if (userData.id != null) {
          console.log("El usuario ya existe en la bd");
        } else {
          const nombreCompleto = data.nombres;
          const { nombre, apellido } = this.separarNombreCompleto(nombreCompleto);
          const usuario: Usuario = {
            id: null,
            usuario: userName,
            nombre: data.nombres,
            idInstitucional: data.id,
            correo: data.correoInstitucional,
            departamento: data.ubicacion,
            cedula: data.cedula,
            fechaCreacion: currentDate,
            fechaModificacion: null,
            usuarioCreacion: currentUser,
            usuarioModificacion: null,
            institucion: 'UNIVERSIDAD DE LAS FUERZAS ARMADAS – ESPE',
            cargo: data.escalafon
          };
          this.userService.createUser(usuario).subscribe(
            (response) => {
              console.log("usuario", response);
              // Marcar el usuario como agregado correctamente
              this.usuarioAgregado = true;
            }
          );
          console.log("user", userData);
        }
      });
    });
  }
  
}
