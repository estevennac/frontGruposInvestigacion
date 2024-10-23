import { Component, OnInit } from '@angular/core';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service'; 
import { Router } from '@angular/router';
import { CreationReqForm } from 'src/app/types/creationReq.types'; 
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { state } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Usuario } from 'src/app/types/usuario.types';


@Component({
    selector: 'app-solicitud-list',
    templateUrl: './obtenerSolicitudes.component.html',
    styleUrls: ['./obtenerSolicitudes.component.scss'],
})
export class SolicitudesComponent implements OnInit {
    creationReq: CreationReqForm[] = [];
    solicitudesFiltradas: CreationReqForm[] = [];
    noSolicitudesPendientes: boolean = false;
    grupos: InvGroupForm[] = [];
    usuarios: any[] = []; 
    loadingData: boolean = true;
    coordinador:Usuario;
    constructor(
        private router: Router,
        private solicitudService: CreationReqService,
        private invGroupService: InvGroupService,
        private userService: UsuarioService
    ) {}

    ngOnInit() {
        this.getSolicitudes();
    }

    getSolicitudes() {
        this.solicitudService.getAll().subscribe((data) => {
            this.creationReq = data;
            this.filtrarSolicitudes();
            this.getGrupos();
        });
    }

    filtrarSolicitudes() {
        this.solicitudesFiltradas = this.creationReq.filter((solicitud) => solicitud.estado === 'i');
        this.noSolicitudesPendientes = this.solicitudesFiltradas.length === 0;
        if(this.solicitudesFiltradas.length===0){
            this.loadingData=false;
        }
    }

    getGrupos() {
        this.solicitudesFiltradas.forEach((solicitud) => {
            this.invGroupService.getById(solicitud.idGrupoInv).subscribe((grupo) => {
                this.grupos.push(grupo);
                this.getUsuarios(grupo.idUser); 
                this.getNombreCoordinador(grupo.idUser);
            });
        });
    }

    getUsuarios(idUsuario: number) {
        this.userService.getById(idUsuario).subscribe((usuario) => {
            this.usuarios.push(usuario);
        });
    }

    // Función para obtener el nombre del grupo a partir del idGrupoInv
    getNombreGrupo(idGrupo: number): string {
        const grupo = this.grupos.find(grupo => grupo.idGrupoInv === idGrupo);
        return grupo ? grupo.nombreGrupoInv : 'Nombre de Grupo Desconocido';
    }

    getNombreCoordinador(idUsuario: number): string {
        this.userService.getById(idUsuario).subscribe(coordinador=>{
            this.coordinador = coordinador;
            this.loadingData = false;
        })
        const coordinador = this.usuarios.find(usuario => usuario.idUsuario === 1);
        return coordinador ? `${coordinador.nombre} ${coordinador.apellido}` : 'Coordinador Desconocido';
    }
validar(id:number)
{
    //console.log("grupo seleccionado",id)
    this.solicitudService.getById(id).subscribe(
        (creationReqForm: CreationReqForm)=>{
            this.router.navigate(['main/solicitudGI'],{state:{creationReqForm}});
        },
        
      (error) => {
        console.error('Error al obtener los detalles de la Solicitud', error);
      }
    )
}    

}
