import { Component, OnInit, ViewChild } from '@angular/core';
import { AcademicDomainService } from 'src/app/core/http/academic-domain/academic-domain.service';
import { AcademicDomain } from '../../../../../types/academicDomain.types';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AcademicDomainsControl } from './modal_academic_domain.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-academic-domain-list',
  templateUrl: './dom-acad.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class DominioAcademico implements OnInit {
  displayedColumns: string[] = ['nombreDominioAcademico', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<AcademicDomain>(); // Fuente de datos para la tabla
  isLoading: boolean = true;
  searchControl = new FormControl(); // Control de búsqueda
  currentUser: string;
  currentDate: Date = new Date();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private academicService: AcademicDomainService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,


  ) { }

  ngOnInit() {
    this.getAcademicDomain();
    this.currentUser = this.authService.getUserName();
    this.searchControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value.trim().toLowerCase();
    });
  }

  getAcademicDomain() {
    this.academicService.getAll().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: AcademicDomain, filter: string) =>
        data.nombreDominioAcademico.toLowerCase().includes(filter);

      this.isLoading = false;
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
    this.isLoading = true;
    this.academicService.getById(id).subscribe(
      (academicDomain: AcademicDomain) => {
        this.isLoading = false;
        this.openDialog(academicDomain); // Abrir el modal con los datos para editar
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast')
      }
    );
  }

  deleteAcademicDomain(id: number) {
    this.isLoading = true;
    this.academicService.update(id, { estado: false,fechaModificacionDominio: this.currentDate, usuarioModificacionDominio: this.currentUser }).subscribe(
      () => {
        this.isLoading = false;
        this.showToast('Dominio académico desactivado correctamente', 'cerrar');
        this.getAcademicDomain();
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast');
      }
    );
  }

  activateAcademicDomain(id: number) {
    this.isLoading = true;
    this.academicService.update(id, { estado: true, fechaModificacionDominio: this.currentDate, usuarioModificacionDominio: this.currentUser }).subscribe(
      () => {
        this.isLoading = false;
        this.showToast('Dominio académico activado correctamente', 'cerrar');
        this.getAcademicDomain();
      },
      (error) => {
        this.isLoading = false;
        console.error('Error al activar el dominio académico', error);
        this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast');
      }
    );
  }

  goBack() {
    this.router.navigate(['main/admin']);
  }

  private showToast(message: string, action: string, panelClass: string = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: panelClass,
    });
  }
}
