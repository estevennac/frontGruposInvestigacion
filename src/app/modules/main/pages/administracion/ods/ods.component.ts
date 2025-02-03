import { Component, OnInit, ViewChild } from "@angular/core";
import { ODS } from "src/app/types/ods.types";
import { OdsService } from "src/app/core/http/ods/ods.service";
import { OdsControl } from './modal_ods.component';
import { MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: "app-ods-list",
  templateUrl: "./ods.component.html",
  styleUrls: ["../modulos.component.scss"],
})
export class OdsComponent implements OnInit {
  ods: ODS[] = [];
  displayedColumns: string[] = ['ods', 'descripcion', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<ODS>();
  isLoading: boolean = true;
  searchControl = new FormControl();
  currentDate: Date = new Date();
  currentUser: string;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private router: Router, private odsService: OdsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getUserName();
    this.searchControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value.trim().toLowerCase();
    });
    this.dataSource.filterPredicate = (data: ODS, filter: string) =>
      data.ods.toLowerCase().includes(filter);
    this.get();
  }

  get() {
    this.odsService.getAll().subscribe((data) => {
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: ODS, filter: string) =>
        data.descripcion.toLowerCase().includes(filter);
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.showToast('Error al cargar los ODS', 'cerrar', 'error-toast');
    });
    }
  

  openDialog(ods?: ODS): void {
    const dialogRef = this.dialog.open(OdsControl, {
      width: '50%',
      height: '70%',
      data: { ods }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.get();
      }
    });
  }

  edit(id: number) {
    this.isLoading = true;
    this.odsService.getById(id).subscribe(
      (ods: ODS) => {
        this.isLoading = false;
        this.openDialog(ods); // Abrir el modal con los datos para editar
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Error al obtener los detalles del area', 'cerrar', 'error-toast');
      }
      
    );
  }

  deletee(id:number){
    this.isLoading = true;
    this.odsService.update(id, { estado: false,fechaModificacion: this.currentDate, usuarioModificacion: this.currentUser }).subscribe(
      () => {
        this.isLoading = false;
        this.showToast('ODS eliminado correctamente', 'cerrar');
        this.get();
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Error al eliminar el ODS', 'cerrar', 'error-toast');
      }
    );
  }

  active(id: number) {
    this.isLoading = true;
    this.odsService.update(id, { estado: true, fechaModificacion: this.currentDate, usuarioModificacion: this.currentUser }).subscribe(
      () => {
        this.isLoading = false;
        this.showToast('ODS activado correctamente', 'cerrar');
        this.get();
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Error al activar el ODS', 'cerrar', 'error-toast');
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
    this.router.navigate(['main/admin']);
  }
}
