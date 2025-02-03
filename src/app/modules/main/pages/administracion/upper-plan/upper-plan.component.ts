import { Component, OnInit, ViewChild } from '@angular/core';
import { UpperLevelPlan } from 'src/app/types/upperLevelPlan.types';
import { UpperLevelPlanService } from 'src/app/core/http/upperLevel-plan/upper-level-plan.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/core/auth/services/auth.service';

import { ModalUpperPlanControl } from './modal-upper-plan.component';

@Component({
  selector: 'app-upper-plan-list',
  templateUrl: './upper-plan.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class UpperPlanComponent implements OnInit {
  upperLevelPlan: UpperLevelPlan[] = [];
  displayedColumns: string[] = ['nombre', 'estado', 'acciones'];
    dataSource = new MatTableDataSource<UpperLevelPlan>();
  isLoading: boolean = true;
  searchControl = new FormControl();
  currentUser: string;
  currentDate: Date = new Date();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private upperLevelPlanService: UpperLevelPlanService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.getPlan();
    this.currentUser = this.authService.getUserName();
  
    this.searchControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value.trim().toLowerCase();
    });
  
    this.dataSource.filterPredicate = (data: UpperLevelPlan, filter: string) => 
      data.nombre.toLowerCase().includes(filter);
  }
  

  getPlan() {
    this.upperLevelPlanService.getAll().subscribe((data) => {
      this.upperLevelPlan = data;
      this.dataSource.data = this.upperLevelPlan; // Asigna los datos correctamente
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.showToast('Error al cargar los planes', 'cerrar', 'error-toast');
    });
  }
  

  openDialog(upperLevelPlan?: UpperLevelPlan): void {
    const dialogRef = this.dialog.open(ModalUpperPlanControl, {
      width: '50%',
      height: '70%',
      data: { upperLevelPlan }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getPlan();
      }
    });
  }

  editPlan(id: number) {
    this.isLoading = true;

    this.upperLevelPlanService.getById(id).subscribe(
      (upperLevelPlan: UpperLevelPlan) => {
        this.isLoading = false;
        this.openDialog(upperLevelPlan); // Abrir modal con datos para editar
       },
      (error) => {
        this.showToast('Error al obtener los detalles del plan', 'cerrar', 'error-toast');
      }
    );
  }

  deletePlan(id: number) {
    this.isLoading = true;
    this.upperLevelPlanService.update(id, { estado: false,fechaModificacion: this.currentDate, usuarioModificacion: this.currentUser }).subscribe(
      () => {
        this.showToast('Plan eliminado correctamente', 'cerrar');
        this.getPlan();
        this.isLoading = false;

      },
      (error) => {
        this.showToast('Error al eliminar el plan', 'cerrar', 'error-toast');
        this.isLoading = false;

      }
    );
  }

  activatePlan(id: number) {
    this.isLoading = true;

    this.upperLevelPlanService.update(id, { estado: true,fechaModificacion: this.currentDate, usuarioModificacion: this.currentUser }).subscribe(
      () => {
        this.showToast('Plan activado correctamente', 'cerrar');
        this.getPlan();
        this.isLoading = false;

      },
      (error) => {
        this.isLoading = false;
        this.showToast('Error al activar el plan', 'cerrar', 'error-toast');
      }
    );
  }

  showToast(message: string, action: string, panelClass: string = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: panelClass,
    });
  }

  goBack() {
    this.router.navigate(['/main/admin']);
  }
}
