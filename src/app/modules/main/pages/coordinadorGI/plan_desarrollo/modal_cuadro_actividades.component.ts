import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { error } from "console";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ControlPanelService } from "src/app/core/http/control-panel/control-panel.service";
import { ControlPanelForm } from "src/app/types/controlPanel.types";

@Component({
    selector: 'app-area',
    templateUrl: './modal_cuadro_actividades.component.html',
    styleUrls: ['../../../styles/modales.scss']
})
export class ActControl implements OnInit{
    currentUser: string;
    currentDate: Date = new Date();
    controlPanelForm: FormGroup;
    isSaved: boolean = false;
    isLoading: boolean = false;
    isEditing: boolean = false;
    controlPanel: ControlPanelForm []= [];
    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        public dialogRef: MatDialogRef<ActControl>,
        private controlPanelService: ControlPanelService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ){}

    ngOnInit(): void {
        this.currentUser = this.authService.getUserName();
        //
        this.controlPanelForm = this.fb.group({
            idPlanDesarrollo:[null, Validators.required],
            idObjetivoEspecifico:[null, Validators.required],
            idResponsable:[null, Validators.required],
            actividad: ['', Validators.required],
            indicadorNombre:['', Validators.required],
            indicadorTipo:['', Validators.required],
            indicadorForma:['', Validators.required],
            indicadorCondicional:['', Validators.required],
            indicadorAcumulativo:['', Validators.required],
            meta1:[null, Validators.required],
            meta2:[null, Validators.required],
            meta3:[null, Validators.required],
            meta4:[null, Validators.required],
            financiamiento:[null, Validators.required],
            observacion:['', Validators.required]
        });

    }

    /*
    loadData():void{
        this.controlPanelService.getAll().subscribe((data) =>{
           
        })
    }*/

    controlPanelData(controlPanel: ControlPanelForm): void{
        this.controlPanelForm.patchValue({
            idPlanDesarrollo: controlPanel.idPlanDesarrollo,
            idObjetivoEspecifico:controlPanel.idObjetivoEspecifico,
            idResponsable: controlPanel.idResponsable,
            actividad: controlPanel.actividad,
            indicadorNombre: controlPanel.indicadorNombre,
            indicadorTipo: controlPanel.indicadorTipo,
            indicadorForma: controlPanel.indicadorForma,
            indicadorCondicional: controlPanel.indicadorCondicional,
            indicadorAcumulativo: controlPanel.indicadorAcumulativo,
            meta1: controlPanel.meta1,
            meta2: controlPanel.meta2,
            meta3: controlPanel.meta3,
            meta4: controlPanel.meta4,
            financiamiento: controlPanel.financiamiento,
            observacion: controlPanel.observacion
        });
    }

    saveControlPanel():void {
        if (this.controlPanelForm.valid){
            this.isLoading = true;

            if(this.isEditing){
                this.updateControlPane();
            }else{
                this.createControlPanel();
            }
        }
    }

    createControlPanel(): void {
        const controlPanelData: ControlPanelForm = this.controlPanelForm.value;
        controlPanelData.fechaCreacion = this.currentDate;
        controlPanelData.usuarioCreacion = this.currentUser;

        this.controlPanelService.createControlPanelForm(controlPanelData).subscribe(
            () => {
                this.isSaved = true;
                this.isLoading = false;
                this.dialogRef.close(true);
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    updateControlPane(): void{
        const updatedData: ControlPanelForm = this.controlPanelForm.value;
        updatedData.fechaModificacion = this.currentDate;
        updatedData.usuarioModificacion = this.currentUser;

        this.controlPanelService.update(this.data.controlPanel.idPanelControl, updatedData).subscribe(
            () => {
                this.isSaved = true;
                this.isLoading = false
                this.dialogRef.close(true);
            },
            (error) =>{
                this.isLoading = false;
            }
        );
    }

    onClickClose():void {
        this.dialogRef.close();
    }
    

}