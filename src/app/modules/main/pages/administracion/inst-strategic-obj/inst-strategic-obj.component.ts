import { Component, OnInit } from "@angular/core";
import { InstStrategicObj } from "src/app/types/InstStrategicObj.types";
import { InstStrategicObjService } from "src/app/core/http/instStrategicObj/inst-strategic-obj.service";
import { MatDialog } from "@angular/material/dialog";
import { ModalInstStrategicObjControl } from "./modal-inst-strategic-obj.component";
import { Router } from "@angular/router";
import { error } from "console";

@Component({
    selector: 'app-strategic-obj',
    templateUrl: './inst-strategic-obj.component.html',
    styleUrls: ['../modulos.component.scss']
})

export class InstStrategicObjComponent implements OnInit{
    instStrategicObj: InstStrategicObj[] = [];

    constructor(
        private router: Router,
        private instStrategicObjService: InstStrategicObjService,
        private dialog: MatDialog
    ){}

    ngOnInit(){
        this.getInstStrategicObj();
    }

    getInstStrategicObj(){
        this.instStrategicObjService.getAll().subscribe((data) =>{
            this.instStrategicObj = data;
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
        this.instStrategicObjService.getById(id).subscribe(
            (instStrategicObj: InstStrategicObj) =>{
                this.openDialog(instStrategicObj);
            },
            (error) => {
                console.error('Error al obtener los detalles de los objetivos estrategicos')
            }
        );
    }

    deleteObj(id: number){
        this.instStrategicObjService.update(id, {estado: false}).subscribe(
            ()=>{
                console.log(`Objetivo estrategico con ID:${id} eliminado correctamente`);
                this.getInstStrategicObj();
            },
            (error) => {
                console.log('Error al eliminar objetvio estrategico', error)
            }
        );
    }
    activateObj(id:number){
        this.instStrategicObjService.update(id, {estado: true}).subscribe(
            () =>{
                this.getInstStrategicObj();
            },
            (error) => {
                console.log(error);
            }
        );
    }
    goBack(){
        this.router.navigate(['main/admin'])
    }

}