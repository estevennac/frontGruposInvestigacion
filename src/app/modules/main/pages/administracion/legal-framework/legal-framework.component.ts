import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalFramework } from 'src/app/types/legalFramework.types';
import { LegalFrameworkService } from 'src/app/core/http/legal-framework/legalFramework.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LegalFrameworkControl } from './modal_legal_framework.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-legal-framework-list',
  templateUrl: './legal-framework.component.html',
  styleUrls: ['../modulos.component.scss'],
})
export class LegalFrameworkComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<LegalFramework>();
  isLoading: boolean = true;
  searchControl = new FormControl();
  currentUser: string;
  currentDate: Date = new Date();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private legalFrameworkService: LegalFrameworkService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getLegal();
    this.currentUser = this.authService.getUserName();
    this.searchControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value.trim().toLowerCase();
    });
  }

  getLegal() {
    this.legalFrameworkService.getAll().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: LegalFramework, filter: string) =>
        data.nombre.toLowerCase().includes(filter);
      this.isLoading = false;
    });
  }

  openDialog(marco?: LegalFramework): void {
    const dialogRef = this.dialog.open(LegalFrameworkControl, {
      width: '50%',
      height: '70%',
      data: { marco }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getLegal();
      }
    });
  }

  editLegal(id: number) {
    this.isLoading = true;
    this.legalFrameworkService.getById(id).subscribe(
      (marco: LegalFramework) => {
        this.isLoading = false;
        this.openDialog(marco);
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast');
      }
    );
  }

  deleteLegal(id: number) {
    this.isLoading = true;
    this.legalFrameworkService.update(id, { estado: false, fechaModificacion: this.currentDate, usuarioModificacion: this.currentUser }).subscribe(
      () => {
        this.isLoading = false;
        this.showToast('Marco legal desactivado correctamente', 'cerrar');
        this.getLegal();
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast');
      }
    );
  }

  activeLegal(id: number) {
    this.isLoading = true;
    this.legalFrameworkService.update(id, { estado: true, fechaModificacion: this.currentDate, usuarioModificacion: this.currentUser }).subscribe(
      () => {
        this.isLoading = false;
        this.showToast('Marco legal activado correctamente', 'cerrar');
        this.getLegal();
      },
      (error) => {
        this.isLoading = false;
        this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast');
      }
    );
  }

  goBack() {
    this.router.navigate(['/main/admin']);
  }

  private showToast(message: string, action: string, panelClass: string = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: panelClass,
    });
  }
}