import { Component, OnInit } from '@angular/core';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';

@Component({
  selector: 'vex-scientific-production-groups',
  templateUrl: './scientific-production-groups.component.html',
  styleUrls: ['./scientific-production-groups.component.scss']
})
export class ScientificProductionGroupsComponent implements OnInit {

  view: [number, number] = [1000, 400];

  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    
  } as any;

  single = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
      {
      "name": "UK",
      "value": 6200000
    }
  ];
  constructor(private invGroupService: InvGroupService) {}

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  grupos: any[] = [];


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
    console.log('Validando solicitud para el grupo:', nombreGrupoInv);
  }
  submitForm(): void {
    console.log('Validando todas las solicitudes...');
  }
  
}