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
import { GroupModalEdit } from './modales_gestion/groupModal.component';
import { AnnexesService } from 'src/app/core/http/annexes/annexes.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Importa DomSanitizer y SafeResourceUrl
import { DocumentsService } from 'src/app/core/http/documentos/documents.service';
@Component({
  selector: 'app-grupos-investigacion-crud',
  templateUrl: './detalle-gi.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class DetalleGIComponent implements OnInit {
invGroup:InvGroupCompleteForm;
coordinador:Usuario;
isLoading:boolean = true;
  constructor(private router: Router, private giService: InvGroupService,
    private usuarioService: UsuarioService,
    private annexesService:AnnexesService,
    private dialog:MatDialog,
    private documentsService: DocumentsService,
    private sanitizer: DomSanitizer,
  ) {}
id:number;
  ngOnInit() {
   this.id= Number(sessionStorage.getItem('selectedId'))
    this.get(this.id);
    this.token=sessionStorage.getItem('access_token');

  }

  get(id:number) {
    this.giService.getByIdAll(id).subscribe((data) => {
      this.invGroup = data;
      console.log(this.invGroup);
    });
   this.getImage()
  }
  token:string;
  imagenUrl: SafeResourceUrl | undefined;

  getImage() {
    this.annexesService.getByGroupType(this.id, 'imagen_GI').subscribe((data) => {
      console.log('ann', data);
  
      // Asegurarse de que haya datos antes de continuar
      if (data && data.length > 0) {
        this.documentsService.getDocument(this.token, data[0].rutaAnexo, data[0].nombreAnexo)
          .subscribe({
            next: (blob) => {
              // Convertir el blob en una URL de imagen
              const imageBlob = new Blob([blob], { type: 'image/jpeg' }); // Cambiar el tipo MIME si la imagen es diferente, como 'image/png'
              const imageUrl = window.URL.createObjectURL(imageBlob);
  
              // Usar la URL en una propiedad que se enlazará en la plantilla
              this.imagenUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl); // Marcar la URL como segura
              console.log('imagenUrl', this.imagenUrl);
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error al cargar la imagen:', err);
              this.isLoading = false;
            }
          });
      } else {
        console.warn('No se encontraron anexos para el grupo.');
      }
    });
  }
  
  goBack() {
    this.router.navigate(['main/admin']);
  }
  
  EditLine(): void {
      const dialogRef = this.dialog.open(LineModalEdit, {
          width: '80%',
          height: '70%',
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
    });

    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
            this.get(this.id); // Actualizar la tabla si se creó o editó algo
        }
        this.get(this.id);
    });
}

EditGroup(): void {
  const dialogRef = this.dialog.open(GroupModalEdit, {
      width: '80%',
      height: '70%',
  });
  dialogRef.afterClosed().subscribe((result) => {
      if (result) {
          this.get(this.id);
      }
      this.get(this.id);
  });
}
}
