import { Component, OnInit } from '@angular/core';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';

@Component({
  selector: 'vex-all-inv-group-cd',
  templateUrl: './all-inv-group-cd.component.html',
  styleUrls: ['./all-inv-group-cd.component.scss']
})
export class AllInvGroupCDComponent implements OnInit {

  grupos: any[] = [];

  constructor(private invGroupService: InvGroupService) {}

  ngOnInit(): void {
    this.loadGrupos();
  }

  loadGrupos(): void {
    this.invGroupService.getAll().subscribe(
      (data) => {
        console.log('Datos recibidos:', data);
        this.grupos = data;
      },
      (error) => {
        console.error('Error al cargar los grupos de investigación:', error);
      }
    );
  }
  
  

  validarSolicitud(nombreGrupoInv: string): void {
    // Lógica para validar la solicitud del grupo
    console.log('Validando solicitud para el grupo:', nombreGrupoInv);
  }

  submitForm(): void {
    // Lógica para validar todas las solicitudes
    console.log('Validando todas las solicitudes...');
  }
}
