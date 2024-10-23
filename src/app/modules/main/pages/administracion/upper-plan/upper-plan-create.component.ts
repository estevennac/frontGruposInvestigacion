import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpperLevelPlanService } from 'src/app/core/http/upperLevel-plan/upper-level-plan.service';
import { UpperLevelPlan } from 'src/app/types/upperLevelPlan.types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upper-plan-create',
  templateUrl: './upper-plan-create.component.html',
  styleUrls: ['../modulos.component.scss'],})
export class UpperPlanCreateComponent implements OnInit {
  upperPlanForm: FormGroup;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private upperPlanService: UpperLevelPlanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.upperPlanForm = this.fb.group({
      nombre: ['', Validators.required],
      estado: [1, Validators.required],
    });
  }

  createUpperLevelPlan() {
    if (this.upperPlanForm.valid) {
      const upperData: UpperLevelPlan = this.upperPlanForm.value;
      this.upperPlanService.createUpperLevelPlanForm(upperData).subscribe(
        () => {
          console.log('Plan de nivel Superior creado correctamente');
          this.showSuccessMessage = true; 
          setTimeout(() => {
            this.router.navigateByUrl('main/upper-plan');
          }, 2000); 
        },
        (error) => {
          console.error('Error al crear un plan de Nivel Superior', error);
        }
      );
    } else {
      this.showErrorMessage = true;
      Object.values(this.upperPlanForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  goBack() {
    this.router.navigateByUrl('main/upper-plan');
  }
}
