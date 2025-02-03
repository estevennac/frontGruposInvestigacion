import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AreaService } from 'src/app/core/http/area/area.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Area } from 'src/app/types/area.types';
import { AcademicDomainService } from 'src/app/core/http/academic-domain/academic-domain.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar MatSnackBar

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
    dominios: any[] = []; // Dominios cargados desde el servicio

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        public dialogRef: MatDialogRef<AreaControl>,
        private areaService: AreaService,
        private dominiosService: AcademicDomainService,
        private snackBar: MatSnackBar, // Inyectar MatSnackBar
        @Inject(MAT_DIALOG_DATA) public data: any, // Datos que vienen del componente de la tabla
    ) {}

    ngOnInit(): void {
        this.currentUser = this.authService.getUserName();
        this.loadDominios();
        // Inicializar el formulario
        this.areaForm = this.fb.group({
            nombreArea: ['', Validators.required],
            idDominio: [null, Validators.required],
            estado: [1, Validators.required],
        });

        // Si hay datos, significa que se está editando un área
        if (this.data && this.data.area) {
            this.isEditing = true;
            this.loadData(this.data.area); // Cargar los datos del área para editar
        }
    }

    loadDominios() {
        this.dominiosService.getAll().subscribe((data) => {
            this.dominios = data.filter(dominio => dominio.estado === true);
        });
    }

    // Cargar los datos del área para la edición
    loadData(area: Area) {
        this.areaForm.patchValue({
            nombreArea: area.nombreArea,
            idDominio: area.idDominio,
            estado: area.estado
        });
    }

    // Método para crear o actualizar dependiendo de la acción
    save() {
        if (this.areaForm.valid) {
            this.isLoading = true; // Mostrar el spinner

            if (this.isEditing) {
                this.update();
            } else {
                this.create();
            }
        }
    }

    // Crear un nuevo área
    create() {
        const areaData: Area = this.areaForm.value;
        areaData.fechaCreacionArea = this.currentDate;
        areaData.usuarioCreacionArea = this.currentUser;

        this.areaService.createAreaForm(areaData).subscribe(
            () => {
                console.log('Área creada correctamente');
                this.isSaved = true;
                this.isLoading = false; // Ocultar el spinner
                this.showToast('Área creada correctamente', 'cerrar'); // Mostrar toast de éxito
                this.dialogRef.close(true); // Cerrar el modal y retornar éxito
            },
            (error) => {
                console.error('Error al crear el área', error);
                this.isLoading = false; // Ocultar el spinner
                this.showToast('Error al crear el área. Intenta más tarde', 'cerrar', 'error-toast'); // Mostrar toast de error
            }
        );
    }

    // Editar un área existente
    update() {
        const updatedData: Area = this.areaForm.value;
        updatedData.fechaModificacionArea = this.currentDate;
        updatedData.usuarioModificacionArea = this.currentUser;

        this.areaService.update(this.data.area.idArea, updatedData).subscribe(
            () => {
                console.log('Área actualizada correctamente');
                this.isSaved = true;
                this.isLoading = false; // Ocultar el spinner
                this.showToast('Área actualizada correctamente', 'cerrar'); // Mostrar toast de éxito
                this.dialogRef.close(true); // Cerrar el modal y retornar éxito
            },
            (error) => {
                console.error('Error al actualizar el área', error);
                this.isLoading = false; // Ocultar el spinner
                this.showToast('Error al actualizar el área. Intenta más tarde', 'cerrar', 'error-toast'); // Mostrar toast de error
            }
        );
    }

    // Mostrar el toast
    private showToast(message: string, action: string, panelClass: string = '') {
        this.snackBar.open(message, action, {
            duration: 3000, // Duración del toast
            verticalPosition: 'top', // Posición en la parte superior
            panelClass: panelClass, // Clase CSS para aplicar estilos personalizados
        });
    }

    onClickClose(): void {
        this.dialogRef.close();
    }
}
