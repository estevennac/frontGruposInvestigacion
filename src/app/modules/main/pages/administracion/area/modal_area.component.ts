import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AreaService } from 'src/app/core/http/area/area.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Area } from 'src/app/types/area.types';

@Component({
    selector: 'app-area',
    templateUrl: './modal_area.component.html',
    styleUrls: ['../../../styles/modales.scss']
})
export class AreaControl implements OnInit {
    currentUser: string;
    currentDate: Date = new Date();
    area: Area[] = [];
    areaForm: FormGroup;
    isSaved: boolean = false;
    isLoading: boolean = false;
    isEditing: boolean = false; // Variable para determinar si se está en modo edición

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        public dialogRef: MatDialogRef<AreaControl>,
        private areaService: AreaService,
        @Inject(MAT_DIALOG_DATA) public data: any, // Datos que vienen del componente de la tabla
    ) {}

    ngOnInit(): void {
        this.currentUser = this.authService.getUserName();

        // Inicializar el formulario
        this.areaForm = this.fb.group({
            nombreArea: ['', Validators.required],
            estado: [1, Validators.required],
        });

        // Si hay datos, significa que se está editando un dominio
        if (this.data && this.data.area) {
            this.isEditing = true;
            this.loadAreaData(this.data.area); // Cargar los datos del dominio para editar
        }
    }

    // Cargar los datos del dominio académico para la edición
    loadAreaData(area: Area) {
        this.areaForm.patchValue({
            nombreArea: area.nombreArea,
            estado: area.estado
        });
    }

    // Método para crear o actualizar dependiendo de la acción
    saveArea() {
        if (this.areaForm.valid) {
            this.isLoading = true; // Mostrar el spinner

            if (this.isEditing) {
                this.updateArea();
            } else {
                this.createArea();
            }
        }
    }

    // Crear un nuevo dominio académico
    createArea() {
        const areaData: Area = this.areaForm.value;
        areaData.fechaCreacionArea = this.currentDate;
        areaData.usuarioCreacionArea = this.currentUser;

        this.areaService.createAreaForm(areaData).subscribe(
            () => {
                console.log('Area creada correctamente');
                this.isSaved = true;
                this.isLoading = false; // Ocultar el spinner
                this.dialogRef.close(true); // Cerrar el modal y retornar éxito
            },
            (error) => {
                console.error('Error al crear el area', error);
                this.isLoading = false; // Ocultar el spinner
            }
        );
    }

    // Editar un dominio académico existente
    updateArea() {
        const updatedData: Area = this.areaForm.value;
        updatedData.fechaModificacionArea = this.currentDate;
        updatedData.usuarioModificacionArea = this.currentUser;

        this.areaService.update(this.data.area.idArea, updatedData).subscribe(
            () => {
                console.log('Area actualizado correctamente');
                this.isSaved = true;
                this.isLoading = false; // Ocultar el spinner
                this.dialogRef.close(true); // Cerrar el modal y retornar éxito
            },
            (error) => {
                console.error('Error al actualizar el area', error);
                this.isLoading = false; // Ocultar el spinner
            }
        );
    }

    onClickClose(): void {
        this.dialogRef.close();
    }
}
