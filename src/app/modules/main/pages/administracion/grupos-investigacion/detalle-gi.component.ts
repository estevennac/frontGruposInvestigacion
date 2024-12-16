import { Component, OnInit } from '@angular/core';
import { Area } from '../../../../../types/area.types';
import { Router } from '@angular/router';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { GIControl } from './modal-gi.component';
import { MatDialog } from '@angular/material/dialog';
import { InvGroupCompleteForm, InvGroupForm } from 'src/app/types/invGroup.types';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { Usuario } from 'src/app/types/usuario.types';
import { catchError, map, Observable, of } from 'rxjs';
import { LineModalEdit } from './modales_gestion/lineModal.component';
import { MembersModalEdit } from './modales_gestion/membersModal.component';
@Component({
  selector: 'app-grupos-investigacion-crud',
  templateUrl: './detalle-gi.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class DetalleGIComponent implements OnInit {
invGroup:InvGroupCompleteForm;
coordinador:Usuario;

  constructor(private router: Router, private giService: InvGroupService,
    private usuarioService: UsuarioService,
    private dialog:MatDialog
  ) {}
id:number;
  ngOnInit() {
   this.id= Number(sessionStorage.getItem('selectedId'))
    this.get(this.id);
  }

  get(id:number) {
    this.giService.getByIdAll(id).subscribe((data) => {
      this.invGroup = data;
      console.log(this.invGroup);
    });
  }

  goBack() {
    this.router.navigate(['main/admin']);
  }
  
  EditLine(): void {
      const dialogRef = this.dialog.open(LineModalEdit, {
          width: '80%',
          height: '70%',
          
          //data: { area } // Pasar los datos del dominio si existe (para edición)
      });
  
      dialogRef.afterClosed().subscribe((result) => {
          if (result) {
              this.get(this.id); // Actualizar la tabla si se creó o editó algo
          }
          this.get(this.id);
      });
  }
  EditMembers(): void {
    const dialogRef = this.dialog.open(MembersModalEdit, {
        width: '80%',
        height: '70%',
        
        //data: { area } // Pasar los datos del dominio si existe (para edición)
    });

    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
            this.get(this.id); // Actualizar la tabla si se creó o editó algo
        }
        this.get(this.id);
    });
}
}
