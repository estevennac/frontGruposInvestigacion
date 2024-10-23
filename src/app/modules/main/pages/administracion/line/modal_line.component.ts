import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LineService } from 'src/app/core/http/line/line.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Line } from 'src/app/types/line.types';
import { AreaService } from 'src/app/core/http/area/area.service';

@Component({
  selector: 'app-area',
  templateUrl: './modal_line.component.html',
  styleUrls: ['../../../styles/modales.scss']
})
export class LineaControl implements OnInit {
  currentUser: string;
  currentDate: Date = new Date();
  lineForm: FormGroup;
  isSaved: boolean = false;
  isLoading: boolean = false;
  isEditing: boolean = false; // Variable para determinar si se está en modo edición
  areas: any[] = []; // Áreas cargadas desde el servicio

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<LineaControl>,
    private lineService: LineService,
    private areaService: AreaService,
    @Inject(MAT_DIALOG_DATA) public data: any // Datos que vienen del componente de la tabla
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserName();
    this.loadAreas(); // Cargar áreas desde el servicio

    // Inicializar el formulario con los controles correspondientes
    this.lineForm = this.fb.group({
      nombreLinea: ['', Validators.required],
      idArea: [null, Validators.required], // Campo para almacenar el ID del área
      estado: [1, Validators.required],
    });

    // Si hay datos, significa que se está editando una línea
    if (this.data && this.data.linea) {
      this.isEditing = true;
      this.loadLineData(this.data.linea); // Cargar los datos de la línea para editar
    }
  }

  // Cargar las áreas de investigación activas desde el servicio
  loadAreas(): void {
    this.areaService.getAll().subscribe((data) => {
      this.areas = data.filter(area => area.estado === true); // Filtrar solo áreas activas
    });
  }

  // Cargar los datos de la línea para la edición
  loadLineData(linea: Line): void {
    this.lineForm.patchValue({
      nombreLinea: linea.nombreLinea,
      idArea: linea.idArea, // Asignar el área seleccionada
      estado: linea.estado,
    });
  }

  // Método para guardar (crear o actualizar)
  saveLine(): void {
    if (this.lineForm.valid) {
      this.isLoading = true; // Mostrar el spinner

      if (this.isEditing) {
        this.updateLine(); // Actualizar la línea
      } else {
        this.createLine(); // Crear una nueva línea
      }
    }
  }

  // Crear una nueva línea de investigación
  createLine(): void {
    const lineData: Line = this.lineForm.value;
    lineData.fechaCreacionLinea = this.currentDate;
    lineData.usuarioCreacionLinea = this.currentUser;

    this.lineService.createLineForm(lineData).subscribe(
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
  updateLine(): void {
    const updatedData: Line = this.lineForm.value;
    updatedData.fechaModificacionLinea = this.currentDate;
    updatedData.usuarioModificacionLinea = this.currentUser;

    this.lineService.update(this.data.linea.idLinea, updatedData).subscribe(
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
