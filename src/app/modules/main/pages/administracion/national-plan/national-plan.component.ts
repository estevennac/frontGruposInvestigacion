import { Component, OnInit, ViewChild } from '@angular/core';
import { NationalPlan } from 'src/app/types/nationalPlan.types';
import { NationalPlanService } from 'src/app/core/http/national-plan/national-plan.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ModalNationalControl } from './modal-national-plan.component';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-national-plan-list',
  templateUrl: './national-plan.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class NationalPlanComponent implements OnInit {
  nationalPlan: NationalPlan[] = [];
  displayedColumns: string[] = [ 'numeroPolitica', 'descripcion', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<NationalPlan>();
  isLoading: boolean = true;
  searchControl = new FormControl();
  currentDate: Date = new Date();
  currentUser:string;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private nationalPlanService: NationalPlanService,
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
    this.dataSource.filterPredicate = (data: NationalPlan, filter: string) => 
      data.descripcion.toLowerCase().includes(filter);
  }

  getPlan() {
    this.nationalPlanService.getAll().subscribe(
      (data) => {
        this.dataSource=new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: NationalPlan, filter: string) =>
          data.descripcion.toLowerCase().includes(filter);
        
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Error al cargar los planes', 'cerrar', 'error-toast');
      }
    );
  }

  openDialog(nationalPlan?: NationalPlan): void {
    const dialogRef = this.dialog.open(ModalNationalControl, {
      width: '50%',
      height: '70%',
      data: { nationalPlan }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getPlan();
      }
    });
  }

  editPlan(id: number) {
    this.isLoading = true;
    this.nationalPlanService.getById(id).subscribe(
      (nationalPlan: NationalPlan) => {
        this.isLoading = false;
        this.openDialog(nationalPlan);
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Error al obtener los detalles del plan', 'cerrar', 'error-toast');
      }
    );
  }

  deletePlan(id: number) {
    this.isLoading = true;
    this.nationalPlanService.update(id, { estado: false,fechaModificacion: this.currentDate, usuarioModificacion: this.currentUser }).subscribe(
      () => {
        this.isLoading = false;
        this.showToast('Plan eliminado correctamente', 'cerrar');
        this.getPlan();
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Error al eliminar el plan', 'cerrar', 'error-toast');
      }
    );
  }

  activatePlan(id: number) {
    this.isLoading = true;
    this.nationalPlanService.update(id, { estado: true,fechaModificacion: this.currentDate, usuarioModificacion: this.currentUser }).subscribe(
      () => {
        this.isLoading = false;
        this.showToast('Plan activado correctamente', 'cerrar');
        this.getPlan();
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
