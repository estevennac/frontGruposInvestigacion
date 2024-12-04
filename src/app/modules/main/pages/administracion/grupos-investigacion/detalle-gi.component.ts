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

  ngOnInit() {
   
    this.get( Number(sessionStorage.getItem('selectedId')));
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
}
