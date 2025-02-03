import { Component, OnInit,ViewChild } from "@angular/core";
import { Strategies } from "src/app/types/strategies.types";
import { StrategiesService } from "src/app/core/http/strategies/strategies.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ModalStrategiesControl } from "./modal-strategies.component";
import { InstStrategicObjService } from "src/app/core/http/instStrategicObj/inst-strategic-obj.service";
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
    selector: 'app-strategies',
    templateUrl: './strategies.component.html',
    styleUrls: ['../modulos.component.scss']
})

export class StrategiesComponent implements OnInit {
    strategies: Strategies[] = [];
    objetivos:any[]=[];
 displayedColumns: string[] = ['objetivo', 'estrategia', 'estado', 'acciones'];
   dataSource = new MatTableDataSource<Strategies>(); // Fuente de datos para la tabla
   isLoading: boolean = true;
   searchControl = new FormControl(); // Control de búsqueda
   currentUser: string;
   currentDate: Date = new Date();
     @ViewChild(MatSort) sort!: MatSort;
   
    constructor(
        private router: Router,
        private strategiesService: StrategiesService,
        private instStrategiesService: InstStrategicObjService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private authService: AuthService,
    ){}

    ngOnInit(){
       this.getStrategies(); 
       this.currentUser = this.authService.getUserName();
       this.searchControl.valueChanges.subscribe(value => {
           this.dataSource.filter = value.trim().toLowerCase();
       });
    }

    getStrategies() {
      this.instStrategiesService.getAll().subscribe(
        (objetivosData) => {
          this.objetivos = objetivosData;
          
          this.strategiesService.getAll().subscribe(
            (data) => {
              this.dataSource = new MatTableDataSource(
                data.map((estrategia) => {
                  const objetivo = this.objetivos.find(o => o.idObjetivoEstrategico === estrategia.idObjetivo);
                  return {
                    ...estrategia,
                    objetivo: objetivo ? objetivo.objetivo : 'Objetivo no encontrado'
                  };
                })
              );
              this.dataSource.sort = this.sort;
              this.isLoading = false;
            },
            (error) => {
              this.showToast('Error al obtener las estrategias', 'cerrar');
              this.isLoading = false; // Para manejar el estado de carga si ocurre un error
            }
          );
        },
        (error) => {
this.showToast('Error al obtener las estrategias', 'cerrar');
          this.isLoading = false; // Para manejar el estado de carga si ocurre un error
        }
      );
    }
    

    openDialog(strategies?: Strategies): void{
        const dialogRef = this.dialog.open(ModalStrategiesControl, {
            width: '50%',
            height: '70%',
            data: { strategies}
        });

        dialogRef.afterClosed().subscribe((result) =>{
            if(result){
                this.getStrategies();
            }
        });
    }

    editStrategies(id: number) {
        this.isLoading = true;
        this.strategiesService.getById(id).subscribe(
          (strategies: Strategies) => {
            this.isLoading = false;
            this.openDialog(strategies);
          },
          (error) => {
            this.isLoading = false;
            this.showToast('Error al obtener los detalles de la estrategia', 'cerrar');
          }
        );
    }

    deleteStrategies(id: number,idObjetivo:number) {
      this.isLoading = true;
        this.strategiesService.update(id, { idObjetivo:idObjetivo,estado: false,fechaModificacion: this.currentDate, usuarioModificacion: this.currentUser }).subscribe(
          () => {
            this.isLoading = false;
this.showToast('Estrategia eliminada correctamente', 'cerrar');
            this.getStrategies();
          },
          (error) => {
            this.isLoading = false;
this.showToast('Estrategia eliminada correctamente', 'cerrar');
          }
        );
    }
      activateStrategies(id: number,idObjetivo:number) {
        this.strategiesService.update(id, { idObjetivo:idObjetivo,estado: true }).subscribe(
          () => {
            this.isLoading = false;
            this.showToast('Estrategia activada correctamente', 'cerrar');
            this.getStrategies();
          },
          (error) => {
            this.isLoading = false;
            this.showToast('Error al activar la estrategia', 'cerrar', 'error-toast');
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
        this.router.navigate(['/main/admin'])
      }


}