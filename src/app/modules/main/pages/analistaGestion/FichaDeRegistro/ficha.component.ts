import { DatePipe } from '@angular/common';
import { Component, OnInit,Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';
//import { SolCreaGiService } from 'src/app/core/http/sol-crea-gi/sol-crea-gi.service';
import { LinkService } from 'src/app/core/http/link/link.service';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { Link } from 'src/app/types/link.types';
import { Usuario } from 'src/app/types/usuario.types';
import { MatDialog } from '@angular/material/dialog';
import { InvMemberService } from 'src/app/core/http/inv-member/inv-member.service';
import { CreationReqForm } from 'src/app/types/creationReq.types';
import { Avances } from './registroAvances.component';
import { ProgressAchievService } from 'src/app/core/http/progress-achiev/progress-achiev.service';
import { GroupRegForm } from 'src/app/types/groupRegForms';
import { GroupRegFormService } from 'src/app/core/http/group-reg-form/group-reg-form.service';
import { ProgressAchiev } from 'src/app/types/progressAchiev.types';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { CreateContextOptions } from 'vm';
@Component({
  selector: 'vex-ficha-form',
  templateUrl: './ficha.component.html',
  styleUrls: ['./ficha.component.scss']
})
export class FichaFormComponent implements OnInit {
 selectedAvances:any[]=[];
    savedMessage: string;
  ficha: FormGroup;
  grupos: any;
  coordinadores: any;
  investigadores: any[];
  linkForms: any[] = [];
  isLinear = false;
  coordinadorNombre: string = '';
  user: any;
  miembros: any[] = [];
  members: any[];
  loadingData: boolean = true;
  creationReqForm: CreationReqForm;
    avances:any[] = [];
  constructor(
    private fb: FormBuilder,
    private linkService: LinkService,
    private invGroupService: InvGroupService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private router: Router,
    private dialog: MatDialog,
    private invMemberService: InvMemberService,
    private groupRegService:GroupRegFormService,
    private progressService:ProgressAchievService,
    private creationService:CreationReqService
  ) {this.avances=[]; }

  ngOnInit(): void {
    this.loadData();
    const currentUser = this.authService.getUserName();
    const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
    const groupId = sessionStorage.getItem("invGroup");
    // Initialize myForm with default values
    this.ficha = this.fb.group({
      ficha1: this.fb.group({}),
      ficha2: this.fb.group({
        idGrupoInv: [groupId],
        resolucion: [1],
        creacionFormCheck: [false],
        planDesarrolloCheck: [false],
        sumarioCheck: [false],
        certificadoCategoriaCheck: [false],
        curriculum: [false],
        minimoProfesoresCheck: [false],
        meritosCientificosCheck: [false],
        estado: ['e'],
        usuarioCreacionFormReg: [currentUser],
        fechaCreacionFormReg: [currentDate]
      }),
      ficha3:this.fb.group({

      })
    });
  }
  openDialog():void{
    const dialogRef=this.dialog.open(Avances,{
        width:'50%',
        height:'80%',
        data:{ avances: this.avances }
    });
    dialogRef.afterClosed().subscribe((data:{avances:any})=>{
      if (data.avances) {
        console.log(data.avances);
        const { fechaLogro, logro, descripcion } = data.avances;
        const fechaLogroTratada =fechaLogro.toISOString(); // Convertir a objeto de fecha, por ejemplo

        // Volver a cargar los datos tratados al arreglo
        this.selectedAvances.push({
            fechaLogro: fechaLogroTratada,
            logro: logro,
            descripcion: descripcion
        });

        console.log(this.selectedAvances);
        // También puedes hacer el push directamente usando la desestructuración
        // this.selectedAvances.push({ fechaLogro, logro, descripcion });
    }
    })
  }

  loadData(): void {
    this.loadingData = true;
    const navigationState = history.state;
    if (navigationState && navigationState.creationReqForm) {
      this.creationReqForm = navigationState.creationReqForm;
      this.invGroupService.getById(this.creationReqForm.idGrupoInv).subscribe((data) => {
        this.grupos = data;
        this.usuarioService.getById(data.idCoordinador).subscribe((userData) => {
          this.coordinadores = userData;
        });

        this.invMemberService.getByGroup(data.idGrupoInv).subscribe((membersData) => {
          this.members = membersData;
          this.loadMembers();
        });
      });
      
    } else {
      this.loadingData = false;
    }
  }

  loadMembers() {
    this.miembros = [];
    this.members.forEach((m) => {
      this.usuarioService.getById(m.idUsuario).subscribe((userData) => {
        this.miembros.push(userData);
        this.loadingData = false;
      });
    });
  }

  createFicha() {
    if (this.ficha.valid) {
      const formData = this.ficha.value.ficha2;
        this.groupRegService.createGroupRegForm(formData).subscribe((response)=>{
            this.createAvances(response);
            console.log("formulario a enviar", response);
        
        })
        const currentUser = this.authService.getUserName();
        const currentDateUpdate=new Date();
        const dataReq:any={
          idPeticionCreacion:this.creationReqForm.idPeticionCreacion,
          idGrupoInv:this.creationReqForm.idGrupoInv,
          estado:'Z',
          usuarioModificacionPeticion:currentUser,
          fechaModificacionPeticion:currentDateUpdate
        }
        const dataGroup:any={
          idGrupoInv:this.grupos.idGrupoInv,
          idUser:this.grupos.idUser,
          estadoGrupoInv:'Activo'
        }
        this.creationService.update(this.creationReqForm.idPeticionCreacion,dataReq).subscribe(
          response=>{
            console.log("grupo creado",response)
          }

          
        )
        this.invGroupService.update(this.creationReqForm.idGrupoInv,dataGroup).subscribe(response=>{
          console.log("grupo actualizado",response)
        })
  

    } else {
      console.error('El formulario no es válido. Verifica los campos.');
      this.savedMessage = 'Verifica los campos del formulario';
  
      // Marcar los controles del formulario como tocados para mostrar los errores
      Object.values(this.ficha.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    setTimeout(() => {
      this.router.navigateByUrl('main/solicitudesA');
    }, 1000); 
  }
  
createAvances(idFicha:number){
    const currentUser = this.authService.getUserName();
    const currentDate = new Date();
    if (this.selectedAvances && this.selectedAvances.length > 0) {
        this.selectedAvances.forEach((avances: any) => { // Supongamos que avances es un objeto.
          if (avances.fechaLogro) { // Verifica si fechaLogro está definido
            const progressAchievment: ProgressAchiev = {
              idLogro: null,
              idFormRegGrupo: idFicha, // Suponiendo que idFicha está definido en tu contexto.
              fechaLogro: avances.fechaLogro instanceof Date ? avances.fechaLogro.toISOString() : new Date(avances.fechaLogro).toISOString(),
              logro: avances.logro,
              descripcion: avances.descripcion,
              usuarioCreacionLogro: currentUser,
              fechaCreacion: currentDate,
              usuarioModificacion: null,
              fechaModificacion: null
            };
            console.log(progressAchievment); // Comprueba si el objeto se está construyendo correctamente.
      
            this.progressService.createProgressAchievForm(progressAchievment).subscribe((response: any) => {
              console.log(response); // Muestra la respuesta del servicio.
            });
          } else {
            console.error('fechaLogro está indefinida en uno de los elementos de selectedAvances');
          }
        });
      }
     
      
}
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', file);
    }
  }


  get ficha1() {
    return this.ficha.get('ficha1') as FormGroup;
  }

  get ficha2() {
    return this.ficha.get('ficha2') as FormGroup;
  }
  
  get ficha3() {
    return this.ficha.get('ficha3') as FormGroup;
  }

}
