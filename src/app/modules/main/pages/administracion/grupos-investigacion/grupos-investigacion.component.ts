import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { Usuario } from 'src/app/types/usuario.types';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-grupos-investigacion-crud',
  templateUrl: './grupos-investigacion.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class GruposControlComponent implements OnInit {
  invGroup: InvGroupForm[] = [];
  filteredGroups: InvGroupForm[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(
    private router: Router,
    private giService: InvGroupService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.get();
  }

  get() {
    this.giService.getAll().subscribe((data) => {
      this.invGroup = data;
      this.filteredGroups = data; // Inicializa con todos los grupos
      this.isLoading = false;
    });
  }

  usuarioNombre: { [key: number]: string } = {};

  getCoordinador(id: number): Observable<string> {
    if (!this.usuarioNombre) {
      this.usuarioNombre = {};
    }
    if (this.usuarioNombre[id]) {
      return of(this.usuarioNombre[id]);
    }
    return this.usuarioService.getById(id).pipe(
      map((usuario) => {
        const nombre = usuario?.nombre || 'Usuario no encontrado';
        this.usuarioNombre[id] = nombre;
        return nombre;
      }),
      catchError(() => {
        const errorNombre = 'Usuario no encontrado';
        this.usuarioNombre[id] = errorNombre;
        return of(errorNombre);
      })
    );
  }

  add() {
    this.router.navigate(['/main/crearGI']);
  }

  open(id: number): void {
    sessionStorage.setItem('selectedId', id.toString());
    this.router.navigate(['/main/detalleGrupo']);
  }

  goBack() {
    this.router.navigate(['main/admin']);
  }

  filterGroups() {
    this.filteredGroups = this.invGroup.filter(group =>
      group.nombreGrupoInv.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortGroups();
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortGroups();
  }

  sortGroups() {
    this.filteredGroups.sort((a, b) => {
      let valueA = this.getColumnValue(a, this.sortColumn);
      let valueB = this.getColumnValue(b, this.sortColumn);

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  getColumnValue(group: InvGroupForm, column: string): any {
    switch (column) {
      case 'nombreGrupoInv':
        return group.nombreGrupoInv.toLowerCase();
      case 'acronimoGrupoinv':
        return group.acronimoGrupoinv.toLowerCase();
      case 'departamento':
        return group.departamento.toLowerCase();
      case 'coordinador':
        return this.usuarioNombre[group.idCoordinador]?.toLowerCase() || '';
      case 'index':
        return this.invGroup.indexOf(group);
      default:
        return '';
    }
  }
}
