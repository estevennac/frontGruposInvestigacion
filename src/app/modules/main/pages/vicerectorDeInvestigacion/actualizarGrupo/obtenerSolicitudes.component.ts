import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { Link as LinkForm } from 'src/app/types/link.types';
import { LinkService } from 'src/app/core/http/link/link.service';

@Component({
    selector: 'app-solicitud-list',
    templateUrl: './obtenerSolicitudes.component.html',
    styleUrls: ['./obtenerSolicitudes.component.scss'],
})
export class ActualizacionForVicComponent implements OnInit {
    vinculacion: LinkForm[] = [];
    solicitudesFiltradas: LinkForm[] = [];
    noSolicitudesPendientes: boolean = false;
    grupos: InvGroupForm[] = [];
    usuarios: any[] = [];
    loadingData: boolean = true;
    coordinador: any[] = [];
    nombreCoor: string;

    constructor(
        private router: Router,
        private invGroupService: InvGroupService,
        private userService: UsuarioService,
        private linkService: LinkService
    ) { }

    ngOnInit() {
        this.filtrarSolicitudes();
    }

  

    filtrarSolicitudes() {
        this.linkService.getByState("V").subscribe((data)=>{
            
            this.solicitudesFiltradas =data;
            this.noSolicitudesPendientes = this.solicitudesFiltradas.length === 0;
            if (this.solicitudesFiltradas.length === 0) {
                this.loadingData = false;
            }
            this.getGrupos();
        })
        
     
    }

    getGrupos() {

        this.solicitudesFiltradas.forEach((solicitud) => {
            this.invGroupService.getById(solicitud.idGrupoInv).subscribe((grupo) => {
                this.grupos.push(grupo);
                this.getUsuarios(grupo.idUser);
                this.userService.getById(grupo.idUser).subscribe(user => {
                    const coordinadorConGrupo = { usuario: user, idGroup: grupo.idGrupoInv };
                    this.coordinador.push(coordinadorConGrupo);

                })

            });
        });
    }

    getUsuarios(idUsuario: number) {
        this.userService.getById(idUsuario).subscribe((usuario) => {
            this.usuarios.push(usuario);
            this.loadingData = false;
        });
    }

    // Función para obtener el nombre del grupo a partir del idGrupoInv
    getNombreGrupo(idGrupo: number): string {

        const grupo = this.grupos.find(grupo => grupo.idGrupoInv === idGrupo);
        return grupo ? grupo.nombreGrupoInv : 'Nombre de Grupo Desconocido';
    }

    getNombreCoordinador(idGrupo: number): string {
        //console.log(this.coordinador);
        const coordinador = this.coordinador.find(coordinador => coordinador.idGroup === idGrupo)
        return coordinador ? `${coordinador.usuario.nombre} ${coordinador.usuario.apellido}` : 'Nombre desconocido';
    }
    validar(id: number) {
        //console.log("grupo seleccionado",id)
        this.linkService.getById(id).subscribe(
            (link: LinkForm) => {
                this.router.navigate(['main/solicitud-vin-V'], { state: { link } });
            },

            (error) => {
                console.error('Error al obtener los detalles de la Solicitud', error);
            }
        )
    }

}
