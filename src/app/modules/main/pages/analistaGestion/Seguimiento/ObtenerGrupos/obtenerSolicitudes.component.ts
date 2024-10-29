import { Component, OnInit } from '@angular/core';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service'; 
import { Router } from '@angular/router';
import { CreationReqForm } from 'src/app/types/creationReq.types'; 
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { Usuario } from 'src/app/types/usuario.types';

@Component({
    selector: 'app-solicitud-list',
    templateUrl: './obtenerSolicitudes.component.html',
    styleUrls: ['./obtenerSolicitudes.component.scss'],
})
export class GruposForAnalistaComponent implements OnInit {
    gruposFiltrados: InvGroupForm[] = [];
    noGruposPendientes: boolean = false;
    grupos: InvGroupForm[] = [];
    usuarios: Usuario[] = []; 
    loadingData: boolean = true;
    coordinador: Usuario | undefined;

    constructor(
        private router: Router,
        private solicitudService: CreationReqService,
        private invGroupService: InvGroupService,
        private userService: UsuarioService
    ) {}

    ngOnInit() {
        this.getGrupos();
    }

    getGrupos() {
        this.invGroupService.getAll().subscribe((data) => {
            this.grupos = data;
            this.filtrarGrupos();
            this.getUsuarios();
        });
    }

    filtrarGrupos() {
        this.gruposFiltrados = this.grupos.filter(group => group.estadoGrupoInv === 'Activo');
        this.noGruposPendientes = this.gruposFiltrados.length === 0;
        this.loadingData = false; // Esta línea se mueve aquí para asegurarse de que se actualice correctamente.
    }

    getUsuarios() {
        this.gruposFiltrados.forEach(grupo => {
            this.userService.getById(grupo.idCoordinador).subscribe((usuario) => {
                this.usuarios.push(usuario);
            });
        });
    }

    getNombreGrupo(idGrupo: number): string {
        const grupo = this.grupos.find(grupo => grupo.idGrupoInv === idGrupo);
        return grupo ? grupo.nombreGrupoInv : 'Nombre de Grupo Desconocido';
    }

    getNombreCoordinador(idUsuario: number): string {
        const coordinador = this.usuarios.find(usuario => usuario.id === idUsuario);
        return coordinador ? `${coordinador.nombre} ` : 'Coordinador Desconocido';
    }

    validar(id: number) {
        console.log("grupo seleccionado", id);
        this.invGroupService.getById(id).subscribe(
            (invGroup: InvGroupForm) => {
                this.router.navigate(['main/sol-informe'], { state: { invGroup } });
            },
            (error) => {
                console.error('Error al obtener los detalles de la Solicitud', error);
            }
        );
    }    
}
