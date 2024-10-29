import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { StrategiesService } from "src/app/core/http/strategies/strategies.service";
import { Strategies } from "src/app/types/strategies.types";

@Component({
    selector: 'app-strategies',
    templateUrl: './modal-strategies.component.html',
    styleUrls: ['../modulos.component.scss']
})

export class ModalStrategiesControl implements OnInit {
    currentUser: string;
    currentDate: Date = new Date();
    strategiesForm: FormGroup;
    isSaved: boolean = false;
    isLoading: boolean = false;
    isEditing: boolean = false; // Variable para determinar si se está en modo edición
  
    constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      public dialogRef: MatDialogRef<ModalStrategiesControl>,
      private strategiesService: StrategiesService,
      @Inject(MAT_DIALOG_DATA) public data: any // Datos que vienen del componente de la tabla
    ) {}
  
    ngOnInit(): void {
      this.currentUser = this.authService.getUserName();
  
      // Inicializar el formulario con los controles correspondientes
      this.strategiesForm = this.fb.group({
        //Id 
        estrategia: ['', Validators.required],
        ods: ['',Validators.required],
        estado: [1, Validators.required],
      });
  
      // Si hay datos, significa que se está editando una línea
      if (this.data && this.data.strategies) {
        this.isEditing = true;
        this.strategiesData(this.data.strategies); // Cargar los datos de la línea para editar
      }
    }
  
    // Cargar los datos de la línea para la edición
    strategiesData(strategies: Strategies): void {
      this.strategiesForm.patchValue({
        estrategia: strategies.estrategia,
        ods: strategies.ods,
        estado: strategies.estado,
      });
    }
  
    // Método para guardar (crear o actualizar)
    saveStrategies(): void {
      if (this.strategiesForm.valid) {
        this.isLoading = true; // Mostrar el spinner
  
        if (this.isEditing) {
          this.updateStrategies(); 
        } else {
          this.createStrategies(); 
        }
      }
    }
  
    // Crear una nueva línea de investigación
    createStrategies(): void {
      const strategiesData: Strategies = this.strategiesForm.value;
      strategiesData.fechaCreacion = this.currentDate;
      strategiesData.usuarioCreacion = this.currentUser;
  
      this.strategiesService.createStrategiesForm(strategiesData).subscribe(
        () => {
          //console.log('Línea creada correctamente');
          this.isSaved = true;
          this.isLoading = false;
          this.dialogRef.close(true); 
        },
        (error) => {
          //console.error('Error al crear la línea', error);
          this.isLoading = false;
        }
      );
    }
  
    // Actualizar una línea existente
    updateStrategies(): void {
      const updatedData: Strategies = this.strategiesForm.value;
      updatedData.fechaModificacion = this.currentDate;
      updatedData.usuarioModificacion = this.currentUser;
  
      this.strategiesService.update(this.data.strategies.idEstrategia, updatedData).subscribe(
        () => {
          //console.log('Línea actualizada correctamente');
          this.isSaved = true;
          this.isLoading = false;
          this.dialogRef.close(true); // Cerrar el modal y retornar éxito
        },
        (error) => {
          //console.error('Error al actualizar la línea', error);
          this.isLoading = false;
        }
      );
    }
  
    // Cerrar el modal
    onClickClose(): void {
      this.dialogRef.close();
    }
}