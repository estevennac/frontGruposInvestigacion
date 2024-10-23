import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChecklistService } from 'src/app/core/http/checklist/checklist.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { GlobalUserService } from 'src/app/core/http/user/global-user.service';
import { Usuario } from 'src/app/types/usuario.types';
import { CreationReqForm } from 'src/app/types/creationReq.types';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { InvGroupForm } from 'src/app/types/solCreaGI.types';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service';
import { ChecklistForm } from 'src/app/types/checklist.types';
@Component({
  selector: 'app-tu-componente',
  templateUrl: './checklist-reg.component.html',
  styleUrls: ['./checklist-reg.component.scss']
})
export class ChecklistFormComponent implements OnInit {

  savedMessage: string;
  checklistForm: FormGroup;
  checklistForms: any[] = [];
  creationReqForm:CreationReqForm;
  existCheck: boolean = false;
  data:boolean = false;
  checkListData:ChecklistForm
  constructor(
    private fb: FormBuilder,
    private checklistFormService: ChecklistService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private router: Router,
    private userService: GlobalUserService,
    private invGroupService: InvGroupService,
    private creationReqService: CreationReqService
  ) { }

  ngOnInit(): void {

    const currentUser = this.authService.getUserName();
    this.getUserByUsername(currentUser);
  
  
    const navigationState=history.state;
    this.creationReqForm=navigationState.creationReqForm
    this.verificacion();
  }

