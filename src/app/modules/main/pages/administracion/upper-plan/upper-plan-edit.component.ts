import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpperLevelPlan } from 'src/app/types/upperLevelPlan.types';
import { UpperLevelPlanService } from 'src/app/core/http/upperLevel-plan/upper-level-plan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upper-plan-edit',
  templateUrl: './upper-plan-edit.component.html',
  styleUrls: ['../modulos.component.scss'],})
export class UpperPlanEditComponent implements OnInit {
  upperLevelPlan: UpperLevelPlan;
  upperlevelPlanForm: FormGroup;
  showSuccessMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private upperLevelPlanService: UpperLevelPlanService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.upperLevelPlan = history.state.upperLevelPlan;
    if (!this.upperLevelPlan) {
      console.error('No se encontraron detalles del dominio académico');
    }
    this.upperlevelPlanForm = this.fb.group({
      nombre: [this.upperLevelPlan.nombre, Validators.required]
    });

    
  }

  updatePlan() {
    const upperData: UpperLevelPlan = this.upperlevelPlanForm.value;
    this.upperLevelPlanService.update(this.upperLevelPlan.idPlanNivelSuperior, upperData).subscribe(
      () => {
        setTimeout(() => {
          this.router.navigateByUrl('main/upper-plan');
        }, 2000); 
      },
      (error) => {
        console.error('Error al actualizar la línea', error);
      }
    );
  }
  goBack() {
    this.router.navigateByUrl('main/upper-plan');  }
}
