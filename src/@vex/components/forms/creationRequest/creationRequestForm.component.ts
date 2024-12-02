import { Component, OnInit, Input } from '@angular/core';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { CreationReqForm } from 'src/app/types/creationReq.types';
import { Usuario } from 'src/app/types/usuario.types';
import { InvMemberForm } from 'src/app/types/invMember.types';
import { Line } from 'src/app/types/line.types';
import { AcademicDomain } from 'src/app/types/academicDomain.types';
import { Area } from 'src/app/types/area.types';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { InvMemberService } from 'src/app/core/http/inv-member/inv-member.service';
import { InvGroup_linesService } from 'src/app/core/http/InvGroup_line/invGroup_linesService.service';
import { InvGroup_academicDomainService } from 'src/app/core/http/invGroup_academicDomain/invGroup_academicDomain.service';
import { InvGroup_areaService } from 'src/app/core/http/invGroup_area/crea-area.service';

@Component({
    selector: 'app-creation-request-form',
    templateUrl: './creationRequestForm.component.html',
    styleUrls: ['./creationRequestForm.component.scss']
})
export class CreationRequestFormComponent implements OnInit {
    @Input() id!: number;
    invGroup: InvGroupForm;
    creationReqForm: CreationReqForm;
    usuario: Usuario;
    memberUser: Usuario[] = [];
    member: InvMemberForm[];
    line: Line[];
    acad: AcademicDomain[];
    area: Area[];
    loadingData: boolean = true;
    invGroupId: number;
    token: string;

    constructor(private invGroupService: InvGroupService,
        private creationRequestService: CreationReqService,
        private userService: UsuarioService,
        private invMemberService: InvMemberService,
        private invGroup_linesService: InvGroup_linesService,
        private invGroup_academicDomainService: InvGroup_academicDomainService,
        private invGroup_areaService: InvGroup_areaService,


    ) { }
    ngOnInit(): void {
        this.solicitudCreacion()
        this.token = sessionStorage.getItem('access_token');
    }

    solicitudCreacion() {
        console.log(this.id)
        this.loadingData = true;
        this.creationRequestService.getById(this.id).subscribe(
            (data) => {
                this.creationReqForm = data;
                console.log(this.creationReqForm)
                this.invGroupId = this.creationReqForm.idGrupoInv;
                this.obtenerGrupo(this.creationReqForm.idGrupoInv)
                this.obtenerSegmentosInvestigacion(this.creationReqForm.idGrupoInv);
            },
            (error) => {
                this.loadingData = false;
            }
        );

    }
    obtenerSegmentosInvestigacion(id: number) {
        this.invGroup_linesService.getByGroup(id).subscribe(data => {
            this.line = data;

        });
        this.invGroup_academicDomainService.getByGroup(id).subscribe(data => {
            this.acad = data;
        });
        this.invGroup_areaService.getByGroup(id).subscribe(data => {
            this.area = data;
        });
    }
    obtenerGrupo(id: number) {
        this.invGroupService.getById(id).subscribe(
            (data) => {
                //console.log(data)
                this.invGroup = data
                this.obtenerUsuario(data.idCoordinador)
                this.obtenerMiembros(data.idGrupoInv)
                
            }
        )

    }
    obtenerUsuario(id: number) {
        this.userService.getById(id).subscribe(
            (data) => {
                this.usuario = data;
            }
        )
    }
    obtenerMiembros(id: number) {
        this.invMemberService.getAllByGroupId(id).subscribe(
          (data)=>{
            this.memberUser=data;
            this.loadingData=false          } 
        )
      }

}
