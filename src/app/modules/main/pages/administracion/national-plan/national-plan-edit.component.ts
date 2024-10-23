import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NationalPlan } from 'src/app/types/nationalPlan.types';
import { NationalPlanService } from 'src/app/core/http/national-plan/national-plan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-national-plan-edit',
  templateUrl: './national-plan-edit.component.html',
  styleUrls: ['../modulos.component.scss'],})
export class NationalPlanEditComponent implements OnInit {
  nationalPlan: NationalPlan;
  nationalPlanForm: FormGroup;
  showSuccessMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private nationalPlanService: NationalPlanService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.nationalPlan = history.state.nationalPlan;
    if (!this.nationalPlan) {
      console.error('No se encontraron detalles del plan nacional');
    }
    this.nationalPlanForm = this.fb.group({
      numeroPolitica: [this.nationalPlan.numeroPolitica, Validators.required],
      descripcion: [this.nationalPlan.descripcion, Validators.required],
    });
  }

  updatePlan() {
    const nationalPlanData: NationalPlan = this.nationalPlanForm.value;
    this.nationalPlanService.update(this.nationalPlan.idPlanNacional, nationalPlanData).subscribe(
      () => {
        console.log('Plan Nacional actualizada correctamente', nationalPlanData);
        setTimeout(() => {
          this.router.navigateByUrl('main/national-plan');
        }, 2000); 
      },
      (error) => {
        console.error('Error al actualizar el Plan Nacional', error);
      }
    );
  }
  goBack() {
    this.router.navigateByUrl('main/national-plan');
  }
}
