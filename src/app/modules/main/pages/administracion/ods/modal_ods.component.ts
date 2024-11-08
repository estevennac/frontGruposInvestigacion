import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ODS } from 'src/app/types/ods.types';
import { OdsService } from 'src/app/core/http/ods/ods.service';

@Component({
    selector: 'app-area',
    templateUrl: './modal_ods.component.html',
    styleUrls: ['../../../styles/modales.scss']
})
export class OdsControl implements OnInit {
    currentUser: string;
    currentDate: Date = new Date();
    ods: ODS[] = [];
    form: FormGroup;
    isSaved: boolean = false;
    isLoading: boolean = false;
    isEditing: boolean = false; // Variable para determinar si se está en modo edición

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        public dialogRef: MatDialogRef<OdsControl>,
        private odsService: OdsService,
        @Inject(MAT_DIALOG_DATA) public data: any, // Datos que vienen del componente de la tabla
    ) {}

    ngOnInit(): void {
        this.currentUser = this.authService.getUserName();

        // Inicializar el formulario
        this.form = this.fb.group({
            ods: ['', Validators.required],
            descripcion: ['', Validators.required],
            //estado: [1, Validators.required],
        });

        // Si hay datos, significa que se está editando un dominio
        if (this.data && this.data.ods) {
            this.isEditing = true;
            this.loadData(this.data.ods); // Cargar los datos del dominio para editar
        }
    }

    // Cargar los datos del dominio académico para la edición
    loadData(ods: ODS) {
        this.form.patchValue({
            ods: ods.ods,
            descripcion: ods.descripcion,
           // estado: ods.estado
        });
    }

    // Método para crear o actualizar dependiendo de la acción
    save() {
        if (this.form.valid) {
            this.isLoading = true; // Mostrar el spinner

            if (this.isEditing) {
                this.update();
            } else {
                this.create();
            }
        }
    }

    // Crear un nuevo dominio académico
    create() {
        const data: ODS = this.form.value;
        data.fechaCreacion = this.currentDate;
        data.usuarioCreacion = this.currentUser;

        this.odsService.create(data).subscribe(
            () => {
                console.log('ODS creada correctamente');
                this.isSaved = true;
                this.isLoading = false; // Ocultar el spinner
                this.dialogRef.close(true); // Cerrar el modal y retornar éxito
            },
            (error) => {
                console.error('Error al crear el ODS', error);
                this.isLoading = false; // Ocultar el spinner
            }
        );
    }

    // Editar un dominio académico existente
    update() {
        const updatedData: ODS = this.form.value;
        updatedData.fechaModificacion = this.currentDate;
        updatedData.usuarioModificacion = this.currentUser;

        this.odsService.update(this.data.ods.idOds, updatedData).subscribe(
            () => {
                console.log('ODS actualizado correctamente');
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
