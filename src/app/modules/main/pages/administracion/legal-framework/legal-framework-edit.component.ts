import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LegalFramework } from 'src/app/types/legalFramework.types';
import { LegalFrameworkService } from 'src/app/core/http/legal-framework/legalFramework.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-framework-edit',
  templateUrl: './legal-framework-edit.component.html',
  styleUrls: ['../modulos.component.scss'],})
export class LegalFrameworkEditComponent implements OnInit {
  legalFramework: LegalFramework;
  legalFrameworkForm: FormGroup;
  showSuccessMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private legalFrameworkService: LegalFrameworkService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.legalFramework = history.state.legalFramework;
    if (!this.legalFramework) {
      console.error('No se encontraron detalles');
    }
    this.legalFrameworkForm = this.fb.group({
      nombre: [this.legalFramework.nombre, Validators.required]
    });
  }

  updateLegal() {
    const legalData: LegalFramework = this.legalFrameworkForm.value;
    this.legalFrameworkService.update(this.legalFramework.idMarcoLegal, legalData).subscribe(
      () => {
        console.log('Marco Legal actualizada correctamente', legalData);
        setTimeout(() => {
          this.router.navigateByUrl('main/legal');
        }, 2000); 
      },
      (error) => {
        console.error('Error al actualizar', error);
      }
    );
  }
  goBack() {
    this.router.navigateByUrl('main/legal');

  }
}
