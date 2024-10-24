import { Component, OnInit } from '@angular/core';
import { UpperLevelPlan } from 'src/app/types/upperLevelPlan.types';
import { UpperLevelPlanService } from 'src/app/core/http/upperLevel-plan/upper-level-plan.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalUpperPlanControl } from './modal-upper-plan.component';

@Component({
  selector: 'app-upper-plan-list',
  templateUrl: './upper-plan.component.html',
  styleUrls: ['../modulos.component.scss'],})
export class UpperPlanComponent implements OnInit {
  upperLevelPlan: UpperLevelPlan[] = [];

  constructor(
    private router: Router, 
    private upperLevelPlanService: UpperLevelPlanService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getPlan();
  }

  getPlan() {
    this.upperLevelPlanService.getAll().subscribe((data) => {
      // Filtrar y asignar solo los dominios académicos con estado activo (estado == true)
      this.upperLevelPlan = data;
      console.log("datos:", this.upperLevelPlan);
    });
  }

  openDialog(upperLevelPlan?: UpperLevelPlan): void {
    const dialogRef = this.dialog.open(ModalUpperPlanControl, {
      width: '50%',
      height: '70%',
      data: { upperLevelPlan } // Pasar los datos de la línea si existe (para edición)
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getPlan(); // Actualizar la tabla si se creó o editó algo
      }
    });
  }
  
  editPlan(id: number) {
    this.upperLevelPlanService.getById(id).subscribe(
      (upperLevelPlan: UpperLevelPlan) => {
        this.router.navigate(['/main/upper-plan/edit'], { state: { upperLevelPlan } });
      },
      (error) => {
        console.error('Error al obtener los detalles del dominio académico', error);
      }
    );
  }

  deletePlan(id: number) {
    this.upperLevelPlanService.update(id, { estado: false }).subscribe(
      () => {
        console.log(`Dominio académico con ID ${id} eliminado correctamente`);
        this.getPlan();
      },
      (error) => {
        console.error('Error al eliminar el dominio académico', error);
      }
    );
  }
  activatePlan(id: number) {
    this.upperLevelPlanService.update(id, { estado: true }).subscribe(
      () => {
        console.log(`Dominio académico con ID ${id} eliminado correctamente`);
        this.getPlan();
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
