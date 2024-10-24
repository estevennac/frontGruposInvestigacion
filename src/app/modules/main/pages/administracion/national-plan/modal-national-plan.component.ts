import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { NationalPlan } from 'src/app/types/nationalPlan.types';
import { NationalPlanService } from 'src/app/core/http/national-plan/national-plan.service';

@Component({
  selector: 'app-area',
  templateUrl: './modal-national-plan.component.html',
  styleUrls: ['../../../styles/modales.scss']
})
export class ModalNationalControl implements OnInit {
  currentUser: string;
  currentDate: Date = new Date();
  planNationalForm: FormGroup;
  isSaved: boolean = false;
  isLoading: boolean = false;
  isEditing: boolean = false; // Variable para determinar si se está en modo edición
  areas: any[] = []; // Áreas cargadas desde el servicio

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ModalNationalControl>,
    private nationalPlanService: NationalPlanService,
    @Inject(MAT_DIALOG_DATA) public data: any // Datos que vienen del componente de la tabla
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserName();

    // Inicializar el formulario con los controles correspondientes
    this.planNationalForm = this.fb.group({
      nombre: ['', Validators.required],
      numeroPolitica: ['',Validators.required], // Campo para almacenar el ID del área
      descripcion: ['',Validators.required],
      estado: [1, Validators.required],
    });

    // Si hay datos, significa que se está editando una línea
    if (this.data && this.data.nationalPlan) {
      this.isEditing = true;
      this.loadNationalPlanData(this.data.nationalPlan); // Cargar los datos de la línea para editar
    }
  }

  // Cargar los datos de la línea para la edición
  loadNationalPlanData(nationalPlan: NationalPlan): void {
    this.planNationalForm.patchValue({
      nombre: nationalPlan.nombre,
      numeroPolitica: nationalPlan.numeroPolitica,
      descripcion: nationalPlan.descripcion,
      estado: nationalPlan.estado,
    });
  }

  // Método para guardar (crear o actualizar)
  saveNationalPlan(): void {
    if (this.planNationalForm.valid) {
      this.isLoading = true; // Mostrar el spinner

      if (this.isEditing) {
        this.updateNationalPlan(); // Actualizar la línea
      } else {
        this.createNationalPlan(); // Crear una nueva línea
      }
    }
  }

  // Crear una nueva línea de investigación
  createNationalPlan(): void {
    const nationalPlanData: NationalPlan = this.planNationalForm.value;
    nationalPlanData.fechaCreacion = this.currentDate;
    nationalPlanData.usuarioCreacion = this.currentUser;

    this.nationalPlanService.createNationalPlanForm(nationalPlanData).subscribe(
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
  updateNationalPlan(): void {
    const updatedData: NationalPlan = this.planNationalForm.value;
    updatedData.fechaModificacion = this.currentDate;
    updatedData.usuarioModificacion = this.currentUser;

    this.nationalPlanService.update(this.data.nationalPlan.idPlanNacional, updatedData).subscribe(
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
