import { Component, OnInit } from "@angular/core";
import { Strategies } from "src/app/types/strategies.types";
import { StrategiesService } from "src/app/core/http/strategies/strategies.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ModalStrategiesControl } from "./modal-strategies.component";
import { InstStrategicObjService } from "src/app/core/http/instStrategicObj/inst-strategic-obj.service";

@Component({
    selector: 'app-strategies',
    templateUrl: './strategies.component.html',
    styleUrls: ['../modulos.component.scss']
})

export class StrategiesComponent implements OnInit {
    strategies: Strategies[] = [];
    objetivos:any[]=[];

    constructor(
        private router: Router,
        private strategiesService: StrategiesService,
        private instStrategiesService: InstStrategicObjService,
        private dialog: MatDialog
    ){}

    ngOnInit(){
       this.getStrategies(); 
    }

    getStrategies(){
      this.instStrategiesService.getAll().subscribe((objetivosData)=>{
        this.objetivos=objetivosData;
        this.strategiesService.getAll().subscribe((data) => {
          this.strategies = data.map((estrategia)=>{
            const objetivo=this.objetivos.find(o=>o.idObjetivoEstrategico==estrategia.idObjetivo);
            return {
              ...estrategia,
              objetivo:objetivo ? objetivo.objetivo:'objetivo no encontrado'
            };
          });
      });
      });
        
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
        this.strategiesService.getById(id).subscribe(
          (strategies: Strategies) => {
            this.router.navigate(['/main/strategies/edit'], { state: { strategies } });
          },
          (error) => {
            console.error('Error al obtener las estrategias', error);
          }
        );
    }

    deleteStrategies(id: number,idObjetivo:number) {
        this.strategiesService.update(id, { idObjetivo:idObjetivo,estado: false}).subscribe(
          () => {
            console.log(`Estrategia con ID ${id} eliminado correctamente`);
            this.getStrategies();
          },
          (error) => {
            console.error('Error al eliminar Estrategia', error);
          }
        );
    }
      activateStrategies(id: number,idObjetivo:number) {
        this.strategiesService.update(id, { idObjetivo:idObjetivo,estado: true }).subscribe(
          () => {
            console.log(`Estrategia con ID ${id} eliminado correctamente`);
            this.getStrategies();
          },
          (error) => {
            console.error('Error al eliminar el dominio académico', error);
          }
        );
      }
      goBack() {
        this.router.navigate(['/main/admin'])
      }


}