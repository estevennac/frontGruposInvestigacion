import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { UserApp } from 'src/app/types/userApp.types';
import { Usuario } from 'src/app/types/usuario.types';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ExternMembersGroup } from './externMemberForm.component';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: './membersGroup.component.html',
  styleUrls: ['./creation-form.component.scss']
})
export class MembersGroup implements OnInit {
  user: UserApp;
  @Output() usuarioExternoCreado: EventEmitter<Usuario> = new EventEmitter<Usuario>();

  usuarios: any[];
  miembro: FormGroup;
  isSearchClicked = false; // Bandera para controlar la visibilidad del botón "Añadir"
  userNotFound = false; // Bandera para controlar la visibilidad del mensaje de error

  constructor(
    private fb: FormBuilder,
    private userService: UsuarioService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<MembersGroup>,
    private dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.usuarios = data.usuarios;
  }

  ngOnInit(): void {
    this.miembro = this.fb.group({
      usuario: ['', Validators.required]
    });
  }

  onClickNo(user): void {
    this.dialogRef.close(user);
  }

  buscarMiembro(): void {
    const user = this.miembro.get('usuario').value;
    const token = sessionStorage.getItem('access_token');
    this.userService.getUserApp(user, token).subscribe(
      (data) => {
        if (data) {
          this.user = data;
          this.isSearchClicked = true; // Activar la bandera después de la búsqueda exitosa
          this.userNotFound = false; // Usuario encontrado, no mostrar mensaje de error
        } else {
          this.userNotFound = true; // Usuario no encontrado, mostrar mensaje de error
          this.user = null;
          this.isSearchClicked = false; // No mostrar el botón "Añadir"
        }
      },
      (error) => {
        console.error('Error fetching user:', error);
        this.userNotFound = true; // Error al buscar usuario, mostrar mensaje de error
        this.user = null;
        this.isSearchClicked = false; // No mostrar el botón "Añadir"
      }
    );
  }

  limpiarUsuario(): void {
    this.user = null;
    this.isSearchClicked = false; // Resetear la bandera al limpiar
    this.userNotFound = false; // Resetear la bandera de error al limpiar
    this.miembro.reset();
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

          const usuario: Usuario = {
            id: null,
            usuario: userName,
            nombre: data.nombres,
            idInstitucional: data.id,
            telefono: null,
            correo: data.correoInstitucional,
            departamento: data.ubicacion,
            cedula: data.cedula,
            fechaCreacion: currentDate,
            fechaModificacion: null,
            usuarioCreacion: currentUser,
            usuarioModificacion: null,
            institucion: 'UNIVERSIDAD DE LAS FUERZAS ARMADAS – ESPE',
            cargo: ''
          };
          this.userService.createUser(usuario).subscribe(
            (response) => {
              console.log("usuario", response);
            }
          );
          console.log("user", userData);
        }
      });
    });
  }
  crearUsuarioExterno(): void {
    const dialogRef = this.dialog.open(ExternMembersGroup, {
        width: '60%',
        height: '90%',
        data: { usuarios: this.usuarios }
    });

    // Suscríbete al evento `memberCreated` para recibir el usuario creado
    dialogRef.componentInstance.memberCreated.subscribe((usuarioCreado: Usuario) => {
      console.log('Nuevo usuario creado en ExternMembersGroup:', usuarioCreado);
      this.usuarios.push(usuarioCreado); // Agregar el usuario a la lista de usuarios
      this.usuarioExternoCreado.emit(usuarioCreado); // Emitir el usuario al componente padre
    });
    // También puedes suscribirte al cierre del diálogo para realizar otras acciones
  
}



}
