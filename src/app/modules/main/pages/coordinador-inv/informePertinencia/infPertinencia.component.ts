import { NgOptimizedImage } from "@angular/common";
import { Component, OnInit, Injectable } from '@angular/core';
import { Form, FormGroup, Validators,FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { RelevanceReportService } from "src/app/core/http/relevance-report/relevance-report.service";
import { DatePipe } from "@angular/common";
import { RelevanceReport } from "src/app/types/relevancereport.types";
import { error } from "console";
import { NgModel } from "@angular/forms";

@Component({
    selector: 'vex-creation-form',
    templateUrl: './infPertinencia.component.html',
    styleUrls: ['./creation-form.component.scss'],
  })
  @Injectable({
    providedIn: 'root'
  })
  export class InfPertinenciaComponent implements OnInit {
    idGroup: number;
    isLinear = true;
    myForm: FormGroup;
    currentUser: string;
    currentDate: any;

    constructor(
      private fb: FormBuilder,
      private router: Router,
      private snackBar: MatSnackBar,
      private authService: AuthService,
      private route: ActivatedRoute,
      private relevaceReportService: RelevanceReportService,
      private datePipe: DatePipe,
    ){
      this.myForm = this.fb.group({
        form1: this.fb.group({
          numeroMemo: ['',Validators.required],
          formularioCreacion: [1, Validators.required],
          planDesarrollo: [1,Validators.required],
          documentosAdicionales:[1,Validators,require],
        }),
        form2: this.fb.group({
          objetivos: ['',Validators.required]
        }),
        form3: this.fb.group({
          planEstrategico: [1,Validators.required],
          pertenenciaAcademicaAporte: [1, Validators.required],
          coordinador: [1,Validators.required],
          miembros: [1,Validators.required],
          objetivosPlanDesarrollo: [1,Validators.required]
        }),
        form4: this.fb.group({
          conclusiones: [1,Validators.required],
          recomendaciones: [1,Validators.required]
        }) 
      })

    }

    ngOnInit() {
      this.idGroup = Number(sessionStorage.getItem("invGroup"));
      this.currentUser = this.authService.getUserName();
      this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
    }

    get form1(){
      return this.myForm.get('form1') as FormGroup;
    }
    get form2(){
      return this.myForm.get('fomr2') as FormGroup;
    }
    get form3(){
      return this.myForm.get('form3') as FormGroup;
    }
    get form4(){
      return this.myForm.get('form4') as FormGroup;
    }

    guardarReporte(){
      const relevanceReport: RelevanceReport = {
        idInformePertinencia: 0,
        idGrupo: this.idGroup,
        numeroMemo: this.myForm.value.form1.numeroMemo,
        formularioCreacion: this.myForm.value.form1.formularioCreacion,
        planDesarrollo: this.myForm.value.form1.planDesarrollo,
        documentosAdicionales: this.myForm.value.form1.documentosAdicionales,
        objetivos: this.myForm.value.fomr2.objectivos,
        planEstrategico: this.myForm.value.form3.planEstrategico,
        pertinenciaAcademicaAporte: this.myForm.value.pertenenciaAcademicaAporte,
        coordinador: this.myForm.value.coordinador,
        miembros: this.myForm.value.miembros,
        objetivosPlanDesarrollo: this.myForm.value.objetivosPlanDesarrollo,
        conclusiones: this.myForm.value.conclusiones,
        recomendaciones: this.myForm.value.recomendaciones,
        usuarioCreacion: this.currentUser,
        fechaCreacion: this.currentDate,
        usuarioModificacion: undefined,
        fechaModificacion: undefined
      }
      this.relevaceReportService.createRelevanceReport(relevanceReport).subscribe(
        (response) => {
          setTimeout(() => {
            this.router.navigateByUrl('main/crea');
          }, 8000);
          console.log('Reporte de relevancia creado:',response);
        },
        (error) => {
          console.error('Error al crear el plan de desarrollo:', error); // Manejo de errores
        }
      )
    }

    HandleSubmit(){
      if(this.myForm.valid){
        this.guardarReporte();

        this.snackBar.open('Solicitudes enviadas correctamente.', 'Cerrar', {
          duration: 3000,
        });
      } else {
        this.snackBar.open('Por favor, complete todos los campos requeridos.', 'Cerrar', {
          duration: 3000,
        });
      }
    }


  }