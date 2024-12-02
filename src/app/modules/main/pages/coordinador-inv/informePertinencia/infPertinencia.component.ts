import { NgOptimizedImage } from "@angular/common";
import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { RelevanceReportService } from "src/app/core/http/relevance-report/relevance-report.service";
import { DatePipe } from "@angular/common";
import { RelevanceReport } from "src/app/types/relevancereport.types";
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service';
import { CreationReqForm } from 'src/app/types/creationReq.types';
@Component({
  selector: 'vex-creation-form',
  templateUrl: './infPertinencia.component.html',
  styleUrls: ['./creation-form.component.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class InfPertinenciaComponent implements OnInit {
  loading: boolean = true;
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
    private invGroupService: InvGroupService,
    private creationReqService: CreationReqService,
  ) {
         
  }

  ngOnInit() {
    this.iniciarForm();
    this.idGroup = Number(sessionStorage.getItem("idGrupoSol"));
    this.currentUser = this.authService.getUserName();
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  }

  iniciarForm(){
    this.myForm = this.fb.group({
      form1: this.fb.group({
        numeroMemo: ['', Validators.required],
        formularioCreacion: [true, Validators.requiredTrue],
        planDesarrollo: [true, Validators.requiredTrue],
        documentosAdicionales: [true, Validators.requiredTrue],
      }),
      form2: this.fb.group({
        objetivos: ['', Validators.required],
      }),
      form3: this.fb.group({
        planEstrategico: [true, Validators.requiredTrue],
        pertenenciaAcademicaAporte: [false, Validators.requiredTrue],
        coordinador: [false, Validators.requiredTrue],
        miembros: [false, Validators.requiredTrue],
        objetivosPlanDesarrollo: [false, Validators.requiredTrue],
      }),
      form4: this.fb.group({
        conclusiones: ['', Validators.required],
        recomendaciones: ['', Validators.required],
      }),
    });
    this.loading=false;
  }
  get form1() {
    return this.myForm.get('form1') as FormGroup;
  }

  get form2() {
    return this.myForm.get('form2') as FormGroup;
  }

  get form3() {
    return this.myForm.get('form3') as FormGroup;
  }

  get form4() {
    return this.myForm.get('form4') as FormGroup;
  }

  guardarReporte() {
    const relevanceReport: RelevanceReport = {
        idInformePertinencia: 0,
        idGrupo: this.idGroup,
        numeroMemo: this.myForm.value.form1.numeroMemo,
        formularioCreacion: this.myForm.value.form1.formularioCreacion ? 1 : 0,
        planDesarrollo: this.myForm.value.form1.planDesarrollo ? 1 : 0,
        documentosAdicionales: this.myForm.value.form1.documentosAdicionales ? 1 : 0,
        objetivos: this.myForm.value.form2.objetivos,
        planEstrategico: this.myForm.value.form3.planEstrategico ? 1 : 0,
        pertinenciaAcademicaAporte: this.myForm.value.form3.pertenenciaAcademicaAporte ? 1 : 0,
        coordinador: this.myForm.value.form3.coordinador ? 1 : 0,
        miembros: this.myForm.value.form3.miembros ? 1 : 0,
        objetivosPlanDesarrollo: this.myForm.value.form3.objetivosPlanDesarrollo ? 1 : 0,
        conclusiones: this.myForm.value.form4.conclusiones,
        recomendaciones: this.myForm.value.form4.recomendaciones,
        usuarioCreacion: this.currentUser,
        fechaCreacion: this.currentDate,
        usuarioModificacion: undefined,
        fechaModificacion: undefined
    };

    this.actualizarEstados();
    console.log(relevanceReport);
    this.relevaceReportService.createRelevanceReport(relevanceReport).subscribe(
        (response) => {
            setTimeout(() => {
                this.router.navigateByUrl('main/solicitudes');
            }, 8000);
            console.log('Reporte de relevancia creado:', response);
        },
        (error) => {
            console.error('Error al crear el plan de desarrollo:', error); // Manejo de errores
        }
    );
}
  actualizarEstados(){
    this.creationReqService.getByGroup(this.idGroup).subscribe(data=>{
      const creationReq:CreationReqForm={
         idPeticionCreacion:data.idPeticionCreacion,
         idGrupoInv:data.idGrupoInv,
         alineacionEstrategica: data.alineacionEstrategica,
          estado:"6", 
          usuarioCreacionPeticion:data.usuarioCreacionPeticion,
          fechaCreacionPeticion:data.fechaCreacionPeticion,
          usuarioModificacionPeticion:this.currentUser,
          fechaModificacionPeticion:this.currentDate
      }
      this.creationReqService.update(data.idPeticionCreacion,creationReq).subscribe(
        (response)=>{console.log("Enviado" + response)
        });
    })
    this.invGroupService.getById(this.idGroup).subscribe(data=>{
      const invGroup:InvGroupForm={
        idGrupoInv:this.idGroup,
        idCoordinador:data.idCoordinador,
        nombreGrupoInv:data.nombreGrupoInv,
        estadoGrupoInv:"resolucion",
        acronimoGrupoinv:data.acronimoGrupoinv,
        usuarioCreacion:data.usuarioCreacion,
        fechaCreacion:data.fechaCreacion,
        usuarioModificacion:this.currentUser,
        fechaModificacion:this.currentDate

      }
      this.invGroupService.update(this.idGroup,invGroup).subscribe(
        (response)=>{console.log("Enviado grupo" + response)
        });
    })
  }


  HandleSubmit() {
    if (this.myForm.valid) {
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
