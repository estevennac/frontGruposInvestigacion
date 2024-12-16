import { Component, OnInit } from '@angular/core';
import { Area } from '../../../../../types/area.types';
import { Router } from '@angular/router';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { GIControl } from './modal-gi.component';
import { MatDialog } from '@angular/material/dialog';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { Usuario } from 'src/app/types/usuario.types';
import { catchError, map, Observable, of } from 'rxjs';
@Component({
  selector: 'app-grupos-investigacion-crud',
  templateUrl: './grupos-investigacion.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class GruposControlComponent implements OnInit {
invGroup:InvGroupForm[]=[];
coordinador:Usuario;
  constructor(private router: Router, private giService: InvGroupService,
    private usuarioService: UsuarioService,
    private dialog:MatDialog
  ) {}

  ngOnInit() {
    this.get();
  }

  get() {
    this.giService.getAll().subscribe((data) => {
      this.invGroup = data;
    });
  }
  usuarioNombre: { [key: number]: string } = {};

  getCoordinador(id:number): Observable<string> {
    if (!this.usuarioNombre) {
      this.usuarioNombre = {};
    }
    if (this.usuarioNombre[id]) {
      return of(this.usuarioNombre[id]);
    }
    return this.usuarioService.getById(id).pipe(
      map((usuario) => {
        const nombre = usuario?.nombre || 'Usuario no encontrado';
        this.usuarioNombre[id] = nombre; // Almacena el resultado en usuarioNombre
        return nombre;
      }),
      catchError(() => {
        const errorNombre = 'Usuario no encontrado';
        this.usuarioNombre[id] = errorNombre; // También almacena el mensaje de error
        return of(errorNombre);
      })
    );

  }
add(){
  
    this.router.navigate(['/main/crearGI']);
  
}

  
open(id: number): void {
  // Guardar el ID en sessionStorage
  sessionStorage.setItem('selectedId', id.toString());

  // Redirigir a otra ruta, por ejemplo, '/detalle'
  this.router.navigate(['/main/detalleGrupo']);
}
  deletee(id: number) {
   /* this.giService.update(id, { estado: false }).subscribe(
      () => {
        console.log(`Area con ID ${id} eliminado correctamente`);
        this.get();
      },
      (error) => {
        console.error('Error al eliminar el dominio académico', error);
      }
    );*/
  }
  active(id: number) {
    /*this.areaService.update(id, { estado: true }).subscribe(
      () => {
        console.log(`Area con ID ${id} eliminado correctamente`);
        this.get();
      },
      (error) => {
        console.error('Error al eliminar el dominio académico', error);
      }
    );*/
  }
  goBack() {
    this.router.navigate(['main/admin']);
  }
}
