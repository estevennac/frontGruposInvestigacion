import { Component, OnInit } from '@angular/core';
import { LegalFramework } from 'src/app/types/legalFramework.types';
import { LegalFrameworkService } from 'src/app/core/http/legal-framework/legalFramework.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LegalFrameworkControl } from './modal_legal_framework.component';
@Component({
  selector: 'app-legal-framework-list',
  templateUrl: './legal-framework.component.html',
  styleUrls: ['../modulos.component.scss'],})
export class LegalFrameworkComponent implements OnInit {
  legalFramework: LegalFramework[] = [];

  constructor(private router: Router, private legalFrameworkService: LegalFrameworkService,
    private dialog:MatDialog
  ) {}

  ngOnInit() {
    this.getLegal();
  }

  getLegal() {
    this.legalFrameworkService.getAll().subscribe((data) => {
      this.legalFramework = data;
    });
  }

  openDialog(marco?: LegalFramework): void {
    const dialogRef = this.dialog.open(LegalFrameworkControl, {
        width: '50%',
        height: '70%',
        data: { marco } // Pasar los datos del dominio si existe (para edición)
    });

    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
            this.getLegal(); // Actualizar la tabla si se creó o editó algo
        }
    });
}

  
  editLegal(id: number) {
    this.legalFrameworkService.getById(id).subscribe(
      (marco: LegalFramework) => {
        this.openDialog(marco); // Abrir el modal con los datos para editar
      },
      (error) => {
        console.error('Error al obtener los detalles del marco legal', error);
      }
    );
  }

  deleteLegal(id: number) {
    this.legalFrameworkService.update(id, { estado: false }).subscribe(
      () => {
        console.log(`Marco Legal con ID ${id} eliminado correctamente`);
        this.getLegal();
      },
      (error) => {
        console.error('Error al eliminar el dominio académico', error);
      }
    );
  }
  activeLegal(id: number) {
    this.legalFrameworkService.update(id, { estado: true }).subscribe(
      () => {
        console.log(`Marco Legal con ID ${id} eliminado correctamente`);
        this.getLegal();
      },
      (error) => {
        console.error('Error al eliminar el dominio académico', error);
      }
    );
  }
  goBack() {
    this.router.navigate(['/main/admin'])
  }
}
