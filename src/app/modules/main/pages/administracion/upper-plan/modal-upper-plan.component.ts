import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UpperLevelPlan } from 'src/app/types/upperLevelPlan.types';
import { UpperLevelPlanService } from 'src/app/core/http/upperLevel-plan/upper-level-plan.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ModalUpperPlanControl>,
    private upperPlanService: UpperLevelPlanService,
    private snackBar: MatSnackBar, // Servicio para notificaciones
    @Inject(MAT_DIALOG_DATA) public data: any // Datos del componente padre
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserName();

    // Inicializar el formulario
    this.upperPlanForm = this.fb.group({
      nombre: ['', Validators.required],
      estado: [1, Validators.required],
    });

    // Si hay datos, significa que se está editando
    if (this.data && this.data.upperLevelPlan) {
      this.isEditing = true;
      this.upperPlanData(this.data.upperLevelPlan);
    }
  }

  // Cargar datos en el formulario para edición
  upperPlanData(upperPlan: UpperLevelPlan): void {
    this.upperPlanForm.patchValue({
      nombre: upperPlan.nombre,
      estado: upperPlan.estado,
    });
  }

  // Método para guardar (crear o actualizar)
  saveUpperPlan(): void {
    if (this.upperPlanForm.valid) {
      this.isLoading = true; // Activar el spinner

      if (this.isEditing) {
        this.updateUpperPlan();
      } else {
        this.createUpperPlan();
      }
    }
  }

  // Crear un nuevo plan
  createUpperPlan(): void {
    const upperPlanData: UpperLevelPlan = this.upperPlanForm.value;
    upperPlanData.fechaCreacion = this.currentDate;
    upperPlanData.usuarioCreacion = this.currentUser;

    this.upperPlanService.createUpperLevelPlanForm(upperPlanData).subscribe(
      () => {
        this.showToast('Plan creado correctamente', 'Cerrar', 'success-toast');
        this.isSaved = true;
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      (error) => {
        this.showToast('Error al crear el plan', 'Cerrar', 'error-toast');
        this.isLoading = false;
      }
    );
  }

  // Actualizar un plan existente
  updateUpperPlan(): void {
    const updatedData: UpperLevelPlan = this.upperPlanForm.value;
    updatedData.fechaModificacion = this.currentDate;
    updatedData.usuarioModificacion = this.currentUser;

    this.upperPlanService.update(this.data.upperLevelPlan.idPlanNivelSuperior, updatedData).subscribe(
      () => {
        this.showToast('Plan actualizado correctamente', 'Cerrar', 'success-toast');
        this.isSaved = true;
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      (error) => {
        this.showToast('Error al actualizar el plan', 'Cerrar', 'error-toast');
        this.isLoading = false;
      }
    );
  }

  // Cerrar el modal
  onClickClose(): void {
    this.dialogRef.close();
  }

  // Método para mostrar notificaciones
  private showToast(message: string, action: string, panelClass: string = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: panelClass,
    });
  }
}
