import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LegalFramework } from 'src/app/types/legalFramework.types';
import { LegalFrameworkService } from 'src/app/core/http/legal-framework/legalFramework.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-framework-create',
  templateUrl: './legal-framework-create.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class LegalFrameworkCreateComponent implements OnInit {
  legalFrameworkForm: FormGroup;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private legalFrameworkService: LegalFrameworkService,
    private router: Router
  ) {}

  ngOnInit() {
    this.legalFrameworkForm = this.fb.group({
      nombre: ['', Validators.required],
      estado: [1, Validators.required],
    });
  }

  createLegal() {
    if (this.legalFrameworkForm.valid) {
      const legalData: LegalFramework = this.legalFrameworkForm.value;
      this.legalFrameworkService.createLegalFramework(legalData).subscribe(
        () => {
          console.log('Marco Legal creada correctamente');
          this.showSuccessMessage = true; 
          setTimeout(() => {
            this.router.navigateByUrl('main/legal');
          }, 2000); 
        },
        (error) => {
          console.error('Error al crear el marco legal', error);
        }
      );
    } else {
      this.showErrorMessage = true;
      Object.values(this.legalFrameworkForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  goBack() {
    window.history.back();
  }
}
