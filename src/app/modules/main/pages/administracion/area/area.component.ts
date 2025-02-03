import { Component, OnInit, ViewChild } from '@angular/core';
import { Area } from '../../../../../types/area.types';
import { Router } from '@angular/router';
import { AreaService } from 'src/app/core/http/area/area.service';
import { AreaControl } from './modal_area.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AcademicDomainService } from 'src/app/core/http/academic-domain/academic-domain.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-area-list',
  templateUrl: './area.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class AreaComponent implements OnInit {
  displayedColumns: string[] = ['nombreArea', 'nombreDominio', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Area>(); // Fuente de datos para la tabla
  isLoading: boolean = true;
  searchControl = new FormControl(); // Control de búsqueda
  currentUser: string;
  currentDate: Date = new Date();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private areaService: AreaService,
    private dialog: MatDialog,
    private academicDomainService: AcademicDomainService,
    private snackBar: MatSnackBar,
    private authService: AuthService,

  ) { }

  ngOnInit() {
    this.get();
    this.currentUser = this.authService.getUserName();

    // Aplicar filtro en tiempo real
    this.searchControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value.trim().toLowerCase();
    });
  }

  get() {
    this.academicDomainService.getAll().subscribe((academicDomain) => {
      this.areaService.getAll().subscribe((data) => {
        data.forEach((area) => {
          const dominio = academicDomain.find(d => d.idDomimioAcademico === area.idDominio);
          area.nombreDominio = dominio ? dominio.nombreDominioAcademico : 'Dominio no encontrado';
        });

        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Area, filter: string) =>
          data.nombreArea.toLowerCase().includes(filter);

        this.isLoading = false;
      });
    });
  }

  openDialog(area?: Area): void {
    const dialogRef = this.dialog.open(AreaControl, {
      width: '50%',
      height: '70%',
      data: { area },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.get();
      }
    });
  }

  edit(id: number) {
    this.isLoading = true;
    this.areaService.getById(id).subscribe(
      (area: Area) => {
        this.isLoading = false;
        this.openDialog(area);
      },
      (error) =>{
        this.isLoading = false;
        this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast')

      }
        
    );
  }

  deletee(id: number, idDominio: number) {
    this.isLoading = true;
    this.areaService.update(id, { idDominio, estado: false, fechaModificacionArea: this.currentDate, usuarioModificacionArea: this.currentUser }).subscribe(
      () => {
        this.isLoading = false;
        this.showToast('Área desactivada correctamente', 'cerrar');
        this.get();
      },
      (error) =>{
        this.isLoading = false;
        this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast')

      }    );
  }

  active(id: number, idDominio: number) {
    this.isLoading = true;
    this.areaService.update(id, { idDominio, estado: true, fechaModificacionArea: this.currentDate, usuarioModificacionArea: this.currentUser }).subscribe(
      () => {
        this.isLoading = false;
        this.showToast('Área activada correctamente', 'cerrar');
        this.get();
      },
      (error) =>{
        this.isLoading = false;
        this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast')

      }    );
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
