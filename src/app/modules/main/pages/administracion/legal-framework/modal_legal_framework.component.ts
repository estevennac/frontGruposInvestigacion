import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LegalFrameworkService } from 'src/app/core/http/legal-framework/legalFramework.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { LegalFramework } from 'src/app/types/legalFramework.types';
@Component({
    selector: 'app-academic-domain',
    templateUrl: './modal_legal_framework.component.html',
    styleUrls: ['../../../styles/modales.scss']
})
export class LegalFrameworkControl implements OnInit {
    currentUser: string;
    currentDate: Date = new Date();
    legalFramework: LegalFramework[] = [];
    marcoLegal: FormGroup;
    isSaved: boolean = false;
    isLoading: boolean = false;
    isEditing: boolean = false; // Variable para determinar si se está en modo edición

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        public dialogRef: MatDialogRef<LegalFrameworkControl>,
        private legalFrameworkService: LegalFrameworkService,
        @Inject(MAT_DIALOG_DATA) public data: any, // Datos que vienen del componente de la tabla
    ) {}

    ngOnInit(): void {
        this.currentUser = this.authService.getUserName();

        // Inicializar el formulario
        this.marcoLegal = this.fb.group({
            nombre: ['', Validators.required],
            estado: [1, Validators.required],
        });

        // Si hay datos, significa que se está editando un dominio
        if (this.data && this.data.marco) {
            this.isEditing = true;
            this.loadLegalFrameworkData(this.data.marco); // Cargar los datos del dominio para editar
        }
    }

    // Cargar los datos del dominio académico para la edición
    loadLegalFrameworkData(marco: LegalFramework) {
        this.marcoLegal.patchValue({
            nombre: marco.nombre,
            estado: marco.estado
        });
    }

    // Método para crear o actualizar dependiendo de la acción
    saveLegalFramework() {
        if (this.marcoLegal.valid) {
            this.isLoading = true; // Mostrar el spinner

            if (this.isEditing) {
                this.updateLegalFramework();
            } else {
                this.createLegalFramework();
            }
        }
    }


    createLegalFramework() {
        const legalFrameworknData: LegalFramework = this.marcoLegal.value;
        legalFrameworknData.fechaCreacion = this.currentDate;
        legalFrameworknData.usuarioCreacion = this.currentUser;

        this.legalFrameworkService.createLegalFramework(legalFrameworknData).subscribe(
            () => {
                console.log('Marco Legal creado correctamente');
                this.isSaved = true;
                this.isLoading = false; // Ocultar el spinner
                this.dialogRef.close(true); // Cerrar el modal y retornar éxito
            },
            (error) => {
                console.error('Error al crear el marco Legal', error);
                this.isLoading = false; // Ocultar el spinner
            }
        );
    }

    // Editar un dominio académico existente
    updateLegalFramework() {
        const updatedData: LegalFramework = this.marcoLegal.value;
        updatedData.fechaModificacion = this.currentDate;
        updatedData.usuarioModificacion = this.currentUser;

        this.legalFrameworkService.update(this.data.marco.idMarcoLegal, updatedData).subscribe(
            () => {
                console.log('Marco Legal actualizado correctamente');
                this.isSaved = true;
                this.isLoading = false; // Ocultar el spinner
                this.dialogRef.close(true); // Cerrar el modal y retornar éxito
            },
            (error) => {
                console.error('Error al actualizar el marco Legal', error);
                this.isLoading = false; // Ocultar el spinner
            }
        );
    }

    onClickClose(): void {
        this.dialogRef.close();
    }
}
