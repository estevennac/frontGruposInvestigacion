import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-grupos-investigacion-crud',
  templateUrl: './grupos-investigacion.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class GruposControlComponent implements OnInit {
  displayedColumns: string[] = [
    'index', 'nombreGrupoInv', 'acronimoGrupoinv', 'departamento', 'coordinador', 'abrir'
  ];
  
  dataSource = new MatTableDataSource<InvGroupForm>();
  isLoading: boolean = true;
  searchControl = new FormControl(); // Campo de búsqueda reactivo
  usuarioNombre: { [key: number]: string } = {};

  @ViewChild(MatSort) sort!: MatSort; // Habilitar ordenamiento

  constructor(
    private router: Router,
    private giService: InvGroupService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.get();
    
    // Aplicar filtro en tiempo real
    this.searchControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value.trim().toLowerCase();
    });
  }

  get() {
    this.giService.getAll().subscribe((data) => {
      data.forEach((grupo) => {
        this.getCoordinador(grupo.idCoordinador).then(nombre => {
          grupo['nombreCoordinador'] = nombre; // Agregar el nombre del coordinador al objeto
          this.dataSource.data = data;
          this.dataSource.sort = this.sort;
        });
      });

      this.isLoading = false;
    });
  }

  async getCoordinador(id: number): Promise<string> {
    if (this.usuarioNombre[id]) {
      return this.usuarioNombre[id];
    }
    try {
      const usuario = await this.usuarioService.getById(id).toPromise();
      this.usuarioNombre[id] = usuario?.nombre || 'Usuario no encontrado';
    } catch {
      this.usuarioNombre[id] = 'Usuario no encontrado';
    }
    return this.usuarioNombre[id];
  }

  open(id: number): void {
    sessionStorage.setItem('selectedId', id.toString());
    this.router.navigate(['/main/detalleGrupo']);
  }
  add() {
    this.router.navigate(['/main/crearGI']);
  }
}