  verificacion(){
    if(this.creationReqForm.estado==='E'){
      
      console.log(this.creationReqForm.usuarioCreacionPeticion,"vakes")
      this.initializeFormDataGroup();
      this.existCheck = true;
    }else{
      //console.log(this.creationReqForm.usuarioCreacionPeticion,"nooo")
      this.data=true;

      this.initializeForm();
    }
    
  }
  initializeFormDataGroup(){
    
    this.checklistFormService.getByGroup(this.creationReqForm.idGrupoInv).subscribe(data=>{
      this.checkListData=data;
      this.checklistForm = this.fb.group({
        idGrupoInv: [data.idGrupoInv], 
        peticionMemorando: [data.peticionMemorando],
        formularioGrInv: [data.formularioGrInv],
        planDevGr: [data.planDevGr],
        planEconomico: [data.planEconomico],
        hojaVida: [data.hojaVida],
        certificado: [data.certificado],
        usuarioCreacionChecklist: [data.usuarioCreacionChecklist],
        fechaCreacionChecklist: [data.fechaCreacionChecklist],
        usuarioModificacionChecklist: [null],
        fechaModificacionChecklist: [null],
        fechaChecklist: [data.fechaChecklist],
        recibidoPor: [data.recibidoPor],
        enviadoPor: [data.enviadoPor]
      });
      this.data=true;

    })
  }
  getUserByUsername(username: string): void {
    this.userService.getUserByUserName(username).subscribe(
      (usuario: Usuario) => {
        console.log('Usuario obtenido:', usuario);
      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    );
  }

  private initializeForm(): void {
    this.checklistForm = this.fb.group({
      idGrupoInv: [1], 
      peticionMemorando: [false],
      formularioGrInv: [false],
      planDevGr: [false],
      planEconomico: [false],
      hojaVida: [false],
      certificado: [false],
      usuarioCreacionChecklist: [null],
      fechaCreacionChecklist: [null],
      usuarioModificacionChecklist: [null],
      fechaModificacionChecklist: [null],
      fechaChecklist: [null],
      recibidoPor: [null],
      enviadoPor: [null]
    });
  }

  getAll() {
    this.checklistFormService.getAll().subscribe((data) => {
      this.checklistForms = data;
      //console.log("datos:", data)
    });
  }


  createChecklistForm(): void {
    if (this.checklistForm.valid) {
      const requiredFields = ['peticionMemorando', 'formularioGrInv', 'planDevGr', 'planEconomico', 'hojaVida', 'certificado'];
      const allTrue = requiredFields.every(field => this.checklistForm.get(field).value === true);
      if (allTrue) {
        this.todosTrueFunction();
      } else {
        this.algunoFalseFunction();
      }
      
    } else {
      console.error('El formulario no es válido. Verifica los campos.');
      this.savedMessage = 'Verifica los campos del formulario';
    }
  }
  todosTrueFunction():void{
    const currentUser = this.authService.getUserName();
      const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
      const currentDateUpdate=new Date();
      const idGroup=this.creationReqForm.idGrupoInv;
      this.invGroupService.getById(idGroup).subscribe((data)=>{
        const grupoData:InvGroupForm={
          idGrupoInv:idGroup,
          idUser:data.idUser,
          nombreGrupoInv:data.nombreGrupoInv,
          estadoGrupoInv:"ValidaCheckCI",
          nombreOlGrupoInv:data.nombreOlGrupoInv,
          acronimoGrupoinv:data.acronimoGrupoinv,
          usuarioCreacionUsuario:data.usuarioCreacionUsuario,
          fechaCreacionUsuario:data.fechaCreacionUsuario,
          usuarioModificacionUsuario:currentUser,
          fechaModificacionUsuario:currentDateUpdate,
        }
        this.invGroupService.update(idGroup,grupoData).subscribe(
          ()=>{
          }
        );

      })
      this.creationReqService.getById(this.creationReqForm.idPeticionCreacion).subscribe((data)=>{
        const creationReq:CreationReqForm={
          idPeticionCreacion:this.creationReqForm.idPeticionCreacion,
           idGrupoInv:data.idGrupoInv,
           alineacionEstrategica:data.alineacionEstrategica,
            estado:"c", 
            usuarioCreacionPeticion:data.usuarioCreacionPeticion,
            fechaCreacionPeticion:data.fechaCreacionPeticion,
            usuarioModificacionPeticion:currentUser,
            fechaModificacionPeticion:currentDateUpdate
        }
        this.creationReqService.update(this.creationReqForm.idPeticionCreacion,creationReq).subscribe(
          ()=>{
          })

      })
      if(this.existCheck==true){
        this.checklistForm.get('usuarioModificacionChecklist').setValue(currentUser);
        this.checklistForm.get('fechaModificacionChecklist').setValue(currentDate);
        this.checklistForm.get('recibidoPor').setValue(currentUser);
        this.checklistForm.get('enviadoPor').setValue('Usuario2');
  
        const formData = this.checklistForm.value;
        console.log('Objeto del formulario antes de enviar:', formData);
  
        this.checklistFormService.update(this.checkListData.idChecklist,formData).subscribe(
          (response) => {
            console.log('Formulario enviado con éxito:', response);
            this.savedMessage = 'Formulario guardado con éxito';
            setTimeout(() => {
              this.savedMessage = null;
              this.router.navigate(['/main/principal']);
            }, 500);
          },
          (error) => {
            console.error('Error al enviar el formulario:', error);
            this.savedMessage = 'Error al guardar el formulario';
          }
        );
      }else{
        this.checklistForm.get('idGrupoInv').setValue(idGroup)
        this.checklistForm.get('usuarioCreacionChecklist').setValue(currentUser);
        this.checklistForm.get('fechaCreacionChecklist').setValue(currentDate);
       // this.checklistForm.get('usuarioModificacionChecklist').setValue(currentUser);
       // this.checklistForm.get('fechaModificacionChecklist').setValue(currentDate);
        this.checklistForm.get('fechaChecklist').setValue(currentDate);
        this.checklistForm.get('recibidoPor').setValue(currentUser);
        this.checklistForm.get('enviadoPor').setValue('Usuario2');
  
        const formData = this.checklistForm.value;
        console.log('Objeto del formulario antes de enviar:', formData);
  
        this.checklistFormService.createChecklistForm(formData).subscribe(
          (response) => {
            console.log('Formulario enviado con éxito:', response);
            this.savedMessage = 'Formulario guardado con éxito';
            setTimeout(() => {
              this.savedMessage = null;
              this.router.navigate(['/main/principal']);
            }, 500);
          },
          (error) => {
            console.error('Error al enviar el formulario:', error);
            this.savedMessage = 'Error al guardar el formulario';
          }
        );
      }
      
      
      
  }
  algunoFalseFunction():void{
    
    const currentUser = this.authService.getUserName();
      const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
      const currentDateUpdate=new Date();
      const idGroup=this.creationReqForm.idGrupoInv;
      this.invGroupService.getById(idGroup).subscribe((data)=>{
        const grupoData:InvGroupForm={
          idGrupoInv:idGroup,
          idUser:data.idUser,
          nombreGrupoInv:data.nombreGrupoInv,
          estadoGrupoInv:"ValidaCheckCI",
          nombreOlGrupoInv:data.nombreOlGrupoInv,
          acronimoGrupoinv:data.acronimoGrupoinv,
          usuarioCreacionUsuario:data.usuarioCreacionUsuario,
          fechaCreacionUsuario:data.fechaCreacionUsuario,
          usuarioModificacionUsuario:currentUser,
          fechaModificacionUsuario:currentDateUpdate,
        }
        this.invGroupService.update(idGroup,grupoData).subscribe(
          ()=>{
          }
        );

      })
      this.creationReqService.getById(this.creationReqForm.idPeticionCreacion).subscribe((data)=>{
        const creationReq:CreationReqForm={
          idPeticionCreacion:this.creationReqForm.idPeticionCreacion,
           idGrupoInv:data.idGrupoInv,
           alineacionEstrategica: data.alineacionEstrategica,

            estado:"F", 
            usuarioCreacionPeticion:data.usuarioCreacionPeticion,
            fechaCreacionPeticion:data.fechaCreacionPeticion,
            usuarioModificacionPeticion:currentUser,
            fechaModificacionPeticion:currentDateUpdate
        }
        this.creationReqService.update(this.creationReqForm.idPeticionCreacion,creationReq).subscribe(
          ()=>{
          })

      })
      
      
      if(this.existCheck==true){
        this.checklistForm.get('usuarioModificacionChecklist').setValue(currentUser);
        this.checklistForm.get('fechaModificacionChecklist').setValue(currentDate);
        this.checklistForm.get('recibidoPor').setValue(currentUser);
        this.checklistForm.get('enviadoPor').setValue('Usuario2');
  
        const formData = this.checklistForm.value;
        console.log('Objeto del formulario antes de enviar:', formData);
  
        this.checklistFormService.update(this.checkListData.idChecklist,formData).subscribe(
          (response) => {
            console.log('Formulario enviado con éxito:', response);
            this.savedMessage = 'Formulario guardado con éxito';
            setTimeout(() => {
              this.savedMessage = null;
              this.router.navigate(['/main/principal']);
            }, 500);
          },
          (error) => {
            console.error('Error al enviar el formulario:', error);
            this.savedMessage = 'Error al guardar el formulario';
          }
        );
      }else{
        this.checklistForm.get('idGrupoInv').setValue(idGroup)
        this.checklistForm.get('usuarioCreacionChecklist').setValue(currentUser);
        this.checklistForm.get('fechaCreacionChecklist').setValue(currentDate);
       // this.checklistForm.get('usuarioModificacionChecklist').setValue(currentUser);
       // this.checklistForm.get('fechaModificacionChecklist').setValue(currentDate);
        this.checklistForm.get('fechaChecklist').setValue(currentDate);
        this.checklistForm.get('recibidoPor').setValue(currentUser);
        this.checklistForm.get('enviadoPor').setValue('Usuario2');
  
        const formData = this.checklistForm.value;
        console.log('Objeto del formulario antes de enviar:', formData);
  
        this.checklistFormService.createChecklistForm(formData).subscribe(
          (response) => {
            console.log('Formulario enviado con éxito:', response);
            this.savedMessage = 'Formulario guardado con éxito';
            setTimeout(() => {
              this.savedMessage = null;
              this.router.navigate(['/main/principal']);
            }, 500);
          },
          (error) => {
            console.error('Error al enviar el formulario:', error);
            this.savedMessage = 'Error al guardar el formulario';
          }
        );
      }
  }
}
