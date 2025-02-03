import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OdsService } from 'src/app/core/http/ods/ods.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ODS } from 'src/app/types/ods.types';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar MatSnackBar
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
        private snackBar: MatSnackBar, // Inyectar MatSnackBar
        @Inject(MAT_DIALOG_DATA) public data: any, // Datos que vienen del componente de la tabla
    ) {}

    ngOnInit(): void {
        this.currentUser = this.authService.getUserName();

        // Inicializar el formulario
        this.form = this.fb.group({
            ods: ['', Validators.required],  // Antes tenía "nombreOds"
            descripcion: ['', Validators.required],  // Antes tenía "estado"
            estado: [1, Validators.required],
        });
        

        // Si hay datos, significa que se está editando un dominio
        if (this.data && this.data.ods) {
            this.isEditing = true;
            this.loadData(this.data.ods); // Cargar los datos del dominio para editar
        }
    }

    // Cargar los datos del dominio académico para la edición
    // Cargar los datos del ODS para la edición
loadData(ods: ODS) {
    this.form.patchValue({
        ods: ods.ods, // Antes estaba "nombreOds"
        descripcion: ods.descripcion, // Antes estaba "estado"
        estado: ods.estado
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
        const odsData: ODS = this.form.value;
        odsData.fechaCreacion = this.currentDate;
        odsData.usuarioCreacion = this.currentUser;

        this.odsService.create(odsData).subscribe(
            () => {
                this.showToast('ODS creado correctamente', 'cerrar');
                this.isSaved = true;
                this.isLoading = false; // Ocultar el spinner
                this.dialogRef.close(true); // Cerrar el modal y retornar éxito
            },
            (error) => {
                this.showToast('Error al crear el ODS', 'cerrar', 'error-toast');
                this.isLoading = false; // Ocultar el spinner
            }
        );
    }

    // Editar un dominio académico existente
    update() {
        const updatedData: ODS = this.form.value;
        updatedData.fechaModificacion = this.currentDate;
        updatedData.usuarioModificacion = this.currentUser;

        this.odsService.update(this.data.ods.id, updatedData).subscribe(
            () => {
                this.showToast('ODS actualizado correctamente', 'cerrar');
                this.isSaved = true;
                this.isLoading = false; // Ocultar el spinner
                this.dialogRef.close(true); // Cerrar el modal y retornar éxito
            },
            (error) => {
                this.showToast('Error al actualizar el ODS', 'cerrar', 'error-toast');
                this.isLoading = false; // Ocultar el spinner
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

    onClickClose(): void {
        this.dialogRef.close();
    }
}
