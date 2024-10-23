import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { InvMemberService } from 'src/app/core/http/inv-member/inv-member.service';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { CreationReqForm } from 'src/app/types/creationReq.types';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { InvMemberForm } from 'src/app/types/invMember.types';
import { Usuario } from 'src/app/types/usuario.types';
import { AcadCreaService } from 'src/app/core/http/acad-crea/acad-crea.service';
import { LineCreaService } from 'src/app/core/http/line-crea/line-crea.service';
import { Line } from 'src/app/types/line.types';
import { LineCreaCompleto } from 'src/app/types/lineCrea.types';
import { AcadCreaCompleto } from 'src/app/types/acadCrea.types';
import { CreaAreaCompleto } from 'src/app/types/creaArea.types';
import { CreaAreaService } from 'src/app/core/http/crea-area/crea-area.service';
import { DevelopmentPlanService } from 'src/app/core/http/develop-plan-form/develop-plan-form.service';
import { DevelopmentPlanForms } from 'src/app/types/developPlanForm';
@Component({
  selector: 'app-solicitud-componente',
  templateUrl: './mostrarSolicitud.component.html',
  styleUrls: ['./obtenerSolicitudes.component.scss']
})
export class MostrarSolicitudForAnalista implements OnInit {

  id: number;
  creationReqForm: CreationReqForm;
  invGroup:InvGroupForm;
  usuario:Usuario;
  planDesarrollo:DevelopmentPlanForms
  memberUser:Usuario[]=[];
  member:InvMemberForm[];
  lineCrea:LineCreaCompleto;
  line:Line;
  acadCrea:AcadCreaCompleto;
  creaArea:CreaAreaCompleto;
  loadingData: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private solicitudService: CreationReqService,
        private invGroupService: InvGroupService,
        private userService: UsuarioService,
        private invMemberService: InvMemberService,
        private lineCreaService: LineCreaService,
         private acadCreaService:AcadCreaService,
         private creaAreaService:CreaAreaService,
         private router: Router,
         private developmentService: DevelopmentPlanService,
         
) { /*this.loadingData = true;*/}

  ngOnInit(): void {
   
      this.solicitudCreacion()

  }

  solicitudCreacion() {
    this.loadingData = true;
    const navigationState = history.state;
    if (navigationState && navigationState.creationReqForm) {
      this.creationReqForm = navigationState.creationReqForm;
      //console.log(this.creationReqForm);
        this.obtenerGrupo(this.creationReqForm.idGrupoInv)
        this.obtenerSegmentosInvestigacion(this.creationReqForm.idPeticionCreacion);
         // Id del formulario de creación que deseas utilizar
        this.obtenerPlanDesarrollo(this.creationReqForm.idGrupoInv);
    } else {
      // Manejar el caso en que no se encuentren datos en el estado de navegación
    }
  }
  obtenerPlanDesarrollo(id:number){
    this.developmentService.getByIdGroupC(id).subscribe((data)=>{
      this.planDesarrollo=data;
    })
  }
  obtenerSegmentosInvestigacion(id:number){
    this.lineCreaService.getByReq(id).subscribe(data => {
      this.lineCrea=data;
      this.loadingData = false;
    });
    this.acadCreaService.getByReq(id).subscribe(data=>{
      this.acadCrea=data;
      this.loadingData = false;
    });
    this.creaAreaService.getByReq(id).subscribe(data=>{
      this.creaArea=data;
      this.loadingData = false;
    });
  }
  obtenerGrupo(id:number){
    this.invGroupService.getById(id).subscribe(
        (data)=>{
          //console.log(data)
this.invGroup=data          
  this.obtenerUsuario(data.idUser)
  this.obtenerMiembros(data.idGrupoInv)
        }
    )

  }
  obtenerUsuario(id:number){
    this.userService.getById(id).subscribe(
        (data)=>{
            this.usuario=data;
            //console.log(data);
        }
    )
  }
  
  obtenerMiembros(id:number){
    this.invMemberService.getByGroup(id).subscribe(
      (data)=>{
        this.member=data;
        //console.log("miembros",data);
        for(let miembro of data){
          this.userService.getById(miembro.idUsuario).subscribe(
            (datoUser)=>{
              this.memberUser.push(datoUser);
              //console.log(this.memberUser)
            }
          )
        }
      }
    )
    
  }
  validarGrupo(){
    const navigationState = history.state;
    const creationReqForm = navigationState.creationReqForm;
    this.router.navigate(["main/ficha"],{state:{creationReqForm}})
  }
}
