import { Component, OnInit } from '@angular/core';
import { Area } from '../../../../../types/area.types';
import { Router } from '@angular/router';
import { AreaService } from 'src/app/core/http/area/area.service';
import { AreaControl } from './modal_area.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-area-list',
  templateUrl: './area.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class AreaComponent implements OnInit {
  area: Area[] = [];

  constructor(private router: Router, private areaService: AreaService,
    private dialog:MatDialog
  ) {}

  ngOnInit() {
    this.getArea();
  }

  getArea() {
    this.areaService.getAll().subscribe((data) => {
      this.area = data;
    });
  }

  openDialog(area?: Area): void {
    const dialogRef = this.dialog.open(AreaControl, {
        width: '50%',
        height: '70%',
        data: { area } // Pasar los datos del dominio si existe (para edición)
    });

    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
            this.getArea(); // Actualizar la tabla si se creó o editó algo
        }
    });
}

  
editArea(id: number) {
  this.areaService.getById(id).subscribe(
      (area: Area) => {
          this.openDialog(area); // Abrir el modal con los datos para editar
      },
      (error) => {
          console.error('Error al obtener los detalles del area', error);
      }
  );
}

  deleteArea(id: number) {
    this.areaService.update(id, { estado: false }).subscribe(
      () => {
        console.log(`Area con ID ${id} eliminado correctamente`);
        this.getArea();
      },
      (error) => {
        console.error('Error al eliminar el dominio académico', error);
      }
    );
  }
  activeArea(id: number) {
    this.areaService.update(id, { estado: true }).subscribe(
      () => {
        console.log(`Area con ID ${id} eliminado correctamente`);
        this.getArea();
      },
      (error) => {
        console.error('Error al eliminar el dominio académico', error);
      }
    );
  }
  goBack() {
    this.router.navigate(['main/admin']);
  }
}
