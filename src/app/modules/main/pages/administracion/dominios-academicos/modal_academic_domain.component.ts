import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AcademicDomainService } from 'src/app/core/http/academic-domain/academic-domain.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { AcademicDomain } from 'src/app/types/academicDomain.types';

@Component({
    selector: 'app-academic-domain',
    templateUrl: './modal_academic_domain.component.html',
    styleUrls: ['../../../styles/modales.scss']
})
export class AcademicDomainsControl implements OnInit {
    currentUser: string;
    currentDate: Date = new Date();
    academicDomain: AcademicDomain[] = [];
    dominioAcademico: FormGroup;
    isSaved: boolean = false;
    isLoading: boolean = false;
    isEditing: boolean = false; // Variable para determinar si se está en modo edición

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        public dialogRef: MatDialogRef<AcademicDomainsControl>,
        private academicDomainService: AcademicDomainService,
        @Inject(MAT_DIALOG_DATA) public data: any, // Datos que vienen del componente de la tabla
    ) {}

    ngOnInit(): void {
        this.currentUser = this.authService.getUserName();

        // Inicializar el formulario
        this.dominioAcademico = this.fb.group({
            nombreDominioAcademico: ['', Validators.required],
            estado: [1, Validators.required],
        });

        // Si hay datos, significa que se está editando un dominio
        if (this.data && this.data.dominio) {
            this.isEditing = true;
            this.loadAcademicDomainData(this.data.dominio); // Cargar los datos del dominio para editar
        }
    }

    // Cargar los datos del dominio académico para la edición
    loadAcademicDomainData(dominio: AcademicDomain) {
        this.dominioAcademico.patchValue({
            nombreDominioAcademico: dominio.nombreDominioAcademico,
            estado: dominio.estado
        });
    }

    // Método para crear o actualizar dependiendo de la acción
    saveAcademicDomain() {
        if (this.dominioAcademico.valid) {
            this.isLoading = true; // Mostrar el spinner

            if (this.isEditing) {
                this.updateAcademicDomain();
            } else {
                this.createAcademicDomain();
            }
        }
    }

    // Crear un nuevo dominio académico
    createAcademicDomain() {
        const academicDomainData: AcademicDomain = this.dominioAcademico.value;
        academicDomainData.fechaCreacionDominio = this.currentDate;
        academicDomainData.usuarioCreacionDominio = this.currentUser;

        this.academicDomainService.createAcademicDomainForm(academicDomainData).subscribe(
            () => {
                console.log('Dominio académico creado correctamente');
                this.isSaved = true;
                this.isLoading = false; // Ocultar el spinner
                this.dialogRef.close(true); // Cerrar el modal y retornar éxito
            },
            (error) => {
                console.error('Error al crear el dominio académico', error);
                this.isLoading = false; // Ocultar el spinner
            }
        );
    }

    // Editar un dominio académico existente
    updateAcademicDomain() {
        const updatedData: AcademicDomain = this.dominioAcademico.value;
        updatedData.fechaModificacionDominio = this.currentDate;
        updatedData.usuarioModificacionDominio = this.currentUser;

        this.academicDomainService.update(this.data.dominio.idDomimioAcademico, updatedData).subscribe(
            () => {
                console.log('Dominio académico actualizado correctamente');
                this.isSaved = true;
                this.isLoading = false; // Ocultar el spinner
                this.dialogRef.close(true); // Cerrar el modal y retornar éxito
            },
            (error) => {
                console.error('Error al actualizar el dominio académico', error);
                this.isLoading = false; // Ocultar el spinner
            }
        );
    }

    onClickClose(): void {
        this.dialogRef.close();
    }
}
