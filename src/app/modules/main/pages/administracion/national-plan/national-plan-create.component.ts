import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NationalPlan } from 'src/app/types/nationalPlan.types';
import { NationalPlanService } from 'src/app/core/http/national-plan/national-plan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-national-plan-create',
  templateUrl: './national-plan-create.component.html',
  styleUrls: ['../modulos.component.scss'],})
export class NationalPlanCreateComponent implements OnInit {
  nationalPlanForm: FormGroup;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private nationalPlanService: NationalPlanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.nationalPlanForm = this.fb.group({
      numeroPolitica: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: [1, Validators.required],
    });
  }

  createPlan() {
    if (this.nationalPlanForm.valid) {
      const nationalPlanData: NationalPlan = this.nationalPlanForm.value;
      this.nationalPlanService.createNationalPlanForm(nationalPlanData).subscribe(
        () => {
          //console.log('Linea creada correctamente');
          this.showSuccessMessage = true; // Mostrar el mensaje de éxito
          setTimeout(() => {
            this.router.navigateByUrl('main/national-plan');
          }, 2000); 
        },
        (error) => {
          console.error('Error al crear el Plan Nacional', error);
        }
      );
    } else {
      this.showErrorMessage = true;
      Object.values(this.nationalPlanForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  goBack() {
    this.router.navigateByUrl('main/national-plan');
  }
}
