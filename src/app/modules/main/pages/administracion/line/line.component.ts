import { Component, OnInit } from '@angular/core';
import { LineService } from '../../../../../core/http/line/line.service';
import { Line } from '../../../../../types/line.types';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LineaControl } from './modal_line.component';
import { AreaService } from 'src/app/core/http/area/area.service';

@Component({
  selector: 'app-line-list',
  templateUrl: './line.component.html',
  styleUrls: ['../modulos.component.scss']
})
export class LineComponent implements OnInit {
  line: Line[] = [];
  areas: any[] = []; // Array para almacenar las áreas

  constructor(
    private router: Router,
    private lineService: LineService,
    private areaService: AreaService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getLine();
  }

  // Método para obtener líneas y áreas, y combinar la información
  getLine() {
    // Obtener todas las áreas
    this.areaService.getAll().subscribe((areasData) => {
      this.areas = areasData;

      // Obtener todas las líneas de investigación
      this.lineService.getAll().subscribe((lineasData) => {
        // Para cada línea, asignar el nombre del área correspondiente
        this.line = lineasData.map((linea) => {
          const area = this.areas.find(a => a.idArea === linea.idArea);
          return {
            ...linea,
            nombreArea: area ? area.nombreArea : 'Área no encontrada'
          };
        });
      });
    });
  }

  openDialog(linea?: Line): void {
    const dialogRef = this.dialog.open(LineaControl, {
      width: '50%',
      height: '70%',
      data: { linea } // Pasar los datos de la línea si existe (para edición)
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getLine(); // Actualizar la tabla si se creó o editó algo
      }
    });
  }

  editLine(id: number) {
    this.lineService.getById(id).subscribe(
      (linea: Line) => {
        this.openDialog(linea); // Abrir el modal con los datos para editar
      },
      (error) => {
        console.error('Error al obtener los detalles de la línea', error);
      }
    );
  }

  deleteLine(id: number,idArea:number) {
    this.lineService.update(id, { idArea: idArea, estado: false }).subscribe(
      () => {
        console.log(`Línea de investigación con ID ${id} eliminada correctamente`);
        this.getLine();
      },
      (error) => {
        console.error('Error al eliminar la línea de investigación', error);
      }
    );
  }

  activateLine(id: number,idArea:number) {
    this.lineService.update(id, { idArea: idArea,estado: true }).subscribe(
      () => {
        console.log(`Línea de investigación con ID ${id} activada correctamente`);
        this.getLine();
      },
      (error) => {
        console.error('Error al activar la línea de investigación', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['/main/admin']);
  }
}
