import { Component, OnInit } from '@angular/core';
import { AcademicDomainService } from '../../../../../core/http/academic-domain/academic-domain.service';
import { AcademicDomain } from '../../../../../types/academicDomain.types';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AcademicDomainsControl } from './modal_academic_domain.component';
@Component({
  selector: 'app-academic-domain-list',
  templateUrl: './dom-acad.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class DominioAcademico implements OnInit {
  academicDomain: AcademicDomain[] = [];

  constructor(private router: Router, private academicService: AcademicDomainService,
    private dialog:MatDialog
  ) {}

  ngOnInit() {
    this.getAcademicDomain();
  }

  getAcademicDomain() {
    this.academicService.getAll().subscribe((data) => {
      // Filtrar y asignar solo los dominios académicos con estado activo (estado == true)
      this.academicDomain = data;
    });
  }

  openDialog(dominio?: AcademicDomain): void {
    const dialogRef = this.dialog.open(AcademicDomainsControl, {
        width: '50%',
        height: '70%',
        data: { dominio } // Pasar los datos del dominio si existe (para edición)
    });

    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
            this.getAcademicDomain(); // Actualizar la tabla si se creó o editó algo
        }
    });
}

editAcademicDomain(id: number) {
    this.academicService.getById(id).subscribe(
        (academicDomain: AcademicDomain) => {
            this.openDialog(academicDomain); // Abrir el modal con los datos para editar
        },
        (error) => {
            console.error('Error al obtener los detalles del dominio académico', error);
        }
    );
}


  deleteAcademicDomain(id: number) {
    this.academicService.update(id, { estado: false }).subscribe(
      () => {
        console.log(`Dominio académico con ID ${id} eliminado correctamente`);
        // Actualiza la lista de dominios académicos después de eliminar uno
        this.getAcademicDomain();
      },
      (error) => {
        console.error('Error al eliminar el dominio académico', error);
      }
    );
  }
  activateAcademicDomain(id: number) {
    this.academicService.update(id, { estado: true }).subscribe(
      () => {
        console.log(`Dominio académico con ID ${id} eliminado correctamente`);
        // Actualiza la lista de dominios académicos después de eliminar uno
        this.getAcademicDomain();
      },
      (error) => {
        console.error('Error al eliminar el dominio académico', error);
      }
    );
  }
  goBack() {
    this.router.navigate(['main/admin']);
  }
}
