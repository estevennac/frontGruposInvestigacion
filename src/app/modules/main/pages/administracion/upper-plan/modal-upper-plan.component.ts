import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UpperLevelPlan } from 'src/app/types/upperLevelPlan.types';
import { UpperLevelPlanService } from 'src/app/core/http/upperLevel-plan/upper-level-plan.service';

@Component({
  selector: 'app-area',
  templateUrl: './modal-upper-plan.component.html',
  styleUrls: ['../../../styles/modales.scss']
})
export class ModalUpperPlanControl implements OnInit {
  currentUser: string;
  currentDate: Date = new Date();
  upperPlanForm: FormGroup;
  isSaved: boolean = false;
  isLoading: boolean = false;
  isEditing: boolean = false; // Variable para determinar si se está en modo edición
  areas: any[] = []; // Áreas cargadas desde el servicio

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ModalUpperPlanControl>,
    private upperPlanService: UpperLevelPlanService,
    @Inject(MAT_DIALOG_DATA) public data: any // Datos que vienen del componente de la tabla
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserName();

    // Inicializar el formulario con los controles correspondientes
    this.upperPlanForm = this.fb.group({
      nombre: ['', Validators.required],
      estado: [1, Validators.required],
    });

    // Si hay datos, significa que se está editando una línea
    if (this.data && this.data.upperLevelPlan) {
      this.isEditing = true;
      this.upperPlanData(this.data.upperLevelPlan); // Cargar los datos de la línea para editar
    }
  }

  // Cargar los datos de la línea para la edición
  upperPlanData(nationalPlan: UpperLevelPlan): void {
    this.upperPlanForm.patchValue({
      nombre: nationalPlan.nombre,
      estado: nationalPlan.estado,
    });
  }

  // Método para guardar (crear o actualizar)
  saveUpperPlan(): void {
    if (this.upperPlanForm.valid) {
      this.isLoading = true; // Mostrar el spinner

      if (this.isEditing) {
        this.updateUpperPlan(); // Actualizar la línea
      } else {
        this.createUpperPlan(); // Crear una nueva línea
      }
    }
  }

  // Crear una nueva línea de investigación
  createUpperPlan(): void {
    const upperPlanData: UpperLevelPlan = this.upperPlanForm.value;
    upperPlanData.fechaCreacion = this.currentDate;
    upperPlanData.usuarioCreacion = this.currentUser;

    this.upperPlanService.createUpperLevelPlanForm(upperPlanData).subscribe(
      () => {
        console.log('Línea creada correctamente');
        this.isSaved = true;
        this.isLoading = false;
        this.dialogRef.close(true); // Cerrar el modal y retornar éxito
      },
      (error) => {
        console.error('Error al crear la línea', error);
        this.isLoading = false;
      }
    );
  }

  // Actualizar una línea existente
  updateUpperPlan(): void {
    const updatedData: UpperLevelPlan = this.upperPlanForm.value;
    updatedData.fechaModificacion = this.currentDate;
    updatedData.usuarioModificacion = this.currentUser;

    this.upperPlanService.update(this.data.upperLevelPlan.idPlanNivelSuperior, updatedData).subscribe(
      () => {
        console.log('Línea actualizada correctamente');
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

  // Cerrar el modal
  onClickClose(): void {
    this.dialogRef.close();
  }
}
