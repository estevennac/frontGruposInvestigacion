import { Component,OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { InstStrategicObj } from "src/app/types/InstStrategicObj.types";
import { InstStrategicObjService } from "src/app/core/http/instStrategicObj/inst-strategic-obj.service";
import { error } from "console";

@Component({
    selector: 'app-area',
    templateUrl: './modal-inst-strategic-obj.component.html',
    styleUrls: ['../../../styles/modales.scss']
})
export class ModalInstStrategicObjControl implements OnInit{
    currentUser: string;
    currentDate: Date = new Date();
    instStrategicForm: FormGroup;
    isSaved: boolean = false;
    isLoading: boolean = false;
    isEditing: boolean = false; // Variable para determinar si se está en modo edición

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        public dialogRef: MatDialogRef<ModalInstStrategicObjControl>,
        private instStrategicObjService: InstStrategicObjService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ){}
   
    ngOnInit(): void {
        this.currentUser = this.authService.getUserName();

        // Inicializar el formulario con los controles correspondientes
        this.instStrategicForm = this.fb.group({
            objetivo: ['', Validators.required],
            estado: [1, Validators.required],
        });

        // Si hay datos, significa que se está editando
        if(this.data && this.data.instStrategicObj) {
            this.isEditing = true;
            this.loadInstStrategicObj(this.data.instStrategicObj);
        }
    }

    //Cargar Datos
    loadInstStrategicObj(instStrategicObj: InstStrategicObj) {
        this.instStrategicForm.patchValue({
            objetivo: instStrategicObj.objetivo,
            estado: instStrategicObj.estado
        });
    }

    // Método para guardar (crear o actualizar)
    saveInstStrategocObj() {
        if (this.instStrategicForm.valid) {
        this.isLoading = true; // Mostrar el spinner

        if (this.isEditing) {
            this.updateInstStrategicObj(); // Actualizar la línea
        } else {
            this.createInstStrategicObj(); // Crear una nueva línea
        }
        }
    }

    //Guardar crear o actulizar
    createInstStrategicObj(){
        const instStrategicObjData: InstStrategicObj = this.instStrategicForm.value;
        instStrategicObjData.fechaCreacionObj = this.currentDate;
        instStrategicObjData.usuarioCreadoObj = this.currentUser;

        this.instStrategicObjService.createInstStrategicObjForm(instStrategicObjData).subscribe(
            () => {
                console.log('Objetivo creado correctamente');
                this.isSaved = true;
                this.isLoading = false;
                this.dialogRef.close(true);
            },
            (error) => {
                console.log('Error al crear', error)
                this.isLoading = false;
            }
        );
    }

    //Actualizar objetivos existentes
    updateInstStrategicObj(){
        const updatedData: InstStrategicObj = this.instStrategicForm.value;
        updatedData.fechaModificadoObj = this.currentDate;
        updatedData.usuarioModificadoObj = this.currentUser;

        this.instStrategicObjService.update(this.data.instStrategicObj.idObjetivoEstrategico, updatedData).subscribe(
        () => {
            console.log('Objetivo actualizado correctamente');
            this.isSaved = true;
            this.isLoading = false;
            this.dialogRef.close(true); // Cerrar el modal y retornar éxito
        },
        (error) => {
            console.error('Error al actualizar la línea', error);
            this.isLoading = false;
        }
        );
    }

    onClickClose(): void {
        this.dialogRef.close();
    }
}