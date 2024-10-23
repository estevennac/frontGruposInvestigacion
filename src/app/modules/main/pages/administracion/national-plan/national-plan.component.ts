import { Component, OnInit } from '@angular/core';
import { NationalPlan } from 'src/app/types/nationalPlan.types';
import { NationalPlanService } from 'src/app/core/http/national-plan/national-plan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-national-plan-list',
  templateUrl: './national-plan.component.html',
  styleUrls: ['../modulos.component.scss'],})
export class NationalPlanComponent implements OnInit {
   nationalPlan: NationalPlan[] = [];

  constructor(private router: Router, private nationalPlanService: NationalPlanService) {}

  ngOnInit() {
    this.getPlan();
  }

  getPlan() {
    this.nationalPlanService.getAll().subscribe((data) => {
      this.nationalPlan = data;
      //console.log("datos:", this.nationalPlan);
    });
  }

  createPlan() {
    this.router.navigate(['main/national-plan/create']);
  }
  
  editPlan(id: number) {
    this.nationalPlanService.getById(id).subscribe(
      (nationalPlan: NationalPlan) => {
        this.router.navigate(['/main/national-plan/edit'], { state: { nationalPlan } });
      },
      (error) => {
        console.error('Error al obtener los detalles del plan Nacional', error);
      }
    );
  }

  deletePlan(id: number) {
    this.nationalPlanService.update(id, { estado: false }).subscribe(
      () => {
        console.log(`Plan Nacional con ID ${id} eliminado correctamente`);
        this.getPlan();
      },
      (error) => {
        console.error('Error al eliminar el plan Nacional', error);
      }
    );
  }
  activatePlan(id: number) {
    this.nationalPlanService.update(id, { estado: true }).subscribe(
      () => {
        console.log(`Plan Nacional con ID ${id} eliminado correctamente`);
        this.getPlan();
      },
      (error) => {
        console.error('Error al eliminar el plan Nacional', error);
      }
    );
  }
  goBack() {
    this.router.navigate(['/main/admin'])
  }
}
