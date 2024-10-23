import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { RolService } from 'src/app/core/http/rol/rol.service';
import { UserRolService } from 'src/app/core/http/userRol/userRol.service';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { Roles } from 'src/app/types/rol.types';
import { UserApp } from 'src/app/types/userApp.types';
import { Observable } from 'rxjs';
import { UserRoles } from 'src/app/types/userRol.types'; 

@Component({
  selector: 'app-gestion-roles',
  templateUrl: './gestion-roles-principal.component.html',
  styleUrls: ['../roles.component.scss']
})
export class GestionRolesPrincipalComponent implements OnInit {
  user: UserApp;
  usuarios: any[];
  userId: number;
  imageUrl: string;
  miembro: FormGroup;
  roles: Roles[];
  checkboxRoles = {
    "roles": [],
    "checks": []
  };

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private userRolService: UserRolService,
    private rolService: RolService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.miembro = this.fb.group({
      usuario: ['', Validators.required]
    });

    this.buscarMiembro();
  }

  getAllRoles(): Observable<Roles[]> {
    return this.rolService.getAllRoles();
  }

 buscarMiembro(): void {
  const user = this.miembro.get('usuario').value;

  if (!user) {
    this.user = null;
   
    return;
  }

  const token = sessionStorage.getItem('access_token');

  this.userRolService.getUserApp(user, token).subscribe(
    (data) => {
      if (data.id != null) {
      
        this.user = data;
        this.userRolService.getUserRolByUsername(user).subscribe(
          (userData) => {
            this.userId = userData['usuario'].id;
            
            if (this.userId !== null) {
              if (userData != null && userData['roles'].length > 0) {
                this.getAllRoles().subscribe((roles) => {
                  this.checkboxRoles.checks = roles.map((item) => {
                    const isRolePresent = userData['roles'].find(role => role.idRol === item.idRol);
                    return {
                      idRol: item.idRol,
                      nombreRol: item.nombreRol,
                      check: !!isRolePresent 
                    };
                  });
                  
                });
              } else {
                this.getAllRoles().subscribe((roles) => {
                  this.checkboxRoles.checks = roles.map((item) => {
                    return {
                      idRol: item.idRol,
                      nombreRol: item.nombreRol,
                      check: false 
                    };
                  });
                });
              }
            } else {
            }
          },
          (error) => {
          }
        );
      }
    },
    (error) => {
    }
  );
}


  toggleRole(event: Event, rol: any): void {
    const checkbox = event.target as HTMLInputElement;
    const roleId = rol.idRol;
    
    if (!this.user) {
      return;
    }
    
    if (checkbox.checked) {
      console.log(`Rol con ID ${roleId} seleccionado.`);
      console.log("Datos a enviar para crear el rol:", { idUsuario: this.userId, idRoles: roleId });
      
      this.userRolService.createUserRol({ idUsuario: this.userId, idRoles: roleId } as UserRoles).subscribe(
        (response) => {
          console.log("Respuesta al crear el rol:", response);
        },
        (error) => {
          console.error("Error al crear el rol para el usuario", error);
        }
      );
    } else {
      console.log(`Rol con ID ${roleId} deseleccionado.`);
      console.log("Datos a enviar para eliminar el rol:", this.userId, roleId);
      
      this.userRolService.deleteUserRole (this.userId, roleId).subscribe(
        () => {
        },
        (error) => {
          console.error("Error al eliminar el rol del usuario", error);
        }
      );
    }
  }
  
  

  separarNombreCompleto(nombreCompleto: string): { nombre: string, apellido: string } {
    const [apellido, nombre] = nombreCompleto.split(", ");
    return { nombre, apellido };
  }

  limpiarUsuario(): void {
    this.user = null;
    this.miembro.reset(); 
  }
  redirigirARegistro(): void {
  
    this.router.navigate(['/main/rol-gestion']);
  }
}
