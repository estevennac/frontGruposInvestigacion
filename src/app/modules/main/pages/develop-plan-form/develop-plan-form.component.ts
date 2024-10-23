
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevelopmentPlanService } from 'src/app/core/http/develop-plan-form/develop-plan-form.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/core/auth/services/auth.service';


@Component({
  selector: 'app-development-plan-form',
  templateUrl: './develop-plan-form.component.html',
  styleUrls: ['./develop-plan-form.component.scss']
})
export class DevelopmentPlanFormComponent implements OnInit {

  savedMessage: string;
  developPlanForm: FormGroup;
  developPlanForms: any[] = [];
  

  constructor(
    private fb: FormBuilder,
    private developPlanService: DevelopmentPlanService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private router: Router 
  
    ) { }
    ngOnInit(): void {
      this.initializeForm();
    }
    
    private initializeForm():void {
    this.developPlanForm = this.fb.group({
      idPlanDesarrollo: [null, Validators.required],
      backgroundPlanDesarrollo: ['', Validators.required],
      lugar: ['', Validators.required],
      usuarioCreacionUsuario: ['', Validators.required],
      fechaCreacionUsuario: [''],
      usuarioModificacionUsuario: [''],
      fechaModificacionUsuario: ['']
    });
  }
  getAll() {
    this.developPlanService.getAll().subscribe((data) => {
      this.developPlanForms = data;
      console.log("datos:",data)
    });
  }

}




