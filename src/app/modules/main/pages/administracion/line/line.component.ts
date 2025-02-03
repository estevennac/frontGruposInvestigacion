import { Component, OnInit ,ViewChild} from '@angular/core';
import { LineService } from 'src/app/core/http/line/line.service';
import { Line } from 'src/app/types/line.types';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LineaControl } from './modal_line.component';
import { AreaService } from 'src/app/core/http/area/area.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-line-list',
  templateUrl: './line.component.html',
  styleUrls: ['../modulos.component.scss']
})
export class LineComponent implements OnInit {
  displayedColumns: string[] = ['nombreLinea', 'nombreArea', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Line>(); // Fuente de datos para la tabla
  areas: any[] = []; // Array para almacenar las áreas
  isLoading: boolean = true; // Control para mostrar el spinner
  searchControl = new FormControl(); // Control de búsqueda
  currentUser: string;
  currentDate: Date = new Date();
  
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private lineService: LineService,
    private areaService: AreaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
        private authService: AuthService,
    
  ) {}

  ngOnInit() {
    this.getLine();
    this.currentUser = this.authService.getUserName();
    this.searchControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value.trim().toLowerCase();
    });
  }

  // Método para obtener líneas y áreas, y combinar la información
  getLine() {
    this.areaService.getAll().subscribe((areasData) => {
      this.areas = areasData;

      this.lineService.getAll().subscribe((linesData) => {
        this.dataSource = new MatTableDataSource(
          linesData.map((line) => {
            const area = this.areas.find(a => a.idArea === line.idArea);
            return {
              ...line,
              nombreArea: area ? area.nombreArea : 'Área no encontrada'
            };
          })
        );
        this.dataSource.sort = this.sort;
        this.isLoading = false; // Desactivar el spinner una vez cargados los datos
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
        this.openDialog(linea); // Abrir modal con datos para editar
      },
      (error) => {
        this.showToast('Error al obtener los detalles de la línea', 'cerrar', 'error-toast');
      }
    );
  }

  deleteLine(id: number, idArea: number) {
    this.isLoading = true;
    this.lineService.update(id, { idArea: idArea, estado: false,fechaModificacionLinea: this.currentDate, usuarioModificacionLinea: this.currentUser }).subscribe(
      () => {
        this.isLoading = false;
        this.showToast('Línea de investigación eliminada correctamente', 'cerrar');
        this.getLine();
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast');
      }
    );
  }

  activateLine(id: number, idArea: number) {
    this.isLoading = true;
    this.lineService.update(id, { idArea: idArea, estado: true,fechaModificacionLinea: this.currentDate, usuarioModificacionLinea: this.currentUser }).subscribe(
      () => {
        this.isLoading = false;
        this.showToast('Línea de investigación activada correctamente', 'cerrar');
        this.getLine();
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast');
      }
    );
  }

  showToast(message: string, action: string, panelClass: string = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: panelClass,
    });
  }

  goBack() {
    this.router.navigate(['/main/admin']);
  }
}
