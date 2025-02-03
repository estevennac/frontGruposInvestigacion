import { Component, OnInit,ViewChild } from "@angular/core";
import { InstStrategicObj } from "src/app/types/InstStrategicObj.types";
import { InstStrategicObjService } from "src/app/core/http/instStrategicObj/inst-strategic-obj.service";
import { MatDialog } from "@angular/material/dialog";
import { ModalInstStrategicObjControl } from "./modal-inst-strategic-obj.component";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
    selector: 'app-strategic-obj',
    templateUrl: './inst-strategic-obj.component.html',
    styleUrls: ['../modulos.component.scss']
})

export class InstStrategicObjComponent implements OnInit{
    instStrategicObj: InstStrategicObj[] = [];
    displayedColumns: string[] = ['objetivo', 'estado', 'acciones'];
    dataSource = new MatTableDataSource<InstStrategicObj>();
    searchControl = new FormControl();
    @ViewChild(MatSort) sort!: MatSort;
    currentUser: string;
    currentDate: Date = new Date();
    isLoading: boolean = true;

    constructor(
        private router: Router,
        private instStrategicObjService: InstStrategicObjService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private authService: AuthService,
    ){}

    ngOnInit(){
        this.getInstStrategicObj();
        this.currentUser = this.authService.getUserName();
        this.searchControl.valueChanges.subscribe(value => {
            this.dataSource.filter = value.trim().toLowerCase();
        });
    }

    getInstStrategicObj(){
        this.instStrategicObjService.getAll().subscribe((data) =>{
            this.dataSource=new MatTableDataSource(data);
            this.dataSource.sort = this.sort;
            this.dataSource.filterPredicate = (data: InstStrategicObj, filter: string) =>
                data.objetivo.toLowerCase().includes(filter);
            this.isLoading = false;
        });
    }

    openDialog(instStrategicObj?: InstStrategicObj): void {
        const dialogRef = this.dialog.open(ModalInstStrategicObjControl,{
            width: '50%',
            height: '70%',
            data: { instStrategicObj}
        });

        dialogRef.afterClosed().subscribe((result) =>{
            if(result){
                this.getInstStrategicObj();
            }
        });
    }
    
    editInstStrategicObj(id: number){
        this.isLoading = true;
        this.instStrategicObjService.getById(id).subscribe(
            (instStrategicObj: InstStrategicObj) =>{
                this.isLoading = false;
                this.openDialog(instStrategicObj);
            },
            (error) => {
                this.isLoading = false;
                this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast')
            }
        );
    }

    deleteObj(id: number){
        this.isLoading = true;
        this.instStrategicObjService.update(id, {estado: false,fechaModificadoObj: this.currentDate, usuarioModificadoObj: this.currentUser}).subscribe(
            ()=>{
                this.isLoading = false;
                this.showToast('Objetivo estrategico eliminado correctamente', 'cerrar');
                this.getInstStrategicObj();
            },
            (error) => {
                this.isLoading = false;
                this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast');
            }
        );
    }
    activateObj(id:number){
        this.instStrategicObjService.update(id, {estado: true,fechaModificadoObj: this.currentDate, usuarioModificadoObj: this.currentUser}).subscribe(
            () =>{
                this.isLoading = false;
                this.showToast('Objetivo estrategico activado correctamente', 'cerrar');
                this.getInstStrategicObj();
            },
            (error) => {
                    this.isLoading = false;
                    this.showToast('Lo siento, intenta más tarde', 'cerrar', 'error-toast');
            }
        );
    }
    goBack(){
        this.router.navigate(['main/admin'])
    }
    private showToast(message: string, action: string, panelClass: string = '') {
        this.snackBar.open(message, action, {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: panelClass,
        });
      }
}